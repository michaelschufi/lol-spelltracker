Meteor.methods( {
	setupServer: function( argument ) {

		/* ### API key in external file  ### */

		let realmInfo = HTTP.call( 'GET', "https://global.api.pvp.net/api/lol/static-data/euw/v1.2/realm?api_key=" + apiKey )
		let ddBaseURL = realmInfo.data.cdn
		let ddBaseURLv = realmInfo.data.cdn + "/" + realmInfo.data.v
		
		let champImageData = HTTP.call( 'GET', "https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?champData=image,skins&api_key=" + apiKey )

		for ( champion in champImageData.data.data ) {
			let championData = champImageData.data.data[champion]
			Champions.upsert( {
					id: championData.id
				},
				{ $set: {
					id: championData.id,
					key: championData.key,
					name: championData.name,
					title: championData.title
				}
			} )
			ChampionImageData.upsert( {
					championId: championData.id
				},
				{ $set: {
					championId: championData.id,
					icon: ddBaseURLv + "/img/champion/" + championData.image.full,
					skins: championData.skins.map( skin => {
						return {
							id: skin.id,
							name: skin.name,
							loading: ddBaseURL + "/img/champion/loading/" +  championData.key + "_" + skin.num + ".jpg",
							splash: ddBaseURL + "/img/champion/splash/" +  championData.key + "_" + skin.num + ".jpg"
						}
					} )
				}
			} )	
		}

		let spells = HTTP.call( 'GET', "https://global.api.pvp.net/api/lol/static-data/euw/v1.2/summoner-spell?spellData=image,cooldown&api_key=" + apiKey )

		for ( spell in spells.data.data ) {
			let spellData = spells.data.data[ spell ]
			SummonerSpells.upsert( {
					id: spellData.id
				},
				{ $set: {
					id: spellData.id,
					key: spellData.key,
					name: spellData.name,
					description: spellData.description,
					cooldown: Number( spellData.cooldown[0] ) // only value in the Array
				}
			} )
			SummonerSpellImageData.upsert( {
					spellId: spellData.id
				},
				{ $set: {
					spellId: spellData.id,
					icon: ddBaseURLv + "/img/spell/" + spellData.image.full		
				}
			} )
		}
	}
} );