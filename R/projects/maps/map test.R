install.packages('ggmap')
library(ggmap)

latlon <- read.csv('/Users/logan.ice/Desktop/latlon.csv', stringsAsFactors = FALSE)

usa_center = as.numeric(geocode("United States"))

USAMap = ggmap(get_googlemap(center=usa_center, scale=2, zoom=4), extent="normal")


#Batting.csv <- read.csv('file',stringsAsFactors = FALSE)
#People.csv <- read.csv('file',stringsAsFactors = FALSE)


b2 <- Batting.csv %>%
  filter(yearID > 2010 ) %>%
  left_join(People.csv, by = 'playerID') %>%
  filter(birthCountry == 'USA', birthState != 'HI', birthState != 'AK') %>%
  group_by(yearID, birthState) %>%
  summarise(SO = sum(SO), tot_AB = mean(AB)*48, AB = sum(AB), H = sum(H), BB = sum(BB)) %>%
  left_join(latlon, by = c('birthState' = 'State')) %>%
  mutate(batting_average = H/(AB),strikeout_rate = SO/(AB+BB), AB_share = AB/tot_AB)

plot_pngs <- function(dateMax=max(b2$yearID)){
USAMap +
  geom_point(aes(x=Longitude, y=Latitude), data = filter(b2, yearID == dateMax), col="orange", alpha=0.4, size=b2$AB * .001) +  
  scale_size_continuous(range=range(b2$AB))}


list_of_years <- unique(b2$yearID)
len <- length(list_of_years)

location<-"/Users/logan.ice/Documents/pngs"


for (i in 1:(len)) {
#  file_path = paste0(location, "/plot-",2010+i ,".png")
#  g<-
    plot_pngs(dlist[min(i,length(dlist))])
 # ggsave(file_path, g, width = 10, height = 8, units = "cm",scale=2) 
  
 # print(paste(i,"out of",length(dlist)+10))
}



USAMap +
  geom_point(aes(x=Longitude, y=Latitude), data = filter(b2, yearID <= 1991), col="orange", alpha=0.4, size=b2$AB * .001) +  
  scale_size_continuous(range=range(b2$AB))
