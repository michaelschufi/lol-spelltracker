let _baseURL = "https://euw.api.pvp.net"

let _apiCall = function( apiUrl, callback ) {

	/* ### API key in external file  ### */

	console.log( apiUrl + '?api_key=' + apiKey )
	// Meteor._sleepForMs(2000);
	try {
		var response = HTTP.call( 'GET', apiUrl + '?api_key=' + apiKey )
		callback( null, response )
	} catch ( error ) {
		var errorCode = 500;
		var errorMessage = 'API-Call failed!';

		if ( error.response ) {
			var errorMessage = 'API-Request failed!';
		}
		var myError = new Meteor.Error( errorCode, errorMessage )
		callback( myError, null )
	}
}

Meteor.methods( {
	// TODO: only allow calls from server
	updateSummoner: function( summonerName ) {
		this.unblock()
		// Meteor._sleepForMs(4000)

		let apiUrl = _baseURL + "/api/lol/euw/v1.4/summoner/by-name/" + summonerName
		var summonerByName = Meteor.wrapAsync( _apiCall )( apiUrl )
		
		if ( typeof summonerByName != 'undefined' ) {
			var summonerData = summonerByName.data[ summonerName.toLowerCase().replace( /\s/g, "" ) ]

			Summoners.upsert( {
					id: summonerData.id
				},
				{ $set: {
					lastUpdate: Date.now(),
					id: summonerData.id,
					name: summonerData.name,
				}
			} )
		}
	},
	// TODO: only allow calls from server
	updateMatchup: function( summonerId ) {
		// Meteor._sleepForMs(4000)

		let platformId = "EUW1"
		let apiUrl = _baseURL + "/observer-mode/rest/consumer/getSpectatorGameInfo/" + platformId + "/" + summonerId
		this.unblock()
		var currentGame = Meteor.wrapAsync( _apiCall )( apiUrl )

		console.log( currentGame.data )
		if ( typeof currentGame != 'undefined' ) {
			let matchupData = currentGame.data

			let ret = Matchups.upsert( {
					id: matchupData.gameId
				},
				{ $set: {
					lastUpdate: Date.now(),
					id: matchupData.gameId,
					startTime: matchupData.gameStartTime,
					mode: matchupData.gameMode,
					summoners: matchupData.participants.map( participant => {
						return {
							summonerId: participant.summonerId,
							summonerName: participant.summonerName,
							teamId: participant.teamId,
							championId: participant.championId,
							spell1Id: participant.spell1Id,
							spell2Id: participant.spell2Id,
							masteries: participant.masteries
						}
					} )
				}
			} )
			return matchupData.gameId
		}
	}
} );