from selenium import webdriver
from selenium.webdriver.common.by import By
from util import scrape_pods, scrape_pod

def main():
    url = 'https://www.orcaconservancy.org/meet-the-southern-residents'
    driver = webdriver.Chrome()
    driver.get(url)

    pods = scrape_pods(driver)

    print(pods)

    while True:
        continue

if __name__ == '__main__':
    main()


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