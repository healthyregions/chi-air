import React, { Suspense } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { Home, LoadingMessage, ErrorPage } from "./components/";
import {
	ThemeProvider,
	StyledEngineProvider,
	createTheme,
} from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";

const theme = createTheme();

const Map = React.lazy(() => import('./components/Pages/Map'));
const About = React.lazy(() => import('./components/Pages/About'));
const Guide = React.lazy(() => import('./components/Pages/Guide'));
const Community = React.lazy(() => import('./components/Pages/Community'));
const Posts = React.lazy(() => import('./components/Pages/Posts'));

/** Google Translation Widget */
const googleTranslateElementInit = () => {
	new window.google.translate.TranslateElement(
		{
			pageLanguage: "en",
			autoDisplay: false,
		},
		"google_translate_element"
	);
};
const useStyles = makeStyles((theme) => ({
	googleTranslateElement: {
		position: "fixed",
		left: "0.5em", //same left margin as the Nav Menu
		zIndex: "1000",
		backgroundColor: "rgba(255,255,255,0.75)",
		padding: "15px", //same padding as the Nav Menu
	},
}));

export default function App() {
	const classes = useStyles();
	React.useEffect(() => {
		var addScript = document.createElement("script");
		addScript.setAttribute(
			"src",
			"//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
		);
		document.body.appendChild(addScript);
		window.googleTranslateElementInit = googleTranslateElementInit;
	}, []);

	const location = useLocation();
	return (
		<div>
			<div
				id="google_translate_element"
				className={classes.googleTranslateElement}
				style={
					location.pathname.indexOf("map") > -1
						? { bottom: "4em" } //if on map page, move up to avoid overlapping with map controls
						: { bottom: "0.5em" }
				}
			></div>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<Suspense fallback={<LoadingMessage />}>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/map" component={Map} />
							<Route exact path="/map.html" component={Map} />
							<Route exact path="/about" component={About} />
							<Route exact path="/about.html" component={About} />
							<Route exact path="/guide" component={Guide} />
							<Route exact path="/guide.html" component={Guide} />
							<Route path="/posts/:slug?" component={Posts} />
							<Route exact path="/community" component={Community} />
							<Route exact
								path="/community.html"
								component={Community}
							/>
							<Route component={ErrorPage} />
						</Switch>
					</Suspense>
				</ThemeProvider>
			</StyledEngineProvider>
		</div>
	);
}
