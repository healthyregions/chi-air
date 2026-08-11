// This components formats the data for the selected geography
// and displays it in the right side panel.

// Import main libraries
import { useSelector, useDispatch } from 'react-redux';

// Import helper libraries
import styled from 'styled-components';
import {selectPanelState, setPanelState} from '../../store/slices/legacyStoreSlice';
import {colors} from '../../config';
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  selectBreadcrumbs, setBreadcrumbs as setBreadcrumbsAction,
  selectClickedSensor, selectSelectedAreas,
  selectSelectedSensors, selectSensorLocations, selectSensorParameter,
  setClickedSensor, setSelectedAreas, setSelectedSensors, selectSensorGeojsonData, setSensorParameter, setLocale,
} from "../../store/slices/sensorDataSlice";
import {NavLink} from "react-router-dom";
import Grid from "@mui/material/Grid";
import {FaArrowCircleLeft, FaInfoCircle} from "react-icons/fa";
import {LastUpdatedDisplay} from "../VariablePanel/LastUpdatedDisplay";
import {FaGripLines} from "react-icons/fa";
import {MapLayersPanel} from "../VariablePanel/Panels/MapLayersPanel";
import {ClickedSensorPanel} from "../VariablePanel/Panels/ClickedSensorPanel";
import {SelectedAreaPanel} from "../VariablePanel/Panels/SelectedAreaPanel";
import {LButton, Divider, useSelectorAsState, getLocaleLabel, locales} from "../VariablePanel/common";
import {ClickedSensorDetailsPanel} from "../VariablePanel/Panels/ClickedSensorDetailsPanel";
import {ClickedSensorExplain} from "../VariablePanel/Panels/ClickedSensorExplainPanel";
import {ColorCodingAQPanel} from "../VariablePanel/Panels/ColorCodingAQPanel";
import {Geocoder} from "./Geocoder";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {DropdownButton} from "../VariablePanel/DropdownButton";
import {useCookies} from "react-cookie";
import {MdHomeFilled} from "react-icons/md";

const DataPanelContainer = styled.div`
    position: fixed;
    width: ${({ $large }) => $large ? '500px' : '100%'};
    top: ${({ $large }) => $large ? '2rem' : ''};
    bottom: ${({ $large }) => $large ? '' : '0'};
    left: ${({ $large }) => $large ? '' : '0'};
    right: ${({ $large }) => $large ? '2rem' : '0'};
    z-index: ${({ $large }) => $large ? 5 : 51};
    display: ${({ $large, $otherPanels, $dataLength }) => $large && ($otherPanels || $dataLength === 0) ? 'none' : 'initial'};

    transition:250ms all;
    transform: ${({ $large, $open }) => $open ? 'none' : ($large ? 'translateX(calc(100% + 4.5rem))' : 'translateY(calc(100%))')};
    
    padding: ${({ $large }) => $large ? '36px 29px' : '2em 1rem'};
    background: linear-gradient(180deg, #e3f4fb 0%, #ffffff 80%);
    border: ${({ $large }) => $large ? '1px solid rgba(65, 182, 230, 1)' : ''};
    border-top: ${({ $large }) => $large ? '' : '1px solid rgba(65, 182, 230, 1)'};
    border-radius: ${({ $large }) => $large ? '8px' : ''};
    
  button#showHideRight {
    position:absolute;

    right: ${({ $large, $open }) => $open ? ($large ? 'calc(100% - 20px)' : '') : 'calc(100% + 60px)'};
    top: ${({ $large, $open }) => $large ? '20px' : $open ? '-20px' : '-50px' };
    left: ${({ $large }) => $large ? '' : '45vw'};
    width: ${({ $large }) => $large ? '40px' : '3em'};
    height: ${({ $large }) => $large ? '40px' : '3em'};
    padding:0;
    margin:0;
    background-color: ${colors.white};
    box-shadow: 2px 0 2px ${colors.gray}44;
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
  }
`;

const DropdownHeader = styled.span`
    font-size: ${({ size }) => size === 'small' ? '14px' : '18px'};
    font-weight: 200;
    flex-direction: column;
    align-content: center;
    font-family: Space Grotesk;

    strong { font-weight: 600; }
`;

