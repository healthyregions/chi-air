import React from "react";
import { useSelector } from "react-redux";
import { fitBounds } from "@math.gl/web-mercator";
import {
  MapSection,
  NavBar,
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

  return (
    <div className="Map-App">
      <NavBar showMapControls={true} bounds={defaultBounds} />
      <div id="mainContainer">
        { mapParams && <>
            <MapSection bounds={defaultBounds} />
            <Legend
              label={`${mapParams.variableName} ${
                mapParams?.units ? `(${mapParams?.units})` : ""
              }`}
            />
            {/*<VariablePanel />*/}
            <DataPanel />
            <AQIColorScale />
            {/* <Popover />     */}
          </>
        }
      </div>
    </div>
  );
}

export default Map;
