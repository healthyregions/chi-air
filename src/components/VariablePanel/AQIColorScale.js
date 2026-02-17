// AQIColorScale.js
import {colors, pm2_5ColorMap} from "../../config";
import styled from "styled-components";

//// Styled components CSS
// Main container for entire panel
const ColorScaleContainer = styled.div`
  position:fixed;
  min-width:433px;
  right:0.5em;
  bottom:0.5em;
  background: rgba( 255, 255, 255, 0.85 );
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.85 );
  backdrop-filter: blur( 20px );
  -webkit-backdrop-filter: blur( 20px );
  box-shadow: 2px 0px 5px ${colors.gray}44;
  border:1px solid ${colors.chicagoBlue};
  padding: 36px 29px;
  box-sizing: border-box;
  transition:250ms all;
  font-family: 'Roboto', sans-serif;
  color:${colors.black};
  font-size:100%;
  z-index:7;
`;

const AQIColorScale = () => {
  return (
    <ColorScaleContainer>
      { Object.entries(pm2_5ColorMap).map(([key, color], index) => (
        <div key={`${key}-${index}`} style={{ display: "flex", margin:'.25em 0' }}>
            <span
              key={`overlay-key-${key}-${color}`}
              style={{
                backgroundColor: `rgb(${color.join(",")})`,
                width: 16,
                height: 16,
              }}
            ></span>
          <span style={{padding:0, margin:'0 0 0 .25em'}}>{key}</span>
        </div>
      ))}
    </ColorScaleContainer>
  );
}

export default AQIColorScale;
