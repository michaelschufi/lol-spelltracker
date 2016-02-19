App = React.createClass( {
	render() {
		return (
			<div className="container">
				<header>
					{ this.props.header }
				</header>

				<main>
					{ this.props.main }
				</main>
				
				<footer>
					{ this.props.footer }
				</footer>
			</div>
		);
	}
} )