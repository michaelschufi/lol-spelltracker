Matchup = React.createClass( {
	mixins: [ReactMeteorData],

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

		let subscription = Meteor.subscribe( 'Summoner', this.props.location.query.summoner, {
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
					errorMessage: "Summoner not found."
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
			let summonerQueryRegex = new RegExp( this.props.location.query.summoner.name , "i" )
			data = {
				summoner: Summoners.findOne( { name: summonerQueryRegex } )
			}
		}
		return data
	},

	render() {
		if ( typeof this.data.summoner != "undefined" ) {
			return (
				<div className="Matchup">
					<p className="title">{ this.data.summoner.name }'s matchup</p>
					<MatchupMain summoner={ this.data.summoner } />
				</div>
			)
		} else if ( this.state.loading ) {
			return (
				<div className="Matchup">
					<p className="loading">Loading summoner information...</p>
				</div>
			)
		} else {
			return (
				<div className="Matchup">
					<p className="errorMessage">{ this.state.errorMessage }</p>
				</div>
			)
		}
	}
} );