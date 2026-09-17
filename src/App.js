import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, LoadingMessage, ErrorPage } from "./components/";
import ParquetReaderComponent from "./components/Map/ParquetReaderComponent";
import { GoogleTranslate } from "./components/Layout/GoogleTranslate";
import {CookiesProvider} from "react-cookie";

const Map = lazy(() => import('./components/Pages/Map'));
const Team = lazy(() => import('./components/Pages/Team'));
const About = lazy(() => import('./components/Pages/About'));
const Resources = lazy(() => import('./components/Pages/Resources'));
const Contact = lazy(() => import('./components/Pages/Contact'));
//const Guide = lazy(() => import('./components/Pages/Guide'));
//const Community = lazy(() => import('./components/Pages/Community'));
//const Posts = lazy(() => import('./components/Pages/Posts'));

export default function App() {
	return (
		<CookiesProvider>
      <ParquetReaderComponent></ParquetReaderComponent>
      <Suspense fallback={<LoadingMessage />}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      <GoogleTranslate />
		</CookiesProvider>
	);
}
