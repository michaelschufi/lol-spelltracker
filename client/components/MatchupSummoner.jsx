MatchupSummoner = React.createClass( {
	propTypes: {
		summonerName: React.PropTypes.string.isRequired,
		champName: React.PropTypes.string.isRequired,
		champBGI: React.PropTypes.string.isRequired,
		spell1: React.PropTypes.object.isRequired,
		spell2: React.PropTypes.object.isRequired,
	},

	thing() {
		return {
			backgroundImage: 'url("' + this.props.champBGI + '")'
		}
	},

	render() {
		return (
			<div className="MatchupSummoner">
				<div className="front" >
					<div className="text">
						<p>
							<span className="champName">{ this.props.champName }</span>
							<br />
							<span className="summonerName">{ this.props.summonerName }</span>
						</p>
					</div>
					<SummonerSpell hasInsightMastery={ this.props.hasInsightMastery } src={ this.props.spell1.src } cooldown={ this.props.spell1.cooldown } />
					<SummonerSpell hasInsightMastery={ this.props.hasInsightMastery } src={ this.props.spell2.src } cooldown={ this.props.spell2.cooldown } />
				</div>
				<div className="bgi" style={ this.thing() }></div>
			</div>
		);
	}
} );
