import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, LoadingMessage, ErrorPage } from "./components/";
import ParquetReaderComponent from "./components/Map/ParquetReaderComponent";

const Map = lazy(() => import('./components/Pages/Map'));
const Team = lazy(() => import('./components/Pages/Team'));
const About = lazy(() => import('./components/Pages/About'));
//const Guide = lazy(() => import('./components/Pages/Guide'));
//const Community = lazy(() => import('./components/Pages/Community'));
//const Posts = lazy(() => import('./components/Pages/Posts'));

export default function App() {
	return (
		<>
      <ParquetReaderComponent></ParquetReaderComponent>
      <Suspense fallback={<LoadingMessage />}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      {/*<GoogleTranslate />*/}
		</>
	);
}
