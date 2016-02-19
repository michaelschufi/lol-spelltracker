let _validateString = function( string, maxLength, minLength = 1 ) {
	check( string, String )

	_test = Match.Where( function( string ) {
		return ( minLength <= string.length && string.length <= maxLength )
	} )
	check( string, _test )
}

Meteor.publish( "Summoner", function( summonerName ) {
	_validateString( summonerName, 256 )

	let summonerQueryRegex = new RegExp( summonerName, "i" )
	console.log(summonerQueryRegex)

	let summoner = Summoners.find( { name: summonerQueryRegex } )

	if ( typeof summoner.fetch()[0] === "undefined" ) {
		Meteor.call( 'updateSummoner', summonerName )
	}
	
	return summoner
} )

Meteor.publish( "Matchup", function( summonerId ) {
	check( summonerId, Number )

	let matchup = Matchups.find( {
		$and: [
			{ summoners: { $elemMatch: { summonerId: summonerId } } }
		]
	}, {
		sort: { lastUpdate: -1 },
		limit: 1
	} )

	let self = this;
	if ( typeof matchup.fetch()[0] === "undefined" || Date.now() - matchup.fetch()[0].startTime > 20 * 60 * 1000 ) {
		console.log( "calling updateMatchup" )
		Meteor.call( 'updateMatchup', summonerId, function( error, result ) {
			if ( error ) {
				console.log("publish stop")
				self.stop()
			} else {
				console.log("publishing updated matchup: " + result )
				self.added( "Matchups", Random.id(), Matchups.findOne( { id: result } ) );
			}
		} )
	} else {
		console.log("publishing found matchup")
		console.log(matchup.fetch())
		return matchup
	}
} )

Meteor.publish( "SummonerSpells", function () {
	return SummonerSpells.find({})	
} );

Meteor.publish( "SummonerSpellImageData", function () {
	return SummonerSpellImageData.find({})
} );

Meteor.publish( "Champions", function () {
	return Champions.find({})	
} );

Meteor.publish( "ChampionImageData", function () {
	return ChampionImageData.find({})	
} );