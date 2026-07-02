// AQColorScale.js
import {colors, pm2_5Ranges} from "../../config";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import {selectPanelState, setPanelState} from "../../store/slices/legacyStoreSlice";
import {useDispatch, useSelector} from "react-redux";
import {FaKey} from "react-icons/fa";
import {selectSensorParameter} from "../../store/slices/sensorDataSlice";

//// Styled components CSS
// Main container for entire panel
const ColorScaleContainer = styled.div`
  position: fixed;
  border-radius: 8px;
  border: 1px solid rgba(65, 182, 230, 1);
  width: 433px;
  left: ${({ $open }) => $open ? '2rem' : '0'};
  top: ${({ $large }) => $large ? '2rem' : '0'};
  background: rgba( 255, 255, 255, 0.85 );
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.85 );
  backdrop-filter: blur( 20px );
  -webkit-backdrop-filter: blur( 20px );
  box-shadow: ${({ $open }) => $open ? `2px 0px 5px ${colors.gray}44` : 'none'};
  border:1px solid ${colors.chicagoBlue};
  padding: 36px 29px;
  box-sizing: border-box;
  transition:250ms all;
  font-family: 'Roboto', sans-serif;
  color:${colors.black};
  font-size:100%;
  z-index:7;
  transform: ${({ $large, $open }) => $open ? 'none' : ($large ? 'translateX(calc(-100%))' : 'translateX(calc(-100% - 1em))')};

    @media (max-width:600px) {
        width:calc(100% - 1em); 
        bottom:calc(1em + 45px);
        height: max-content; // calc(100% - 55em);
        top:.5em;
        left: ${({ $large, $open }) => $open ?  '.5em' : '' };
        padding-top: 2em;
        z-index:51;
        display: ${props => (props.otherPanels || props.dataLength === 0) ? 'none' : 'initial'};
    }

    button#showHideRight {
        position:absolute;
        top:20px;
        right: ${({  $open }) => $open ? '-20px' : '-60px'};
        width:40px;
        height:40px;
        padding:0;
        margin:0;
        background-color: ${colors.white};
        box-shadow: 2px 0px 2px ${colors.gray}44;
        border:1px solid ${colors.chicagoBlue};
        // border-radius:20px;
        cursor: pointer;
        transition:500ms all;
        svg {
            width:15px;
            height:15px;
            margin:12.5px 0 0 0;
            @media (max-width:600px){
                margin:5px;
            }
            fill:${colors.gray};
            transform:rotate(180deg);
            transition:500ms all;
        }
        :after {
            opacity:0;
            font-weight:bold;
            color:${colors.gray};
            position: relative;
            top:-17px;
            transition:500ms all;
            content: 'Report';
            right:50px;
            z-index:4;
        }
        &.hidden {
            svg {
                transform:rotate(0deg);
            }
            :after {
                opacity:1;
            }
        }
        @media (max-width:768px) {
            top:120px;
        }
        @media (max-width:600px) {
            left:calc(100% + 4.5em);
            width:3em;
            height:3em;
            top:0;
            &.hidden svg {
                transform:rotate(0deg);
            }
            :after {
                display:none;
            }
            &.active {
                left:90%;
            }
            &.active svg {
                transform:rotate(90deg);
            }
        }
    }
    
`;

export const AQColorScale = () => {
  const dispatch = useDispatch();
  const panelState = useSelector(selectPanelState);
  const selectedParameter = useSelector(selectSensorParameter);
  const largeScreen = useMediaQuery('(min-width: 600px)');

  const handleOpenClose = () => dispatch(setPanelState({ key: !panelState.key }));

  return (
    <ColorScaleContainer $large={largeScreen} $open={panelState.key}>
      <Grid container spacing={0} style={{ fontFamily: 'Lexend', fontWeight: 200, marginBottom: '1rem' }}>
        {selectedParameter === 'nowcast_aqi' && <Grid size={3} style={{ textAlign: 'right' }}>
          <Tooltip arrow={true} placement={'top'} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }} title={'EPA’s Air Quality Index (AQI)'}>AQI-PM2.5</Tooltip>
        </Grid>}
        {selectedParameter === 'clarity_pm25' && <Grid size={3} style={{ textAlign: 'right' }}>
          <Tooltip arrow={true} placement={'top'} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }} title={'Particle Matter from fine particulates, 2.5 micrometers or less in diameter'}>PM2.5</Tooltip>
        </Grid>}
        {selectedParameter === 'clarity_no2' && <Grid size={3} style={{ textAlign: 'right' }}>
          <Tooltip arrow={true} placement={'top'} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }} title={'Nitrogen Dioxide'}>NO₂</Tooltip>
        </Grid>}
        <Grid size={1}></Grid>
        <Grid size={8}>Level of Health Concern</Grid>
      </Grid>

      { pm2_5Ranges?.map(({ pm25_min, pm25_max, aqi_min, aqi_max, no2_min, no2_max, label, color, border}, index) =>
        <Grid key={`color-range-${index}`} container spacing={0} style={{ display: 'flex', fontFamily: 'Space Grotesk', margin: '0.5rem 0' }}>
          {selectedParameter === 'nowcast_aqi' && <Grid size={3} style={{ textAlign: 'right', }}><small>{Number(aqi_min)}{Number(aqi_max) > 999 ? '+' : <> - {Number(aqi_max)}</>}</small></Grid>}
          {selectedParameter === 'clarity_pm25' && <Grid size={3} style={{ textAlign: 'right', }}><small>{pm25_min.toFixed(1)}{pm25_max.toFixed(1) > 9999 ? '+' : <> - {pm25_max.toFixed(1)}</>}</small></Grid>}
          {selectedParameter === 'clarity_no2' && <Grid size={3} style={{ textAlign: 'right', }}><small>{no2_min.toFixed(1)}{no2_max.toFixed(1) > 9999 ? '+' : <> - {no2_max.toFixed(1)}</>}</small></Grid>}
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
      )}

      <button onClick={handleOpenClose} id="showHideRight" className={panelState.key ? 'active' : 'hidden'}><FaKey /></button>
    </ColorScaleContainer>
  );
}

