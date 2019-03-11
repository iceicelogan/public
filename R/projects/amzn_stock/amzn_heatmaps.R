
# install tidyquant 
#install.packages('tidyquant', repos = "http://cran.us.r-project.org")
library(tidyquant) 
#install ggplot2 
#install.packages("ggplot2", repos = "http://cran.us.r-project.org") library(ggplot2) 
#Load the function to the local through Paul Bleicher's GitHub page
source("https://raw.githubusercontent.com/iascchen/VisHealth/master/R/calendarHeat.R")
amznStock = as.data.frame(tidyquant::tq_get(c("AMZN"),get="stock.prices")) # get data using tidyquant 
amznStock = amznStock[year(amznStock$date) > 2013, ] # Using data only after 2012Using ggplot2
library(plyr)
library(plotly)
amznStock$weekday = as.POSIXlt(amznStock$date)$wday #finding the day no. of the week
amznStock$weekdayf<-factor(amznStock$weekday,levels=rev(1:7),labels=rev(c("Mon","Tue","Wed","Thu","Fri","Sat","Sun")),ordered=TRUE) #converting the day no. to factor 
amznStock$monthf<-factor(month(amznStock$date),levels=as.character(1:12),labels=c("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"),ordered=TRUE) # finding the month 
amznStock$yearmonth<- factor(as.yearmon(amznStock$date)) #finding the year and the month from the date. Eg: Nov 2018 
amznStock$week <- as.numeric(format(amznStock$date,"%W")) #finding the week of the year for each date 
amznStock<-ddply(amznStock,.(yearmonth),transform,monthweek=1+week-min(week)) #normalizing the week to start at 1 for every month 
p <- ggplot(amznStock, aes(monthweek, weekdayf, fill = amznStock$adjusted)) + geom_tile(colour = "white") + facet_grid(year(amznStock$date)~monthf) + scale_fill_gradient(low="red", high="green") + xlab("Week of Month") + ylab("") + ggtitle("Time-Series Calendar Heatmap: AMZN Stock Prices") + labs(fill = "Price") 
p

r2g <- c("#EFA467", "#EFA468", "#EFA470", "#EFA469") 
calendarHeat(amznStock$date, amznStock$adjusted, ncolors = 99, color = 'r2g' , varname="AMZN Adjusted Close")