import re
from database import insert_whale, insert_pod, update_whale
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains 

def initialize_ids_and_names(driver, n, cur):
    sections_len = len(driver.find_elements(By.XPATH, '//*[@id="mw-content-text"]/div[3]/div'))
    
    pod_indices = []
    pod_counts = []

    # insert relevant pods into db and get their indices for scraping
    for i in range(1, sections_len + 1):
        curr_letter = driver.find_element(By.XPATH, f'//*[@id="mw-content-text"]/div[3]/div[{i}]/div').text
        
        if curr_letter == 'J' or curr_letter == 'K' or curr_letter == 'L':
            pod = (curr_letter, f'{curr_letter} Pod')
            insert_pod(cur, pod)

            pod_indices.append(i)
            pod_counts.append(len(driver.find_elements(By.XPATH, f'//*[@id="mw-content-text"]/div[3]/div[{i}]/ul/li')) + 1)

    # iterate through pod list, parse whale information, and insert to db
    for i in range(len(pod_indices)):
        for j in range(1, pod_counts[i]):
            id_and_name = driver.find_element(By.XPATH, f'//*[@id="mw-content-text"]/div[3]/div[{pod_indices[i]}]/ul/li[{j}]/a').text
            
            parts = id_and_name.split(" ", 1)
            
            whale_id = parts[0]
            whale = None
            pod = whale_id[0]

            if (len(parts) < 2):
                if whale_id[-1].isdigit():
                    whale = (whale_id, None, None, None, None, None, None, pod)
                else:
                    continue
            else:
                name = parts[1]
                whale = (whale_id, name, None, None, None, None, None, pod)
            
            insert_whale(cur, whale)

    # navigate to deceased page and parse whale data
    if n > 0:
        try:
            navigate_menu(driver, 2)
            initialize_ids_and_names(driver, n - 1, cur)
        except NoSuchElementException:
            return
        

# menu navigation function
# index = 1: living
# index = 2: deceased
def navigate_menu(driver, index):
    menu = driver.find_element(By.XPATH, '/html/body/div[4]/div[4]/div[1]/header/nav/ul/li[3]/div[1]/a')

    action = ActionChains(driver)
    action.move_to_element(menu).perform()

    driver.find_element(By.XPATH, f'/html/body/div[4]/div[4]/div[1]/header/nav/ul/li[3]/div[2]/ul/li[{index}]/a').click()


# visit each whales page and scrape the relevant data
def scrape_whales(driver, cur, whales):
    for whale in whales:
        whale_id = whale["whale_id"]
        path = ""

        if (whale["name"] is not None):
            name = whale["name"].replace(" ", "_").replace("'", "%27")
            path = f'{whale["whale_id"]}_{name}'
        else:
            path = f'{whale["whale_id"]}'

        driver.get(f'https://killerwhales.fandom.com/wiki/{path}')
        
        scrape_whale(driver, cur, whale_id)


def scrape_whale(driver, cur, whale_id):
    gender, birth_year, death_year, mother_id, father_id = (None, None, None, None, None)
    
    gender = scrape_gender(driver)
    birth_year = scrape_birth_year(driver)
    death_year = scrape_death_year(driver)
    mother_id = scrape_mother_id(driver)
    father_id = scrape_father_id(driver)

    whale = (gender, birth_year, death_year, mother_id, father_id, whale_id)
    
    update_whale(cur, whale)


def scrape_gender(driver):
    gender_sources = [
                        '//*[@id="mw-content-text"]/div/aside/div[2]/div',
                        '//*[@id="mw-content-text"]/div/aside/div[3]/div',
                        '//*[@id="mw-content-text"]/div/aside/div[4]/div',
                        '//*[@id="mw-content-text"]/div/aside/div[4]/div/i'
                    ]

    for source in gender_sources:
        try:
            gender = driver.find_element(By.XPATH, f'{source}').text.split(" ", 1)[-1].lower()

            if gender in {"unknown", "male", "female"}:
                return gender
            
        except NoSuchElementException:
            continue

    return None
        

def scrape_birth_year(driver):
    birth_sources = [
        '//*[@id="mw-content-text"]/div/aside/div[3]/div',
        '//*[@id="mw-content-text"]/div/aside/div[4]/div',
        '//*[@id="mw-content-text"]/div/aside/div[5]/div',
    ]

    for source in birth_sources:
        try:
            birth_text = driver.find_element(By.XPATH, f'{source}').text
            birth_year = parse_year(birth_text)

            if isinstance(birth_year, int):
                return birth_year
            
        except NoSuchElementException:
            continue
    
    return None


def scrape_death_year(driver):
    death_sources = [
        '//*[@id="mw-content-text"]/div/aside/div[4]',
        '//*[@id="mw-content-text"]/div/aside/div[6]',
        '//*[@id="mw-content-text"]/div/aside/div[9]',
        '//*[@id="mw-content-text"]/div/aside/div[5]',
    ]
    
    death_year = None

    for source in death_sources:
        try:
            death_elem = driver.find_element(By.XPATH, f'{source}/h3')

            if death_elem.text == "Date of Death":
                death_text = driver.find_element(By.XPATH, f'{source}/div').text
                death_year = parse_year(death_text)

            if isinstance(death_year, int):
                return death_year

        except NoSuchElementException:
            continue
    
    return None


def scrape_mother_id(driver):
    try:
        mother_elem = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div/aside/section[2]/div/h3 | //*[@id="mw-content-text"]/div/aside/section[2]/div[1]/h3')
        if mother_elem.text == "Mother":
            mother_text = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div/aside/section[2]/div[1]/div/ul/li/a/u/i/b | //*[@id="mw-content-text"]/div/aside/section[2]/div[1]/div/a/u/b | //*[@id="mw-content-text"]/div/aside/section[2]/div[1]/div/ul/li/a/u/b | //*[@id="mw-content-text"]/div/aside/section[2]/div[1]/div/a/u/i/b | //*[@id="mw-content-text"]/div/aside/section[2]/div[1]/div/a/b/u | //*[@id="mw-content-text"]/div/aside/section[2]/div[1]/div/b/u/a').text
            return mother_text.split(" ")[0]

    except NoSuchElementException:
        return None


def scrape_father_id(driver):
    try:
        father_elem = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div/aside/section[2]/div[2]/h3')
        if father_elem.text == "Father":
            father_text = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div/aside/section[2]/div[2]/div/a | //*[@id="mw-content-text"]/div/aside/section[2]/div[2]/div/i/a').text
            return father_text.split(" ")[0]

    except NoSuchElementException:
        return None


def insert_granny(cur):
    whale_id = 'J2'
    name = 'Granny'
    pod_id = 'J'

    granny = (whale_id, name, None, None, None, None, None, pod_id)

    insert_whale(cur, granny)


# parses an input string and returns the year found within it
def parse_year(text):
    match = re.search(r'\b(18[0-9]{2}|19[0-9]{2}|20[0-2][0-9])\b', text)
    return int(match.group()) if match else None
