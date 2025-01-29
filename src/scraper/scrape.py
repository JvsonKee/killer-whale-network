from selenium import webdriver
from selenium.webdriver.common.by import By
from util import scrape_ids

def scrape():
    driver = webdriver.Chrome()
    url = 'https://killerwhales.fandom.com/wiki/Category:Living_Wild_Orcas'
    driver.get(url)

    scrape_ids(driver)

scrape()




# use this to get total number of sections on page
# //*[@id="mw-content-text"]/div[3]

# iterate through each section and only scrape the data for "J", "K", and "L"
# //*[@id="mw-content-text"]/div[3]/div[index]/div

# this contains the sections with each whale's name
# //*[@id="mw-content-text"]/div[3]/div[7]/ul

# extract the name of the whale
# //*[@id="mw-content-text"]/div[3]/div[7]/ul/li[1]/a






# jpod: /html/body/div[1]/main/article/section[3]/div[2]/div/div/div/div[5]/div/div/div/p[1]

# kpod: /html/body/div[1]/main/article/section[10]/div[2]/div/div/div/div[5]/div/div/div/p[1]

# lpod: /html/body/div[1]/main/article/section[15]/div[2]/div/div/div/div[5]/div/div/div/p[1]

# pod section ids: 
#    3 (j pod) 
#   10 (k pod)
#   15 (l pod)

# use pod section to get total number of sections
# pod section: /html/body/div[1]/main/article/section[{section-id}]/div[2]/div/div/div

# iterate from 6th index to total number of sections
# family: /html/body/div[1]/main/article/section[{section-id}]/div[2]/div/div/div/div[{n}]/div/div/div/p

# each family text is going to return a string with line breaks
# split the string by line breaks 
# the first element is the family id
# the following are the members of the family

# from each family member we can extract the following:
    # id
    # nickname
    # sex
    # birth year

    # format: "id nickname (sex, born year)"

# create an object (dictionary) with the extracted data