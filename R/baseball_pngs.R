
Batting.csv <- read.csv('file',stringsAsFactors = FALSE)
b2 <- Batting.csv %>%
  filter(yearID > 1910 ) %>%
  group_by(yearID) %>%
  summarise(SO = sum(SO), AB = sum(AB)) %>%
  mutate(batting_average = H/(AB),strikeout_rate = SO/(AB+BB))

plot_pngs<-function(dateMax=max(b2$yearID)){
  
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

list_of_years <- unique(b2$yearID)
len <- length(list_of_years)

location<-"your_location_here"

for (i in 1:(len+10)) {
  file_path = paste0(location, "/plot-",1910+i ,".png")
  g<-plot_pngs(dlist[min(i,length(dlist))])
  ggsave(file_path, g, width = 10, height = 8, units = "cm",scale=2) 
  
  print(paste(i,"out of",length(dlist)+10))
}