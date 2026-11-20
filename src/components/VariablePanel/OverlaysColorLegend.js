import { parsedOverlays } from "../../config";
import { useSelector } from "react-redux";
import { selectMapParams } from "../../store/slices/legacyStoreSlice";
import {Container} from "@mui/material";
import useConfigText from "../../i18n/useConfigText";

const OverlaysColorLegend = ({ style }) => {
  const mapParams = useSelector(selectMapParams);
  const tc = useConfigText();

  // Legend category names come from the overlay's fillColor keys (e.g. "Elementary School").
  // Keys containing "." (e.g. "PM2.5") can't be used as i18next keys - they are chemical names and stay as-is.
  const legendLabel = (overlayId, key) => key.includes('.') ? key : tc('overlays', overlayId, `legend.${key}`, key);

  return (
    <Container style={{ fontFamily: 'Lexend', ...style}}>
      {mapParams.overlays.map((selectedOverlay, index) => <div key={`overlay-legend-container-${index}`}>
        {parsedOverlays.map((parsedOverlay, subindex) => {
          const fillColor = JSON.parse(parsedOverlay?.fillColor);
          return (<div key={`parsed-overlay-${index}-${subindex}`}>
            { selectedOverlay === parsedOverlay?.id && parsedOverlay?.fillColor && <div key={`overlay-colorlegend-${selectedOverlay}-${index}-${subindex}`} style={{ display: "flex", flexDirection: "column", marginTop:'2em', fontFamily: 'Lexend', fontSize: '16px', fontWeight: 500, textAlign: 'center' }}>
              <div>{tc('overlays', parsedOverlay?.id, 'displayName', parsedOverlay?.displayName)}</div>
              {parsedOverlay?.fillColor && !Array.isArray(fillColor) && Object.entries(fillColor).map(([key, color], subsubindex) => (
                <div key={`overlay-array-legend-${selectedOverlay}-${index}-${subindex}-${subsubindex}`} style={{ display: "flex", margin:'.25em 0', justifyContent: 'center' }}>
                  <span
                    style={{
                      backgroundColor: `rgb(${color.join(",")})`,
                      display: 'block',
                      borderRadius: '10px',
                      width: '16px',
                      height: '16px',
                    }}
                  ></span>
                  <span style={{padding:0, margin:'0 0 0 .25em', fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300}}>{legendLabel(parsedOverlay?.id, key)}</span>
                </div>
              ))}
              {parsedOverlay?.fillColor && Array.isArray(fillColor) && <div key={`overlay-nonarray-legend-${selectedOverlay}`} style={{ display: "flex", margin:'.25em 0', justifyContent: 'center'  }}>
                 <span
                   style={{
                     backgroundColor: `rgb(${JSON.parse(parsedOverlay.fillColor)})`,
                     display: 'block',
                     borderRadius: '10px',
                     width: '16px',
                     height: '16px',
                   }}
                 ></span>
                <span style={{padding:0, margin:'0 0 0 1rem', fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300}}>{tc('overlays', parsedOverlay?.id, 'description', parsedOverlay?.description)}</span>
              </div>}
            </div>}
          </div>)})}
      </div>)}
    </Container>
  )
}

export default OverlaysColorLegend;
