#################################################
# Code to pull top 250 Beers from Beer Advocate #
# Exports data as .csv for further manipulation #
#################################################


# Import Relevant packages
from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
import time


# Save Start Time (personal preference, I like to time everything I run)
t1 = time.time()


# Select URL and create some soup
url= requests.get('https://www.beeradvocate.com/lists/top/').text
soup = BeautifulSoup(url, 'lxml')


# Find the data table in question
My_table = soup.find('table')


# From the table, pull all ABV Percentages
abv_data = My_table.find_all(text=re.compile('%'))


# Correct the format of the ABVs (remove leading white space and trailing `%` sign
for i in range(len(abv_data)):
    abv_data[i] = float(abv_data[i][3:-1])


# Grab Rating Data in <b> tags
rating_data = [b.string for b in My_table.findAll('b')]


# Initialize 3 lists to store data from `rating_data`
beer_1 = []
reviews = []
rating = []


# Append `rating_data` to beer_1, reviews, and rating files
i = 0
while i < len(rating_data):
    beer_1.append(rating_data[i])
    reviews.append(rating_data[i + 1])
    rating.append(rating_data[i + 2])
    i += 3


# remove 4 beers with missing data
# (Manual for now, need to find better method)
del(beer_1[196])
del(beer_1[97])
del(beer_1[51])
del(beer_1[48])

del(reviews[196])
del(reviews[97])
del(reviews[51])
del(reviews[48])

del(rating[196])
del(rating[97])
del(rating[51])
del(rating[48])


# Create dictionary and data frame from above data
dict_1 = {'Beer': beer_1, 'Number of Reviews': reviews, 'Rating': rating, 'ABV': abv_data}
df = pd.DataFrame(data=dict_1)


# SAME THING as we did for ratings/reviews, do for style
style_data = [a.string for a in My_table.findAll('a')]

beer_2 = []
brewery = []
style = []


i = 1
while i < len(style_data):
    beer_2.append(style_data[i])
    brewery.append(style_data[i + 1])
    style.append(style_data[i + 2])
    i += 3


del(beer_2[196])
del(beer_2[97])
del(beer_2[51])
del(beer_2[48])

del(brewery[196])
del(brewery[97])
del(brewery[51])
del(brewery[48])

del(style[196])
del(style[97])
del(style[51])
del(style[48])


dict_2 = {'Beer': beer_2, 'Brewery': brewery, 'Style': style}
df2 = pd.DataFrame(data=dict_2)


# Merge the two data frames together into one #
df3 = pd.merge(left=df, right=df2, how='left', on='Beer')


# Save Frame to csv
df3.to_csv('/Users/logan.ice/Documents/python_code/df3.csv')


# Save Finish Time for elapsed calculations
t2 = time.time()


# Print Total elapsed time
print("The file ran in: "+str(round(t2-t1, 2))+" seconds")
