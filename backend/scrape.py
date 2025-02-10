import util
import database as db
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from psycopg2.extras import DictCursor

def scrape():
    options = Options()
    options.page_load_strategy = 'eager'
    driver = webdriver.Chrome(options=options)

    url = 'https://killerwhales.fandom.com/wiki/Category:Living_Wild_Orcas'
    driver.get(url)

    conn = None
    cur = None

    try:
        conn = db.connect()
        cur = conn.cursor(cursor_factory=DictCursor)

        # reset db
        db.reset_db(cur)

        util.initialize_ids_and_names(driver, 1, cur)
        
        util.insert_granny(cur)

        # retrieve whale information
        whales = db.fetch_whales(cur)

        # visit the corresponding whales' page and scrape their data
        util.scrape_whales(driver, cur, whales)

        conn.commit()

    except Exception as error:
        print(error)
    finally:
        db.close(conn, cur)


if __name__ == '__main__':
    scrape()