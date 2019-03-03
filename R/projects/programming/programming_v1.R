
# Requisite Packages
library(ggplot2)
library(dplyr)

# Read that Data
data <- read.csv('/Users/logan.ice/Desktop/1.csv', stringsAsFactors = FALSE)


# It's Charting Time
data %>%
  group_by(Language, Year) %>%
  summarise(Value = mean(Value)) %>%
  filter(Year <= 2018, 
         Language %in% c('Java', 'C', 'C++', 'PHP', 'C#', 'Python')) %>%
  group_by(Year) %>%
  mutate(rank = dense_rank(desc(Value)),
         rank = factor(rank),
         rank = factor(rank, levels = rev(levels(rank)))) %>%
  ggplot(aes(x = Year, y = rank, fill = Language, shape = Language)) +
  geom_tile(color = 'black', size = .5, height = .9, width = .9) +
  geom_point(size = 3, color = 'white') +
  geom_point(size = 2, aes(color = Language)) +
  labs(title = "Top Programming Language by Year",
       subtitle = "2003 - 2018") +
  theme(

    # Generates a large title and a smaller, italicized subtitle
    plot.title = element_text(size=22),
    plot.subtitle = element_text(size = 13, face = 'italic'),

    # Remove gridlines and background
   
   panel.background = element_blank(),
   panel.grid.major = element_blank(),
   panel.grid.minor = element_blank(),

    # Create bold axis line and increase size of axis text
   axis.line = element_line(color = "black", size = .75),
   axis.text = element_text(size = 13, color = "black"),
   axis.title = element_text(size = 15, color = "black"),

    # Increase size of Legend
    legend.title = element_text(size = 15),
    legend.text = element_text(size = 13))
