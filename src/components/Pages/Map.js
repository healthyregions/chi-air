import {useRef, useState} from "react";
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

  const handlePanMap = useCallback((viewState) => {
    mapRef?.current?.flyTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      bearing: viewState.bearing,
      pitch: viewState.pitch,
    });
  }, [mapRef]);

  return (
    <div className="Map-App">
      {/*<NavBar showMapControls={true} bounds={defaultBounds} />*/}
      <div id="mainContainer">
        { mapParams && <>
            <MapSection bounds={defaultBounds} mapRef={mapRef} handlePanMap={handlePanMap} />
            {mapParams?.variableName && <Legend />}
            {/*<VariablePanel />*/}
            <DataPanel mapRef={mapRef} handlePanMap={handlePanMap} />
            <AQIColorScale />
          </>
        }
      </div>
    </div>
  );
}

export default Map;
