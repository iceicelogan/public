#############################################################
#                                                           #
#  Program to read csv and produce gif of associated plots  #
#                   Data is the MLB!                        #
#                                                           #
#############################################################


# Load requisite packages
# dplyr = manipulation
# ggplot2 = charts
library(dplyr)
library(ggplot2)


# Read csv file (change as needed)
batting <- read.csv('file',stringsAsFactors = FALSE)


# Filter data to 1910+
# Summarize by year, dropping individual stats
# Create batting and strikeout averages in aggregate
b2 <- batting %>%
  filter(yearID > 1910 ) %>%
  group_by(yearID) %>%
  summarise(SO = sum(SO), AB = sum(AB)) %>%
  mutate(batting_average = H/(AB),strikeout_rate = SO/(AB+BB))


# Create a charting function with a max date
# This filters to just data up to a variable date
chart_it<-function(dateMax=max(b2$yearID)){
  
  ggplot(data=filter(b2, yearID <= dateMax), aes(x=yearID))+
    geom_point(aes(y = strikeout_rate, color = "strikeout_rate")) + 
    geom_point(aes(y = batting_average, color = "batting_average")) + 
    geom_smooth(aes(y = strikeout_rate)) +
    geom_smooth(aes(y = batting_average)) +
    xlim(1910,2018) +
    ylim(0.055,0.30) +
    labs(title = paste0("Strikeouts and Batting Average From 1910 - ",dd)) +
    ylab("Rate") +
    theme_bw()
}


# Get a list of all years in our dataset, and save that length
list_of_years <- unique(b2$yearID)
len <- length(list_of_years)


# Save a directory path here
location<-"your_location_here"


# create a png for each plot and save it to our given location
for (i in 1:(len+10)) {
  file_path = paste0(location, "/plot-",1910+i ,".png")
  g<-chart_it(dlist[min(i,length(dlist))])
  ggsave(file_path, g, width = 10, height = 8, units = "cm",scale=2) 
  
  
  # For clarity, print progress for the user
  print(paste(i,"out of",length(dlist)+10))
}



# Change working directory for ImageMagick
setwd(location)


# Use ImageMagick from terminal to convert all pngs into one gif
# I used a delay of 40 ms for and looped through ~ 100 years
system("convert -delay 40 *.png baseball_plots.gif")


# After conversion, remove all pngs from that directory, as we have our gif
file.remove(list.files(pattern=".png"))
