import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useLocation
} from "react-router-dom";

import Home from "./Home";
import Challenge from "./Challenge";

const App = () => {
	return (
		<Router>
			<div>
				<Switch>
					<Route path="/challenge">
						<Challenge />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</div>
		</Router>
	);
};

export default App;
