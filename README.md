#Summoner Spell tracker for League of Legends

##Idea
This tool let's you track the cooldowns of your opponent's summoner spells.

Start the timer with a tap on the summoner and you'll see when the spell goes off cooldown.

Included features:
* Automatic detection of "Insight" Mastery (15% CDR of Summoner Spells)

Currently only the region EUW is supported.

##Setup

The tool is currently built with Meteor. To run it for yourself follow these steps:

1. Clone the repository.
1. Adjust the API key variable in the file `server/lib/apiKey.js`.
1. Install Meteor (https://www.meteor.com/install).
1. Run Meteor in the repository directory.

##Legal Note
Since the tool needs the Riot API in order to work, I need to include this:

This project isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
