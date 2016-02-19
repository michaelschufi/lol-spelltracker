Home = React.createClass( {
	mixins: [ ReactRouter.History ],

	getInitialState() {
		return {
			searchingMatch: false
		};
	},

	searchMatch( event ) {
		event.preventDefault()

		var summonerName = this.refs.summonerName.value.trim();

		if ( summonerName != "" ) {
			this.history.pushState( null, '/matchup', query={ summoner: summonerName } );
		}
	},

	render() {
		return (
			<div className="home" >
				<p className="title">Search Match</p>
				
				<form onSubmit={ this.searchMatch } >
					<input ref="summonerName" type="text" placeholder="Summoner Name" autoFocus={false} />
					<br />
					<button type="submit">Search</button>
				</form>
			</div>
		)
	}
} )