// DataPanel Function Component
const DataPanel = ({ mapRef }) => {
  const dispatch = useDispatch();
  const largeScreen = useMediaQuery('(min-width: 600px)');
  const [cookies] = useCookies(['googtrans']);

  // Legacy map controls
  const panelState = useSelector(selectPanelState);

  // New sensor data
  const selectedSensors = useSelector(selectSelectedSensors);
  const selectedParameter = useSelector(selectSensorParameter);
  const geojsonData = useSelector(selectSensorGeojsonData);
  const clickedSensor = useSelector(selectClickedSensor);
  const locations = useSelector(selectSensorLocations);
  const [selections, setSelections] = useSelectorAsState(selectSelectedAreas, setSelectedAreas, dispatch);

  const setSelectedParameter = (payload) => dispatch(setSensorParameter(payload));

  // Called when Community or Zip code dropdowns change (future support for ward)
  const handleDropdownChanged = (s, key = 'community') => {
    setSelections({...selections, [key]: [s]});
    const newSelectedSensors = locations.filter(l => l[key] === s)?.map(l => l.datasourceId);
    dispatch(setSelectedSensors([...newSelectedSensors]));
    if (!selectedSensors?.includes(clickedSensor)) {
      dispatch(setClickedSensor());
      popPage('root');
    }
  }

  // Grab our previously-fetched data and use that to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const latestRow = geojsonData?.features?.[0]?.properties?.metrics?.[selectedParameter]?.data?.[0];

  // handles panel open/close
  const handleOpenClose = () => dispatch(setPanelState({ info: !panelState.info }))

  // Breadcrumbs help us track what page we're on
  const breadcrumbs = useSelector(selectBreadcrumbs);
  const setBreadcrumbs = (bc) => dispatch(setBreadcrumbsAction(bc));

  // Page selector logic for navigating the panel via breadcrumbs and links
  const currentPage = breadcrumbs[breadcrumbs.length - 1];
  const pushPage = (bcs) => {
    // no-op if we're already on this page
    if (currentPage === bcs[0]) {
      return false;
    }
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

  const onLocaleChange = (locale) => {
    dispatch(setLocale(locale));
  }

  return (
    <DataPanelContainer $large={largeScreen} $open={!!panelState.info} id="data-panel">
      <Grid container spacing={2} alignItems={'center'}>
        <Grid size={9}><img src={'/icons/chiair-logo.svg'} alt={'Chicago Air Quality'} width={254} height={41}/></Grid>
        <Grid><DropdownButton ButtonComponent={LButton} truncate={3} label={getLocaleLabel(cookies['googtrans'])} onChange={onLocaleChange}  options={locales} /></Grid>
      </Grid>

      <Grid container spacing={8} alignItems={'center'}>
        <LButton
          component={NavLink}
          to="/"
          variant="text"
          style={{ paddingLeft: '0', gap: '0.4rem' }}
          title="Go to Home page"
        >
          <MdHomeFilled style={{ width: '15px', height: '15px' }} /> Home
        </LButton>
        <LButton variant={'text'} onClick={() => pushPage(['Map Layers'])}>Map Layers</LButton>
      </Grid>

      {currentPage === 'root' && <>
        {(largeScreen || !clickedSensor) && <>
          <Grid container spacing={2} alignItems={'start'}>
            <Grid size={{ xs: 4 }}>
              <DropdownHeader htmlFor="paramSelect" size={'small'}>Indicator</DropdownHeader>
              <FormControl id="paramSelect" variant="outlined" fullWidth margin={'dense'} style={{
                border: '1px solid rgba(0, 88, 153, 0.5)',
                borderRadius: '5px'
              }}>
                <Select
                  variant={"outlined"}
                  size={'small'}
                  margin={'none'}
                  style={{ height: '36px' }}
                  value={selectedParameter}
                  onChange={(e) => setSelectedParameter(e.target.value)}
                >
                  <MenuItem value="nowcast_aqi">AQI-PM2.5</MenuItem>
                  <MenuItem value="clarity_pm25">PM2.5 (μg/m³)</MenuItem>
                  <MenuItem value="clarity_no2">NO₂ (ppb)</MenuItem>
                  {/*<MenuItem value="mean_bc">BC (ng/m³)</MenuItem>*/}
                </Select>
              </FormControl>
              <LButton as={Grid} justifyContent={'start'} style={{ width: '2rem' }} onClick={() => pushPage(['Explain'])}>
                <FaInfoCircle style={{ margin: '.5rem .2rem' }} color={'rgba(0, 88, 153, 0.5)'} size={'0.75rem'} />
              </LButton>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <Geocoder size={'small'} pop={popPage} onDropdownChange={handleDropdownChanged} />
            </Grid>
          </Grid>
        </>}

        {!clickedSensor && selectedSensors?.length === 0 && <LastUpdatedDisplay timestamp={latestRow?.date} />}
        {(clickedSensor || selectedSensors?.length > 0) && <Divider />}
        {!clickedSensor && selectedSensors?.length > 0 && <SelectedAreaPanel  />}
        {clickedSensor && <ClickedSensorPanel push={pushPage} pop={popPage} />}
      </>}

      {currentPage === 'Color Coding Air Quality' && <ColorCodingAQPanel pop={popPage} />}

      {(breadcrumbs?.includes('Details') || breadcrumbs?.includes('Explain')) && currentPage !== 'Color Coding Air Quality' && <>
        <Grid container spacing={0} marginTop={'1rem'}>
          {currentPage !== 'Map Layers' && <LButton as={Grid} size={1} variant={'text'} onClick={() => popPage('root')}
                   style={{ cursor: 'pointer', marginTop: '0.4rem' }}>
            <FaArrowCircleLeft style={{ width: '19px', height: '19px' }} />
          </LButton>}

          {currentPage === 'Details' && <ClickedSensorDetailsPanel pop={popPage} push={pushPage} />}
          {currentPage === 'Explain' && <ClickedSensorExplain pop={popPage} />}
        </Grid>
      </>}

      {breadcrumbs?.includes('Map Layers') && <>
        <MapLayersPanel pop={popPage} push={pushPage} breadcrumbs={breadcrumbs} />
      </>}

      {/* <Popover />     */}
      <button onClick={handleOpenClose} id="showHideRight" className={panelState.info ? 'active' : 'hidden'}><FaGripLines /></button>
    </DataPanelContainer>
  );
}

export default DataPanel;
