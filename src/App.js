import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, LoadingMessage, ErrorPage } from "./components/";
import ParquetReaderComponent from "./components/Map/ParquetReaderComponent";

const Map = React.lazy(() => import('./components/Pages/Map'));
const About = React.lazy(() => import('./components/Pages/About'));
const Guide = React.lazy(() => import('./components/Pages/Guide'));
const Community = React.lazy(() => import('./components/Pages/Community'));
const Posts = React.lazy(() => import('./components/Pages/Posts'));

export default function App() {
	return (
		<>
      <ParquetReaderComponent></ParquetReaderComponent>
      <Suspense fallback={<LoadingMessage />}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/about" element={<About />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/posts/:slug?" element={<Posts />} />
          <Route path="/community" element={<Community />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      {/*<GoogleTranslate />*/}
		</>
	);
}
