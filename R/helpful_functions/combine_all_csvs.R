combine_all_csvs <- function(location){
  
  # Create list of each .csv file in a given location
  list_of_csvs <- list.files(path=location, pattern="*.csv")
  
  do.call(rbind, lapply(
                  paste0(location, list.files(path = location)),
                  read.csv))
}