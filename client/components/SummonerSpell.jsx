SummonerSpell = React.createClass( {
	propTypes: {
		cooldown: React.PropTypes.number.isRequired,
		distAffected: React.PropTypes.bool.isRequired
	},

	mixins: [TimerMixin],

	getInitialState() {
		return {
			onCooldown: false,
			remainingTime: this.props.cooldown
		}
	},

	handleClick: function( event ) {
		event.preventDefault()

		if (! this.state.onCooldown ) {
			this.endTime = Date.now() + this.props.cooldown * 1000

			if ( this.props.distAffected && this.props.distortionActive.get() ) {
				// TODO dynamically get CDR
				this.endTime -= ( 15 / 100 * this.props.cooldown ) * 1000
			}
			if ( this.props.hasInsightMastery ) {
				this.endTime -= ( 15 / 100 * this.props.cooldown ) * 1000
			}
			this.tick()
			this.interval = this.setInterval( this.tick, 100 )
			this.setState( {
				onCooldown: true
			} )
		} else {
			this.clearInterval( this.interval )
			this.setState( {
				onCooldown: false
			} )
		}
	},

	tick: function() {
		let remainingTime = this.endTime - Date.now()

		if ( remainingTime < 0 ) {
			this.clearInterval( this.interval )
			this.setState( {
				onCooldown: false
			} )
		} else {
			let seconds = Math.floor( remainingTime / 1000 )
			let remainingMins = Math.floor( seconds / 60 )
			let remainingSecs = seconds % 60
			this.setState( {
				remainingTime: ( remainingMins > 0 ? remainingMins + ":" : "" ) + ( remainingSecs < 10 && remainingMins > 0 ? "0" + remainingSecs : remainingSecs ) 
			} )
		}
	},

	imageStyle() {
		let style = {
			opacity: "1"
		}

		if ( this.state.onCooldown ) {
			style = {
				opacity: "0.5"
			}
		}

		return style
	},

	render() {
		return (
			<div className="SummonerSpell">
				<img onMouseDown={ this.handleClick } onTouchStart={ this.handleClick } src={ this.props.src } style={ this.imageStyle() } />
				{ this.state.onCooldown ? <p onMouseDown={ this.handleClick } onTouchStart={ this.handleClick }>{ this.state.remainingTime }</p> : null }
			</div>
		);
	}
} );