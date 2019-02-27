library(ggplot2)
install.packages('gapminder')
library(gapminder)
library(scales)

mergedata <- a %>%
  group_by(year) %>%
  mutate(life_by_year = sum(as.numeric(lifeExp)*as.numeric(pop))/sum(as.numeric(pop)))
  
usa <- mergedata %>%
  filter(continent == 'Americas') %>%
  mutate(percent_better = (lifeExp - life_by_year)/life_by_year)


ggplot(usa, aes(x = year, y = percent_better, fill = country, color = "black")) +
  geom_area() +
  facet_wrap(~country) +
  ylab("Life Expectancy Percent Better") +
  scale_y_continuous(labels = scales::percent) +
  labs(title = "Life Expectancy vs. Rest of World",
       subtitle = "North & South America, 1950 - 2007") +
  theme(
    
    # Generates a large title and a smaller, italicized subtitle
    plot.title = element_text(size=22),
    plot.subtitle = element_text(size = 10, face = 'italic'),
    
    # # Remove gridlines and background
     panel.grid.major = element_blank(), 
     panel.grid.minor = element_blank(),
     panel.background = element_blank(),
    
    # Create bold axis line and increase size of axis text
    axis.line = element_line(color = "black", size = 1.25),
    axis.text = element_text(size = 10, color = "black"),
    axis.title = element_text(size = 12, color = "black"),
    
    # Increase size of Legend
    legend.position = "none")