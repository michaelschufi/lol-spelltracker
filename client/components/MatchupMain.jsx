MatchupMain = React.createClass( {
	mixins: [ReactMeteorData],

	propTypes: {
		summoner: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return {
			loading: true,
			errorMessage: "Unknown error occurred!"
		}
	},

	componentDidMount() {
		let component = this

		let loadingTimeout = Meteor.setTimeout( function () {
			component.setState( {
				loading: false,
				errorMessage: "Server did not respond in time."
			} )
		}, 3000 )

		let subscription = Meteor.subscribe( 'Matchup', component.props.summoner.id, {
			onReady: function() {
				Meteor.clearTimeout( loadingTimeout )
				component.setState( {
					loading: false
				} )
			},
			onStop: function() {
				Meteor.clearTimeout( loadingTimeout )
				component.setState( {
					loading: false,
					errorMessage: "Matchup not found. Is \"" + component.props.summoner.name + "\" ingame?"
				} )
			}
		} )

		this.setState( {
			subscription: subscription
		} );
	},

	componentWillUnmount() {
		if ( this.state.subscription ) {
			this.state.subscription.stop();
		}
	},

	getMeteorData() {
		let data = {}

		if (! this.state.loading ) {
			data = {
				matchup: Matchups.findOne()
			}
		}
		return data
	},

	renderOpponents() {
		let teamId = this.data.matchup.summoners.filter( summoner => { return summoner.summonerId === this.props.summoner.id } )[0].teamId
		let opponents = this.data.matchup.summoners.filter( summoner => { 
			return summoner.teamId != teamId
		} )

		let component = this
		return opponents.map( opponent => {
			let spellsAffectedByDist = [ 12, 6, 4 ]
			let distAffected1 = spellsAffectedByDist.indexOf( opponent.spell1Id ) != -1 ? true : false
			let distAffected2 = spellsAffectedByDist.indexOf( opponent.spell2Id ) != -1 ? true : false

			console.log( opponent.masteries )
			let filteredMasteries = opponent.masteries.filter( mastery => {
				return mastery.masteryId === 6241 && mastery.rank >= 1
			} )
			let hasInsightMastery = typeof filteredMasteries[0] != "undefined" ? true : false
			console.log(hasInsightMastery)

			return <MatchupSummoner
				key={ opponent.summonerId }
				summonerName={ opponent.summonerName } 
				champName={ Champions.findOne( { id: opponent.championId } ).name }
				champBGI={ ChampionImageData.findOne( { championId: opponent.championId } ).skins.filter( skin => {
					return skin.name === "default"
				} )[0].loading }
				spell1={ {
					src: SummonerSpellImageData.findOne( { spellId: opponent.spell1Id } ).icon,
					cooldown: SummonerSpells.findOne( { id: opponent.spell1Id } ).cooldown,
					distAffected: distAffected1
				} }
				spell2={ {
					src: SummonerSpellImageData.findOne( { spellId: opponent.spell2Id } ).icon,
					cooldown: SummonerSpells.findOne( { id: opponent.spell2Id } ).cooldown,
					distAffected: distAffected2
				} }
				distortionImg="http://ddragon.leagueoflegends.com/cdn/5.23.1/img/item/1318.png"
				hasInsightMastery={ hasInsightMastery }
			/>;
		} )
	},

	render() {
		if ( typeof this.data.matchup != "undefined" ) {
			return (
				<div className="MatchupMain">
					{ this.renderOpponents() }
				</div>
			)
		} else if ( this.state.loading ) {
			return (
				<div className="MatchupMain">
					<p className="loading">Loading matchup...</p>
				</div>
			)
		} else {
			return (
				<div className="MatchupMain">
					<p className="errorMessage">{ this.state.errorMessage }</p>
				</div>
			)
		}
	}
} );