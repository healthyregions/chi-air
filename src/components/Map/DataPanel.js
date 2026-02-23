// This components formats the data for the selected geography
// and displays it in the right side panel.

// Import main libraries
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Import helper libraries
import styled from 'styled-components';
import {selectPanelState, setPanelState} from '../../store/slices/legacyStoreSlice';
import {colors} from '../../config';
import { useMediaQuery } from "@mui/material";
import Geocoder from "./Geocoder";
import {
  selectClickedSensor,
  selectSelectedSensors,
  selectSensorValuesMeanPm25,
  setLocale,
} from "../../store/slices/sensorDataSlice";
import {NavLink} from "react-router-dom";
import Grid from "@mui/material/Grid";
import {DropdownButton} from "../VariablePanel/DropdownButton";
import {FaArrowCircleLeft} from "@react-icons/all-files/fa/FaArrowCircleLeft";
import {LastUpdatedDisplay} from "../VariablePanel/LastUpdatedDisplay";
import {FaGripLines} from "@react-icons/all-files/fa/FaGripLines";
import {MapLayersPanel} from "../VariablePanel/Panels/MapLayersPanel";
import {ClickedSensorPanel} from "../VariablePanel/Panels/ClickedSensorPanel";
import {SelectedAreaPanel} from "../VariablePanel/Panels/SelectedAreaPanel";
import {AreaSelectionDropdowns} from "../VariablePanel/Panels/AreaSelectionDropdowns";
import {LButton, Divider } from "../VariablePanel/common";
import {ClickedSensorDetailsPanel} from "../VariablePanel/Panels/ClickedSensorDetailsPanel";
import {ClickedSensorExplain} from "../VariablePanel/Panels/ClickedSensorExplainPanel";
import {ColorCodingAQPanel} from "../VariablePanel/Panels/ColorCodingAQPanel";

//// Styled components CSS
// Main container for entire panel
const DataPanelContainer = styled.div`
    position:fixed;
    width: ${({ largeScreen }) => largeScreen ? '433px' : 'calc(100% - 1em)'};
    top: ${({ largeScreen }) => largeScreen ? '2rem' : 'calc(60% + 45px)'};
    left: ${({ largeScreen }) => largeScreen ? '' : '.75em'};
    right: ${({ largeScreen }) => largeScreen ? '2rem' : ''};
    z-index: ${({ largeScreen }) => largeScreen ? 5 : 51};
    display: ${({ largeScreen, otherPanels, dataLength }) => largeScreen && (otherPanels || dataLength === 0) ? 'none' : 'initial'};

    transition:250ms all;
    transform: ${({ largeScreen, isOpen }) => isOpen ? 'none' : (largeScreen ? 'translateX(calc(100% + 2rem))' : 'translateX(calc(-100% - 1em))')};
        
    padding: ${({ largeScreen }) => largeScreen ? '36px 29px' : '2em 0 0 0'};
    background: linear-gradient(180deg, #e3f4fb 0%, #ffffff 80%);
    border: 1px solid rgba(65, 182, 230, 1);
    border-radius: 8px;
    
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

  div {
    div {
      p {
        line-height:1.5;
        margin:0;
        display:inline-block;
      }
    }
  }
  h2 {
    padding:15px 0 5px 0;
    margin:0;
    display:inline-block;
    max-width:200px;
  }
  h6, p {
    padding:0 0 15px 0;
    margin:0;
    a {
      color:${colors.yellow};
      text-decoration:none;
    }
  }
  .extraPadding {
    padding-bottom:20vh;
  }
  p {
    padding-right:10px;
  }
`;

const CustomGeocoder = ({ push, handleGeocoder }) => <>
  <Grid container spacing={0} alignItems={'center'} justifyContent={'space-between'}>
    <Grid size={6}><span style={{ fontWeight: 200, flexDirection: 'column', alignContent:'center', fontFamily: 'Space Grotesk' }}>
              <strong style={{ fontWeight: 600 }}>Search</strong> any Chicago Address</span>
    </Grid>
    <Grid><LButton variant={'text'} onClick={() => push(['Map Layers'])}>Map Layers</LButton></Grid>
  </Grid>
  <Geocoder
    id="Geocoder"
    style={{ borderRadius: '100px' }}
    placeholder={""}
    onChange={handleGeocoder}
  />
