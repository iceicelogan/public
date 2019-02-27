############################################
#                                          #
#  Blank background theme with large text  #
#                                          #
############################################


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
