import {useCallback, useRef} from "react";
import { useSelector } from "react-redux";
import { fitBounds } from "@math.gl/web-mercator";
import {
  MapSection,
  Legend,
  DataPanel,
} from "../../components";
import { selectMapParams } from "../../store/slices/legacyStoreSlice";
import AQIColorScale from "../VariablePanel/AQIColorScale";

// US bounds
export const defaultBounds = fitBounds({
  width: window.innerWidth,
  height: window.innerHeight,
  bounds: [
    [-87.971649, 41.609282],
    [-87.521896, 42.040624],
  ],
});

function Map() {
  const mapParams = useSelector(selectMapParams);
  const mapRef = useRef(null);

  const handlePanMap = (viewState) => {
    mapRef?.current?.flyTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      bearing: viewState.bearing,
      pitch: viewState.pitch,
    });
  };

  const handleGeocoder = useCallback((location) => {
    if (location.center !== undefined) {
      let center = location.center;
      let zoom = 13;

      if (location.bbox) {
        let bounds = fitBounds({
          width: window.innerWidth,
          height: window.innerHeight,
          bounds: [
            [location.bbox[0], location.bbox[1]],
            [location.bbox[2], location.bbox[3]],
          ],
        });
        center = [bounds.longitude, bounds.latitude];
        zoom = bounds.zoom * 0.9;
      }

      handlePanMap({
        longitude: center[0],
        latitude: center[1],
        zoom: zoom,
        bearing: 0,
        pitch: 0,
      });
    }
  }, []);

  return (
    <div className="Map-App">
      {/*<NavBar showMapControls={true} bounds={defaultBounds} />*/}
      <div id="mainContainer">
        { mapParams && <>
            <MapSection bounds={defaultBounds} mapRef={mapRef} handlePanMap={handlePanMap} handleGeocoder={handleGeocoder} />
            <Legend
              label={`${mapParams.variableName} ${
                mapParams?.units ? `(${mapParams?.units})` : ""
              }`}
            />
            {/*<VariablePanel />*/}
            <DataPanel handleGeocoder={handleGeocoder} />
            <AQIColorScale />
          </>
        }
      </div>
    </div>
  );
}

export default Map;
