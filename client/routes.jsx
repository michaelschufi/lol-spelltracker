const { Router, Route, IndexRoute, history } = ReactRouter;

var browserHistory = history.createHistory();

Routes = React.createClass( {
	render() {
		return (
			<Router history={ browserHistory }>
				<Route component={ App }>
					<Route path="/" components={ { main:Home, footer:Footer } } />
					<Route path="/matchup" components={ { main:Matchup } } />
				</Route>
			</Router>
		);
	}
} );