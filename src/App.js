import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { Home, LoadingMessage, ErrorPage } from "./components/";
import ParquetReaderComponent from "./components/Map/ParquetReaderComponent";

const Map = React.lazy(() => import('./components/Pages/Map'));
const About = React.lazy(() => import('./components/Pages/About'));
const Guide = React.lazy(() => import('./components/Pages/Guide'));
const Community = React.lazy(() => import('./components/Pages/Community'));
const Posts = React.lazy(() => import('./components/Pages/Posts'));


export default function App() {
	return (
		<div>
      <ParquetReaderComponent></ParquetReaderComponent>
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
		</div>
	);
}
