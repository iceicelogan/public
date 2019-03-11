#########################
#                       #
#  March Madness File!  #
#                       #
#########################


# Read all files. Could just lapply to a directory, I prefer manual names
cities <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/Cities.csv', stringsAsFactors = FALSE)
conferences <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/Conferences.csv', stringsAsFactors = FALSE)
conference_tourney_games <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/ConferenceTourneyGames.csv', stringsAsFactors = FALSE)
game_cities <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/GameCities.csv', stringsAsFactors = FALSE)
tourney_compact_results <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/NCAATourneyCompactResults.csv', stringsAsFactors = FALSE)
tourney_detailed_results <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/NCAATourneyDetailedResults.csv', stringsAsFactors = FALSE)
seed_round_slots <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/NCAATourneySeedRoundSlots.csv', stringsAsFactors = FALSE)
seeds <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/NCAATourneySeeds.csv', stringsAsFactors = FALSE)
slots <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/NCAATourneySlots.csv', stringsAsFactors = FALSE)
season_compact_results <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/RegularSeasonCompactResults.csv', stringsAsFactors = FALSE)
season_detailed_results <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/RegularSeasonDetailedResults.csv', stringsAsFactors = FALSE)
seasons <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/Seasons.csv', stringsAsFactors = FALSE)
secondary_tourney_compact_results <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/SecondaryTourneyCompactResults.csv', stringsAsFactors = FALSE)
secondary_tourney_detailed_results <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/SecondaryTourneyTeams.csv', stringsAsFactors = FALSE)
team_coaches <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/TeamCoaches.csv', stringsAsFactors = FALSE)
team_conferences <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/TeamConferences.csv', stringsAsFactors = FALSE)
teams <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/Teams.csv', stringsAsFactors = FALSE)
team_spellings <- read.csv('/Users/logan.ice/Documents/git/public/R/projects/march_madness/all_csvs/TeamSpellings.csv', stringsAsFactors = FALSE)

library(dplyr)
seeded_results <- tourney_compact_results %>%
                    left_join(seeds, 
                              by = c('Season' = 'Season', 'WTeamID' = 'TeamID')) %>%
                    plyr::rename(c('Seed' = 'W_Seed')) %>%
                    left_join(seeds,
                              by = c('Season' = 'Season', 'LTeamID' = 'TeamID')) %>%
                    plyr::rename(c('Seed' = 'L_Seed')) %>%
                    left_join(teams,
                              by = c('WTeamID' = 'TeamID')) %>%
                    plyr::rename(c('TeamName' = 'W_Team_Name')) %>%
                    left_join(teams,
                              by = c('LTeamID' = 'TeamID')) %>%
                    plyr::rename(c('TeamName' = 'L_Team_Name')) %>%
                    select(c(1,3,5,9,10,11,14)) %>%
                    subset(nchar(W_Seed) < 4 & nchar(L_Seed) < 4) %>%
                    mutate('W_Seed_Strip' = substr(W_Seed,2,3),
                           'L_Seed_Strip' = substr(L_Seed,2,3))

seeded_results$matchup <- ifelse(seeded_results$W_Seed < seeded_results$L_Seed,
                                 paste0(seeded_results$W_Seed,seeded_results$L_Seed),
                                 paste0(seeded_results$L_Seed,seeded_results$W_Seed))

seeded_results$matchup_s <- ifelse(seeded_results$W_Seed_Strip < seeded_results$L_Seed_Strip,
                                 paste0(seeded_results$W_Seed_Strip,seeded_results$L_Seed_Strip),
                                 paste0(seeded_results$L_Seed_Strip,seeded_results$W_Seed_Strip))

seeded_results$upset <- ifelse(substr(seeded_results$W_Seed,2,3) < substr(seeded_results$L_Seed,2,3),
                               as.numeric(0), as.numeric(1))

test <- seeded_results %>%
  group_by(matchup_s) %>%
  summarise(upset = sum(upset)/n())
