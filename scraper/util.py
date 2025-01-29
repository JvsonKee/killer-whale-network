from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

def get_section_limit(driver, section_id):
    section_container = driver.find_element(By.XPATH, f'/html/body/div[1]/main/article/section[{section_id}]/div[2]/div/div/div')
    return len(section_container.find_elements(By.XPATH, 'div'))

def scrape_pods(driver):
    pod_ids = [3, 10, 15]
    pods = []

    for pod_id in pod_ids:
        pods.append(scrape_pod(driver, pod_id))

    return pods

def scrape_pod(driver, section_id):

    name = "J Pod" if section_id == 3 else "K Pod" if section_id == 10 else "L Pod"

    families = scrape_families(driver, section_id)
    members = []

    for family in families:
        for member in family['family_members']:
            if member['id'] not in [member['id'] for member in members]:
                members.append(member)

    pod = {
        'name': name,
        'matrilines': [],
        'families': families,
        'members': members
    }

    return pod

def scrape_families(driver, section_id):
    families = []

    for i in range(6, get_section_limit(driver, section_id)):
        scrape_family(driver, section_id, i)
        family = scrape_family(driver, section_id, i)
        families.append(family)

    return families


def scrape_family(driver, section_id, index):
    family_string = driver.find_element(By.XPATH, f'/html/body/div[1]/main/article/section[{section_id}]/div[2]/div/div/div/div[{index}]/div/div/div/p').text
    parts = family_string.splitlines()

    family_id = parts[0]
    members = []

    for member in parts[1:]:
        members.append(scrape_member(member))

    family = {
        'id': family_id,
        'matriarch': '',
        'family_members': members
    }

    return family

def scrape_member(member_string):
    id_and_nickname, bracketed = member_string.split("(", 1)
    id_and_nickname = id_and_nickname.strip()
    bracketed = bracketed.rstrip(")")

    if (len(id_and_nickname.split()) < 2):
        member_id = id_and_nickname
        nickname = None
    else:
        member_id, nickname = id_and_nickname.split(" ", 1)
    
    parts = bracketed.split(", ")

    member = {
        'id': member_id,
        'nickname': nickname,
        'sex': parts[0],
        'birth_year': int(parts[1][-4:]),
        'pod': member_id[0]
    }

    return member