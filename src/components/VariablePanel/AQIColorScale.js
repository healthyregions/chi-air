// AQIColorScale.js
import {colors, pm2_5Ranges} from "../../config";
import styled from "styled-components";
import Grid from "@mui/material/Grid";

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
      <Grid container spacing={0} style={{ fontFamily: 'Lexend', marginBottom: '1rem' }}>
        <Grid size={3} style={{ textAlign: 'right' }}>AQI</Grid>
        <Grid size={1}></Grid>
        <Grid size={8}>Health Category</Grid>
      </Grid>
      { pm2_5Ranges?.map(({ range, label, color, border}, index) => (
        <Grid key={`${index}-${index}`} container spacing={0} style={{ display: 'flex', fontFamily: 'Space Grotesk' }}>
          <Grid size={3} style={{ textAlign: 'right', }}><small>{range}</small></Grid>
          <Grid size={1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span
              key={`overlay-key-${index}-${label}`}
              style={{
                display: 'block',
                backgroundColor: color,
                border: `1px solid ${border}`,
                borderRadius: '10px',
                width: '16px',
                height: '16px',
              }}
            ></span>
          </Grid>
          <Grid size={8}>
            <span style={{padding:0, margin:'0 0 0 .25em', fontWeight: 800, color: (label === 'Good' || label === 'Moderate') ? border : color}}>{label}</span>
          </Grid>
        </Grid>
      ))}
    </ColorScaleContainer>
  );
}

export default AQIColorScale;
