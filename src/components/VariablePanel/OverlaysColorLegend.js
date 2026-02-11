import { parsedOverlays } from "../../config";
import OverlaysDropdown from "./OverlaysDropdown";
import {useSelector} from "react-redux";
import {selectMapParams} from "../../store/slices/legacyStoreSlice";

const OverlaysColorLegend = ({}) => {
  const mapParams = useSelector(selectMapParams);

  return (
    <>
      {mapParams.overlays.map((selectedOverlay, index) => <div key={`overlay-legend-container-${index}`}>
        {parsedOverlays.map((parsedOverlay, subindex) => {
          const fillColor = JSON.parse(parsedOverlay?.fillColor);
          return (<div key={`parsed-overlay-${index}-${subindex}`}>
            { selectedOverlay === parsedOverlay?.id && parsedOverlay?.fillColor && <div key={`overlay-legend-${selectedOverlay}-${index}-${subindex}`} style={{ display: "flex", flexDirection: "column", marginTop:'1em' }}>
              <h3>{parsedOverlay?.description}</h3>
              {parsedOverlay?.fillColor && !Array.isArray(fillColor) && Object.entries(fillColor).map(([key, color]) => (
                <div key={`overlay-legend-${selectedOverlay}-${index}-${subindex}`} style={{ display: "flex", margin:'.25em 0' }}>
                <span
                  key={`overlay-key-${key}-${index}-${subindex}`}
                  style={{
                    backgroundColor: `rgb(${color.join(",")})`,
                    width: 16,
                    height: 16,
                  }}
                ></span>
                  <span style={{padding:0, margin:'0 0 0 .25em'}}>{key}</span>
                </div>
              ))}
              {parsedOverlay?.fillColor && Array.isArray(fillColor) && <div key={`overlay-legend-${selectedOverlay}`} style={{ display: "flex", margin:'.25em 0' }}>
                 <span
                   style={{
                     backgroundColor: `rgb(${JSON.parse(parsedOverlay.fillColor)})`,
                     width: 16,
                     height: 16,
                   }}
                 ></span>
                <span style={{padding:0, margin:'0 0 0 .25em'}}>{parsedOverlay?.description}</span>
              </div>}
            </div>}
          </div>)})}
      </div>)}
    </>
  )
}

export default OverlaysColorLegend;
