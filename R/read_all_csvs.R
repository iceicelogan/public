read_all_csvs <- function(location){
  
  # Create list of each .csv file in a given location
  list_of_csvs <- list.files(path=location, pattern="*.csv") 
  
  # Create individual dataframes of all csvs 
  for (i in 1:length(list_of_csvs)){
    assign(list_of_csvs[i], 
           read.csv(
             paste(location, list_of_csvs[i], sep='')
           ))}
}


#read_all_files('/Users/logan.ice/Downloads/baseballdatabank-master/core/')
read_all_csvs('/Users/logan.ice/Downloads/gl1871_2018/')



