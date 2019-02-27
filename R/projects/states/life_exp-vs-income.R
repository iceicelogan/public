###########################################
#                                         #
#  Quick visual for built-in states data  #
#                                         #
###########################################


# Import Relevant Packages
# ggplot2 for charts
# dplyr for manipulation
# scales to set x-axis $$$
library(ggplot2)
library(dplyr)
library(scales)


# Read dataset for states
states <- data.frame(datasets::state.x77)


# Create custom theme
ice_theme <- theme(
  
  # Generates a large title and a smaller, italicized subtitle
  plot.title = element_text(size=22),
  plot.subtitle = element_text(size = 13, face = 'italic'),
  
  # Remove gridlines and background
  panel.grid.major = element_blank(), 
  panel.grid.minor = element_blank(),
  panel.background = element_blank(),
  
  # Create bold axis line and increase size of axis text
  axis.line = element_line(color = "black", size = 1.25),
  axis.text = element_text(size = 13, color = "black"),
  axis.title = element_text(size = 15, color = "black"),
  
  # Increase size of Legend
  legend.title = element_text(size = 15),
  legend.text = element_text(size = 13))


# Add `mid` for Illiteracy Scale
mid<-mean(states$Illiteracy)


#Start Plotting!
states %>%
  ggplot(aes(x = Income, y = Life.Exp, size = Population, color = Illiteracy)) +
  # Add extra geom_point, 1 size larger than the colors
  # This makes a nice looking border to the points
  geom_point(color = 'black', size = 3) +
  geom_point(size = 2) +
  geom_smooth(method = 'lm', formula = y~x, se = FALSE) +
  labs(title = "State Data, 1974",
       subtitle = "Life Exp vs Income, Color = Illiteracy",
       x = "Income per Capita",
       y = "Life Expectancy") +
  scale_color_gradient2(midpoint=mid, low="#00671a", mid="#FFFF00",
                          high="#FE4018", space ="Lab" ) +
  scale_x_continuous(labels=dollar_format(prefix="$")) +
  ice_theme
