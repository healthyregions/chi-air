// AQIColorScale.js
import {colors, pm2_5Ranges} from "../../config";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import {selectPanelState, setPanelState} from "../../store/slices/legacyStoreSlice";
import {useDispatch, useSelector} from "react-redux";
import {FaKey} from "react-icons/fa";

//// Styled components CSS
// Main container for entire panel
const ColorScaleContainer = styled.div`
  position:fixed;
  border-radius: 8px;
  border: 1px solid rgba(65, 182, 230, 1);
  min-width:433px;
  right:2rem;
  top: ${({ largeScreen }) => largeScreen ? '' : '1.5rem'};
  bottom: ${({ largeScreen }) => largeScreen ? '2rem' : ''};
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
  transform: translateX(calc(100% + 2.5em));

    @media (max-width:1024px) {
        min-width:50vw;
    }
    @media (max-width:600px) {
        width:calc(100% - 1em);
        bottom:calc(1em + 45px);
        height:calc(100% - 55em);
        left:.75em;
        padding-top:2em;
        transform:translateX(calc(-100% - 1em));
        z-index:51;
        &.open {
            transform:none;
        }
        display: ${props => (props.otherPanels || props.dataLength === 0) ? 'none' : 'initial'};
    }
    &.open {
        transform:none;
    }

    button#showHideRight {
        position:absolute;
        right:calc(100% - 20px);
        top:20px;
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
            right:105%;
            svg {
                transform:rotate(0deg);
            }
            :after {
                opacity:1;
            }
        }
        @media (max-width:768px){
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

const AQIColorScale = () => {
  const dispatch = useDispatch();
  const panelState = useSelector(selectPanelState);
  const largeScreen = useMediaQuery('(min-width: 600px)');

  const handleOpenClose = () => dispatch(setPanelState({ key: !panelState.key }))

  return (
    <ColorScaleContainer largeScreen={largeScreen} className={panelState.key ? 'open' : ''}>
      <Grid container spacing={0} style={{ fontFamily: 'Lexend', fontWeight: 200, marginBottom: '1rem' }}>
        <Grid size={3} style={{ textAlign: 'right' }}>
          <Tooltip arrow={true} placement={'top'} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }} title={'Air Quality Index'}>AQI</Tooltip>
        </Grid>
        <Grid size={1}></Grid>
        <Grid size={8}>Health Category</Grid>
      </Grid>
      { pm2_5Ranges?.map(({ range, label, color, border}, index) => (
        <Grid key={`${index}-${index}`} container spacing={0} style={{ display: 'flex', fontFamily: 'Space Grotesk', margin: '0.5rem 0' }}>
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

      <button onClick={handleOpenClose} id="showHideRight" className={panelState.key ? 'active' : 'hidden'}><FaKey /></button>
    </ColorScaleContainer>
  );
}

export default AQIColorScale;
