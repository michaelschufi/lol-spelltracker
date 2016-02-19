DistortionBoots = React.createClass( {
	getInitialState() {
		return {
			distActive: this.props.distortionActive.get()
		};
	},

	handleClick: function( event ) {
		event.preventDefault()

		this.props.distortionActive.set( !this.props.distortionActive.get() )
		this.setState( {
			distActive: !this.state.distActive
		} );
	},

	imageStyle() {
		let style = {
			opacity: "1"
		}

		if ( !this.state.distActive ) {
			style = {
				opacity: "0.5"
			}
		}

		return style
	},

	render() {
		return (
			<img onMouseDown={ this.handleClick } onTouchStart={ this.handleClick } className="distortion" style={ this.imageStyle() } src="http://ddragon.leagueoflegends.com/cdn/5.24.2/img/item/1318.png" alt="distortion_boots" />
		);
	}
} );