</>;


// DataPanel Function Component
const DataPanel = ({ handleGeocoder }) => {
  const dispatch = useDispatch();
  const largeScreen = useMediaQuery('(min-width: 600px)');

  // Legacy map controls
  const panelState = useSelector(selectPanelState);

  // New sensor data
  const selectedSensors = useSelector(selectSelectedSensors);
  const mean_pm25 = useSelector(selectSensorValuesMeanPm25);
  const clickedSensor = useSelector(selectClickedSensor);

  // Grab our previously-fetched data and use that to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const firstHourlyRow = mean_pm25.find((r) => r.type === 'hour');

  // handles panel open/close
  const handleOpenClose = () => dispatch(setPanelState({ info: !panelState.info }))

  // Breadcrumbs help us track what page we're on
  const [breadcrumbs, setBreadcrumbs] = useState(['root']);

  // Page selector logic for navigating the panel via breadcrumbs and links
  const currentPage = breadcrumbs[breadcrumbs.length - 1];
  const pushPage = (bcs) => {
    setBreadcrumbs([...breadcrumbs, ...bcs]);
    return true;
  };
  const popPage = (bc) => {
    if (bc && !breadcrumbs?.includes(bc)) {
      console.warn(`attempted to pop to ${bc}, but breadcrumb was not found: `, breadcrumbs);
      return false;
    }
    if (bc) {
      const index = breadcrumbs.indexOf(bc);
      setBreadcrumbs([...breadcrumbs.slice(0, index+1)]);
    } else if (!bc && currentPage !== 'root') {
      setBreadcrumbs([...breadcrumbs.slice(0, breadcrumbs.length-1)]);
    }
  };




  return (
    <DataPanelContainer largeScreen={largeScreen} isOpen={!!panelState.info} id="data-panel">
      <Grid container spacing={4} alignItems={'center'}>
        <Grid size={9}><img src={'/icons/chiair-logo.svg'} alt={'Chicago Air Quality'} width={254} height={41}/></Grid>
        <Grid><DropdownButton ButtonComponent={LButton} label={'Eng'} onChange={(l) => dispatch(setLocale(l?.toLowerCase()?.slice(0,2)))} options={['English','Español']} /></Grid>
      </Grid>
      <LButton
        component={NavLink} // Use the NavLink component for routing
        to="/"         // Specify the destination path
        variant="text" // Optional: apply Material UI button styles
      >
        &larr; Homepage
      </LButton>

      {currentPage === 'root' && <>
        {(largeScreen || !clickedSensor) && <>
          <CustomGeocoder push={pushPage} handleGeocoder={handleGeocoder} />
          <AreaSelectionDropdowns pop={popPage} />
        </>}

        {!clickedSensor && selectedSensors?.length === 0 && <LastUpdatedDisplay date={firstHourlyRow?.date} />}
        {(clickedSensor || selectedSensors?.length > 0) && <Divider />}
        {!clickedSensor && selectedSensors?.length > 0 && <SelectedAreaPanel  />}
        {clickedSensor && <ClickedSensorPanel push={pushPage} pop={popPage} />}
      </>}

      {currentPage === 'Color Coding Air Quality' && <ColorCodingAQPanel pop={popPage} />}

      {breadcrumbs?.includes('Details') && currentPage !== 'Color Coding Air Quality' && <>
        <Grid container spacing={0} marginTop={'1rem'}>
          <LButton as={Grid} size={1} variant={'text'} onClick={() => popPage('root')}
                   style={{ cursor: 'pointer', marginTop: '0.4rem' }}>
            <FaArrowCircleLeft style={{ width: '19px', height: '19px' }} />
          </LButton>

          {currentPage === 'Details' && <ClickedSensorDetailsPanel pop={popPage} push={pushPage} />}
          {currentPage === 'Explain' && <ClickedSensorExplain pop={popPage} />}
        </Grid>
      </>}

      {breadcrumbs?.[1] === 'Map Layers' && <>
        <MapLayersPanel pop={popPage} push={pushPage} breadcrumbs={breadcrumbs} />
      </>}

      {/* <Popover />     */}
      <button onClick={handleOpenClose} id="showHideRight" className={panelState.info ? 'active' : 'hidden'}><FaGripLines /></button>
    </DataPanelContainer>
  );
}

export default DataPanel;
