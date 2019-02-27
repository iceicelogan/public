####################################################
#                                                  #
# Function combines all csvs from a given location #
#            Result is a single data set           #
#                                                  #
####################################################


# Function takes one input, a string directory
# User should assign this to a variable 
# x <- combine_all_csvs()
combine_all_csvs <- function(location){
  
  # Create list of each .csv file in a given location
  list_of_csvs <- list.files(path=location, pattern="*.csv")
  
  # ListApply read.csv across all files in the location
  # Then rbind them together
  do.call(rbind, lapply(
                  paste0(location, list.files(path = location)),
                  read.csv))
}
