#############################################################
#                                                           #
#  Program to read csv and produce gif of associated plots  #
#                                                           #
#############################################################


# Load requisite packages
# dplyr = manipulation
# ggplot2 = charts
library(dplyr)
library(ggplot2)


# Read appropriate csv (change path to match your system)
df3 <- read.csv('/Users/logan.ice/Documents/python_code/df3.csv', stringsAsFactors = FALSE)


# Add a "rank" field, Ranking each beer by rating
df3 <- arrange(df3, desc(Rating)) %>%
  mutate(rank = 247 - nrow(df3):1) 


# Write a function to create a chart, given a max(rank)
iterate_chart <- function(var){
  
  
  # Conditional logic to set the colors of each Category
  # This is manually set. Could automate in future
  if(var <= 5){
    vals = c('#4b0c11')
  } else if(var <= 7){
    vals = c('#c38e0d','#4b0c11')
  } else if(var <= 12){
    vals = c('#c38e0d','#e9d76c','#4b0c11')
  } else {
    vals = c('#c38e0d','white','#e9d76c', '#4b0c11')
  }
  
  
  # Plot data! Filter makes sure you only plot points up to the input rank
  ggplot(data = filter(df3, rank <= var), aes(x = ABV, y = Rating, color = Category)) +
    # Add extra geom_point, 1 size larger than the colors
    # This makes a nice looking border to the points
    geom_point(color = 'black', size = 3) +
    scale_colour_manual(values = vals) +
    geom_point(size = 2) +
    ylim(4.45,5.0) +
    xlim(0,30) +
    labs(title = "Rating vs. ABV by Style",
         subtitle = "Beer Advocate's Top 250 Beers") +
    theme(plot.title = element_text(size=22),
          plot.subtitle = element_text(size = 13, face = 'italic'),
          panel.grid.major = element_blank(), 
          panel.grid.minor = element_blank(),
          panel.background = element_blank(), 
          axis.line = element_line(color = "black", size = 1.25),
          axis.text = element_text(size = 13, color = "black"),
          axis.title = element_text(size = 15, color = "black"),
          legend.justification=c(1,1), 
          legend.position=c(1,1),
          legend.title = element_text(size = 15),
          legend.text = element_text(size = 13))
}


# Set a length variable to minimize function calls
# Add 10 to give a buffer at the end. 
# 10 could be changed if you want.
len <- nrow(df3) + 10


# Define location (again, change your code as needed)
location<-"/Users/logan.ice/Documents/git/public/R/projects/beer/beer_files"


# Loop through all values of rank
# Set p based on how far you've iterated
# That's necessary because of ImageMagick being dumb:
# It views `11.png` as occuring before `2.png` so we have to trick it
for (i in 1:len) {
  p <- if(i <= 50){
    paste(replicate(i,"1"),collapse="")
  } else if(i <= 100) {
    paste(replicate(i,"2"),collapse="")
  } else if(i <= 150) {
    paste(replicate(i,"3"),collapse="")
  } else if(i <= 200) {
    paste(replicate(i,"4"),collapse="")
  } else if(i <= 250) {
    paste(replicate(i,"5"),collapse="")
  } else{
    paste(replicate(i,"6"),collapse="")
  }
  
  
  # After that step, we create a png for each plot and save it to our given location
  file_path = paste0(location, "/plot-",p,".png")
  g<-iterate_chart(i)
  ggsave(file_path, g, width = 10, height = 8, units = "cm",scale=2) 
  
  
  # For clarity, print progress for the user
  print(paste(i,"out of",len))
}


# Change working directory for ImageMagick
setwd(location)


# Use ImageMagick from terminal to convert all pngs into one gif
# I used a delay of 4 ms for this one as there are 250 pngs to loop through
# For a typical chart, I would use 30-50 though
system("convert -delay 4 *.png beer_ratings.gif")


# After conversion, remove all pngs from that directory, as we have our gif
file.remove(list.files(pattern=".png"))
