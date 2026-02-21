// This components formats the data for the selected geography
// and displays it in the right side panel.

// Import main libraries
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Import helper libraries
import styled from 'styled-components';
import {selectPanelState, setPanelState} from '../../store/slices/legacyStoreSlice';
import {colors, pm2_5Ranges} from '../../config';
import {Button, ClickAwayListener, FormControl, InputLabel, MenuItem, Tooltip, Zoom} from "@mui/material";
import Geocoder from "./Geocoder";
import {
  removeSensorsFromSelection, selectAverageType, selectClickedSensor,
  selectSelectedSensors, selectSensorGeojsonData, selectSensorLocations,
  selectSensorValuesMeanPm25, setAverageType, setClickedSensor, setLocale, setSelectedSensors
} from "../../store/slices/sensorDataSlice";
import {NavLink, useSearchParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import {DropdownButton} from "../VariablePanel/DropdownButton";
import {FaTimes} from "@react-icons/all-files/fa/FaTimes";
import {SensorBarChart} from "../VariablePanel/SensorBarChart";
import {FaArrowCircleLeft} from "@react-icons/all-files/fa/FaArrowCircleLeft";
import {LastUpdatedDisplay} from "../VariablePanel/LastUpdatedDisplay";
import {SensorValueDisplay} from "../VariablePanel/SensorValueDisplay";
import {FaArrowLeft} from "@react-icons/all-files/fa/FaArrowLeft";
import {FaInfoCircle} from "@react-icons/all-files/fa/FaInfoCircle";
import {FaLink} from "@react-icons/all-files/fa/FaLink";
import {FaGripLines} from "@react-icons/all-files/fa/FaGripLines";
import {MapLayersPanel} from "../VariablePanel/Panels/MapLayersPanel";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import {FaChartLine} from "@react-icons/all-files/fa/FaChartLine";

//// Styled components CSS
// Main container for entire panel
const DataPanelContainer = styled.div`
  position:fixed;
  width:433px;
  right:0.5em;
  top:0.5em;
  background: linear-gradient(180deg, #e3f4fb 0%, #ffffff 80%);
  border: 1px solid rgba(65, 182, 230, 1);
  backdrop-filter: blur( 20px );
  -webkit-backdrop-filter: blur( 20px );
  padding: 36px 29px;
  border-radius: 8px;
  box-sizing: border-box;
  transition:250ms all;
  font-family: 'Roboto', sans-serif;
  color:${colors.black};
  font-size:100%;
  z-index:5;
  transform: translateX(calc(100% + .5em));
  h4, h1 {
    font-family: 'Roboto', sans-serif;
    margin:10px 0;
  }
  p {
    font-family: 'Lora', serif;
    max-width:100%;
  }
  &.open {
    transform:none;
  }
  @media (max-width:1024px) {
    min-width:50vw;
  }  
  @media (max-width:600px) {
    width:calc(100% - 1em);
    top:calc(1em + 45px);
    height:auto;
    left:.75em;
    padding-top:2em;
    transform:translateX(calc(-100% - 1em));
    z-index:51;
    &.open {
      transform:none;
    }
    display: ${props => (props.otherPanels || props.dataLength === 0) ? 'none' : 'initial'};
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
const SelectedSensorsPanel = styled.div`
    overflow-y: auto;
    max-height: 40vh;
`;

const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: none;
    color: #005899;
`;

const GridHeader = styled(Grid)`
    font-family: Lexend;
`;

const GridBody = styled(Grid)`
    font-family: Space Grotesk;
    cursor: pointer;
    &:hover {
        background-color: #22222222;
    }
`;
const TimestampColumn = styled(Grid)``;
const AqiValueColumn = styled(Grid)`
    text-align: right;
`;
const SensorIdColumn = styled(Grid)``;
const LocationNameColumn = styled(Grid)``;
const Color = styled.span`
    display: block;
    background-color: ${({ color }) => color};
    border: 1px solid ${({ border }) => border};
    border-radius: 10px;
    width: 16px;
    height: 16px;
`;
const ColorColumn = styled(Grid)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const LLabel = styled.span`
    font-family: Lexend;
    box-shadow: none;
    color: rgba(65, 182, 230, 1);
    margin-top: 0.5rem;
`;
const Divider = styled.hr`
    border-color: rgba(65, 182, 230, 1);
    border-width: 1px;
    margin: .5rem 0 0.5rem 0;
`;
const LHeader = styled.span`
    font-size: 32px;
    font-size: clamp(16px, 24px, 32px);
    font-family: Lexend;
    font-weight: 300;
`;

const SGBody = styled.div`
    font-family: Space Grotesk;
    font-weight: 300;
    font-style: Regular;
    font-size: 14px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;

`;

const SensorValueLabelTooltip = styled(FaInfoCircle)`
    width: 15px;
    height: 15px;
    margin-left: 0.5rem;
    align-self: center;
    color: rgba(0, 88, 153, 0.5);
    cursor: pointer;
`;


const LinkText = styled.span`
    color: rgba(0, 88, 153, 1);
    cursor: pointer;
`;
const SGHeader = styled.div`
    font-family: Space Grotesk;
    font-weight: 500;
`;

// DataPanel Function Component
const DataPanel = ({ handleGeocoder }) => {
  const dispatch = useDispatch();

  // Legacy map controls
  const panelState = useSelector(selectPanelState);

  // New sensor data
  const geojsonData = useSelector(selectSensorGeojsonData);
  const selectedSensors = useSelector(selectSelectedSensors);
  const data = useSelector(selectSensorValuesMeanPm25);
  const locations = useSelector(selectSensorLocations);

  const [selections,setSelections] = useState({
    zip: [],
    community: [],
    ward: []
  });

  // handles panel open/close
  const handleOpenClose = () => dispatch(setPanelState({ info: !panelState.info }))
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

  const getLatestValue = (id) => {
    if (!id) { return undefined; }
    const first = geojsonData?.features?.find(f => {
      return f.properties['datasourceId'] === id;
    });
    return first?.properties;
  }

  // Grab our previously-fetched data and use that to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const firstHourlyRow = data.find((r) => r.type === 'hour');

  const clearSelection = () => {
    setSelections({...selections, community: [], zip: [], ward: []});
  }
  const handleDropdownChanged = (s, key = 'community') => {
    setSelections({...selections, [key]: [s]});
    const newSelectedSensors = locations.filter(l => l[key] === s)?.map(l => l.datasourceId);
    dispatch(setSelectedSensors([...newSelectedSensors]));
    if (!selectedSensors?.includes(clickedSensor)) {
      dispatch(setClickedSensor());
      popPage('root');
    }
  }

  const mean_pm25 = useSelector(selectSensorValuesMeanPm25);
  const averageType = useSelector(selectAverageType);
  const clickedSensor = useSelector(selectClickedSensor);

  const resetAll = () => {
    setSelections({community:[],zip:[],ward:[]});
    dispatch(removeSensorsFromSelection([...selectedSensors]));
  };

  const clickedLocation = locations?.find(s => s.datasourceId === clickedSensor);
  const latest = getLatestValue(clickedSensor);
  const recentValueCount = latest?.mean_pm25?.filter((r) => r[clickedLocation.datasourceId] != null
    && r[clickedLocation.datasourceId] !== "None" && r[clickedLocation.datasourceId] !== "NaN")?.length

  const [linkCopied, setLinkCopied] = useState(false);
  const handleTooltipOpen = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
  };
  const handleTooltipClose = () => {
    setLinkCopied(false);
  };
  const [, setSearchParams] = useSearchParams();
  return (
    <DataPanelContainer className={panelState.info ? 'open' : ''} id="data-panel">
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
        <Grid container spacing={0} alignItems={'center'} justifyContent={'space-between'}>
          <Grid size={6}><span style={{ fontWeight: 200, flexDirection: 'column', alignContent:'center', fontFamily: 'Space Grotesk' }}>
            <strong style={{ fontWeight: 600 }}>Search</strong> any Chicago Address</span>
          </Grid>
          <Grid><LButton variant={'text'} onClick={() => pushPage(['Map Layers'])}>Map Layers</LButton></Grid>
        </Grid>
        <Geocoder
          id="Geocoder"
          style={{ borderRadius: '100px' }}
          placeholder={""}
          onChange={handleGeocoder}
        />

        {(selections?.community?.length > 0 || selections?.zip?.length > 0) && <Grid container spacing={4} marginTop={'0.5rem'}>
          <Grid size={10}>
            {selections?.community?.length > 0 && <span><LLabel>Community:</LLabel> {selections?.community?.[0]}</span>}
            {selections?.zip?.length > 0 && <span><LLabel>Zip code:</LLabel> {selections?.zip?.[0]}</span>}
          </Grid>
          <Grid size={2}>
            <LButton variant={'text'} size={'small'} onClick={() => clearSelection()}><FaTimes /></LButton>
          </Grid>
        </Grid>}

        {selections?.zip?.length === 0 && selections?.community?.length === 0 && <Grid container spacing={4}>
          <Grid size={4}>
            <DropdownButton onChange={(s) => handleDropdownChanged(s, 'community')}
                            ButtonComponent={LButton}
                            label={'Community'}
                            style={{ textTransform: 'capitalize' }}
                            menuStyle={{ textTransform: 'capitalize' }}
                            options={locations?.map(l => l.community)} />
          </Grid>
          <Grid size={8}>
            <DropdownButton onChange={(s) => handleDropdownChanged(s, 'zip')}
                            ButtonComponent={LButton}
                            label={'Zip code'}
                            options={locations?.map(l => l.zip)} />
          </Grid>
        </Grid>}

        {!clickedSensor && selectedSensors?.length === 0 && <LastUpdatedDisplay date={firstHourlyRow?.date} />}
        {!clickedSensor && selectedSensors?.length > 0 && <SelectedSensorsPanel>
          <Divider />
          <Grid container spacing={0} alignItems={'center'} marginTop={'2rem'}>
            <Grid size={2}>
              <LButton onClick={() => resetAll()}>
                <FaArrowLeft style={{ width: '15px', height: '15px' }} />
              </LButton>
            </Grid>

            {firstHourlyRow && Object.keys(firstHourlyRow)?.length <= 2 ?  <>Loading, Please Wait...</> : <LHeader>Selected
              {!selections?.community?.length && !selections?.zip?.length && <> Locations </>}
              {selections?.community?.length > 0 && <> Community </>}
              {selections?.zip?.length > 0 && <> Zip code </>}
            </LHeader>}
          </Grid>

          {!clickedSensor && firstHourlyRow && Object.keys(firstHourlyRow)?.length > 2 && <GridHeader container spacing={0} marginTop={'1rem'}>
            <TimestampColumn size={3}></TimestampColumn>
            <AqiValueColumn size={1}>PM2.5</AqiValueColumn>
            <ColorColumn size={1}></ColorColumn>
            <LocationNameColumn size={4}>Name</LocationNameColumn>
            {selections?.community?.length === 0 && selections?.zip?.length === 0 && <SensorIdColumn size={3}>Sensor ID</SensorIdColumn>}
            {selections?.community?.length > 0 && <SensorIdColumn size={3}>Community</SensorIdColumn>}
            {selections?.zip?.length > 0 && <SensorIdColumn size={3}>Zip code</SensorIdColumn>}
          </GridHeader>}

          {!clickedSensor && selectedSensors?.map((s, index) => {
            const { latest_mean_pm25, datasourceId, name, last_update } = getLatestValue(s);
            const range = pm2_5Ranges.find(r => r.min <= latest_mean_pm25 && latest_mean_pm25 < r.max);
            const isoTimestamp = last_update.split(' ').join('T') + 'Z';
            const lastUpdateDate = new Date(isoTimestamp);

            // Use 'en-US' to ensure the Month/Day/Year order
            const parts = new Intl.DateTimeFormat('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              month: '2-digit',
              day: '2-digit',
              year: '2-digit'
            }).formatToParts(lastUpdateDate);

            // Reconstruct to place the time before the date with a comma
            const time = `${parts.find(p => p.type === 'hour').value}${parts.find(p => p.type === 'dayPeriod').value}`;
            const date = `${parts.find(p => p.type === 'month').value}/${parts.find(p => p.type === 'day').value}/${parts.find(p => p.type === 'year').value}`;

            return (
              <GridBody container spacing={0} key={`selected-sensor-${s}-${index}`} onClick={() => dispatch(setClickedSensor(s))}>
                <TimestampColumn size={3}>
                  <small>{date} {time}</small>
                </TimestampColumn>
                <AqiValueColumn size={1}>
                  <small>{Number(latest_mean_pm25)?.toFixed(1)}</small>
                </AqiValueColumn>
                <ColorColumn size={1}>
                  <Color color={range?.color} border={range?.border}></Color>
                </ColorColumn>
                <LocationNameColumn size={4}>
                  <small>{name}</small>
                </LocationNameColumn>
                <SensorIdColumn size={3}>
                  {selections?.community?.length === 0 && selections?.zip?.length === 0 && <small>{datasourceId}</small>}
                  {selections?.community?.length > 0 && <small>{locations?.find(l => l.datasourceId === datasourceId)?.community}</small>}
                  {selections?.zip?.length > 0 && <small>{locations?.find(l => l.datasourceId === datasourceId)?.zip}</small>}
                </SensorIdColumn>
              </GridBody>
            );
          })}
        </SelectedSensorsPanel>}
        {clickedSensor && <>
          <Divider />
          <Grid container spacing={0} alignItems={'center'} marginTop={'2rem'}>
            <Grid size={2}>
              <LButton onClick={() => dispatch(setClickedSensor()) && setSearchParams({})} >
                <FaArrowLeft style={{ width: '15px', height: '15px' }} />
              </LButton>
            </Grid>

            <Grid size={8}>
              <LHeader>{clickedLocation?.name}</LHeader>
            </Grid>

            <Grid size={2} alignItems={'end'}>
              <ClickAwayListener onClickAway={handleTooltipClose}>
                <div>
                  <Tooltip
                    open={linkCopied}
                    onClose={handleTooltipClose}
                    onOpen={handleTooltipOpen}
                    placement={'left'}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    arrow={true}
                    title=" ✔  Link copied!"
                    slotProps={{
                      popper: {
                        disablePortal: true,
                      },
                    }}
                    slots={{ transition: Zoom }}
                  >
                    <LButton onClick={handleTooltipOpen}>
                      <FaLink style={{ width: '15px', height: '15px' }} />
                    </LButton>
                  </Tooltip>
                </div>
              </ClickAwayListener>
            </Grid>
          </Grid>

          <Grid container spacing={0}>
            <Grid offset={2} size={7}>
              <LastUpdatedDisplay datasourceId={clickedSensor}></LastUpdatedDisplay>
            </Grid>
            <Grid size={3}>
              <LButton onClick={() => pushPage(['Details'])}>Details &rarr;</LButton>
            </Grid>
          </Grid>

          {firstHourlyRow && Object.keys(firstHourlyRow)?.length > 2 && recentValueCount > 0 && <Grid container spacing={0} alignItems={'center'}>
            <Grid offset={2} size={8}>
              <SensorValueDisplay scale={'μg/m³'} value={latest?.latest_mean_pm25}></SensorValueDisplay>
            </Grid>
            <Grid size={2} onClick={() => pushPage(['Color Coding Air Quality'])}><SensorValueLabelTooltip /></Grid>
          </Grid>}

          <Grid container spacing={0}>
            <Grid offset={2} size={10}>
              {firstHourlyRow && Object.keys(firstHourlyRow)?.length <= 2 && <>Loading, Please Wait...</>}
              {firstHourlyRow && Object.keys(firstHourlyRow)?.length > 2 && recentValueCount === 0 && <Grid>No recent readings found.</Grid> }
            </Grid>
          </Grid>

          <Grid container alignItems={'center'}>
            <Grid offset={1} size={11}>
              {recentValueCount > 0 && <SensorBarChart datasourceId={clickedSensor} averageType={averageType} dataset={mean_pm25?.filter(d => d.type === averageType)?.reverse()} />}
            </Grid>
          </Grid>
        </>}
      </>}

      {currentPage === 'Color Coding Air Quality' && <>
        <Grid container spacing={0} marginTop={'1rem'}>
          <LButton as={Grid} size={1} variant={'text'} onClick={() => popPage()}
                   style={{ cursor: 'pointer', marginTop: '0.4rem' }}>
            <FaArrowCircleLeft style={{ width: '19px', height: '19px' }} />
          </LButton>

          <Grid size={11}>
            <LHeader>Color Coding Air Quality</LHeader>

            <SGBody style={{ margin: '1rem 0' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis Ut enim ad minim veniam, quis Ut enim ad minim veniam, quis.
            </SGBody>

            {pm2_5Ranges?.map(({ range, label, color, border}, index) => <Grid container spacing={2}>
              <Grid size={12} key={`overlay-key-${index}-${label}`} alignItems={'center'} display={'flex'}>
                <span style={{ display: 'inline-block',  backgroundColor: color, width: '19px', height: '64px', margin: '0.3rem 0' }}></span>
                <div style={{ marginLeft: '1rem' }}>
                  <LHeader style={{ fontSize: '18px', fontWeight: 700, color: ['Good', 'Moderate'].includes(label) ? border : color }}>{label}</LHeader>
                  <SGBody style={{ fontSize: '14px', marginTop: '0.5rem' }}>AQI {range}</SGBody>
                </div>
              </Grid>
            </Grid>)}
          </Grid>
        </Grid>
      </>}

      {breadcrumbs?.includes('Details') && currentPage !== 'Color Coding Air Quality' && <>
        <Grid container spacing={0} marginTop={'1rem'}>
          <LButton as={Grid} size={1} variant={'text'} onClick={() => popPage('root')}
                   style={{ cursor: 'pointer', marginTop: '0.4rem' }}>
            <FaArrowCircleLeft style={{ width: '19px', height: '19px' }} />
          </LButton>

          {currentPage === 'Details' && <Grid size={11}>
            <LHeader><LinkText onClick={() => popPage('root')}>{clickedLocation?.name}</LinkText> / Details</LHeader>

            <Grid  container spacing={2} marginTop={'1.5rem'}>
              <Grid size={6}>
                <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'AQI : ??'} disabled textAlign={'center'} />
              </Grid>
              <Grid size={6}>
                <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'PM 2.5 : ' + latest?.latest_mean_pm25} disabled textAlign={'center'} />
              </Grid>
            </Grid>
            <Grid container spacing={2} marginTop={'1rem'}>
              <Grid size={6}>
                <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'NO₂ : ??'} disabled textAlign={'center'} />
              </Grid>
              <Grid size={6}>
                <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'BC : ??'} disabled textAlign={'center'} />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent={'space-between'} alignItems={'center'}>
              <LastUpdatedDisplay datasourceId={clickedSensor}></LastUpdatedDisplay>
              <LButton onClick={() => pushPage(['Explain'])}>Explain &rarr;</LButton>
            </Grid>

            <Divider />

            <Grid container spacing={2} margin={'1rem 0'} justifyContent={'space-between'} alignItems={'center'}>
              <div style={{ display: 'flex' }}>
                <FaChartLine style={{ width: '28px', height: '28px', color: 'rgba(65, 182, 230, 1)' }} />
                <LHeader style={{ marginLeft: '0.5rem', fontSize: '18px' }}>Historical Trends</LHeader>
              </div>
              <LButton onClick={() => {
                const s3endpoint = process.env.REACT_APP_S3_ENDPOINT_URL;
                const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;

                // MINIO => host="http://localhost:9000" bucket_name="chicago-aq"
                // AWS S3 => host="s3.us-east-2.amazonaws.com" bucket_name="chicago-aq"
                const meanPm25Url = `${s3endpoint}/${bucketName}/current/mean_pm25.parquet`;
                //const locationsUrl = `${s3endpoint}/${bucketName}/current/locations.parquet`;
                window.open(meanPm25Url, '_blank');
                //window.open(locationsUrl, '_blank');

                // TODO: transfer to CSV before download?
              }}>Download &rarr;</LButton>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl id="paramSelect" variant="outlined" fullWidth>
                  <InputLabel htmlFor="paramSelect">Parameter</InputLabel>
                  <Select
                    variant={"filled"}
                    value={'pm25'}
                    MenuProps={{ id: "variableMenu" }}
                  >
                    <MenuItem value="pm25">PM 2.5</MenuItem>
                    <MenuItem value="aqi">AQI</MenuItem>
                    <MenuItem value="no2">NO₂</MenuItem>
                    <MenuItem value="bc">BC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl id="paramSelect" variant="outlined" fullWidth>
                  <InputLabel htmlFor="paramSelect">View by</InputLabel>
                  <Select
                    variant={"filled"}
                    value={averageType}
                    onChange={(e) => {
                      dispatch(setAverageType(e.target.value))
                    }}
                    MenuProps={{ id: "variableMenu" }}
                  >
                    <MenuItem value="hour">Hour</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="season">Season</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={0}>
              <Grid offset={2} size={10}>
                {firstHourlyRow && Object.keys(firstHourlyRow)?.length <= 2 && <>Loading, Please Wait...</>}
                {firstHourlyRow && Object.keys(firstHourlyRow)?.length > 2 && recentValueCount === 0 && <Grid>No recent readings found.</Grid> }
              </Grid>
            </Grid>

            <Grid container alignItems={'center'}>
              <Grid offset={1} size={11}>
                {recentValueCount > 0 && <SensorBarChart datasourceId={clickedSensor} averageType={averageType} dataset={mean_pm25?.filter(d => d.type === averageType)?.reverse()} />}
              </Grid>
            </Grid>
          </Grid>}


          {currentPage === 'Explain' && <Grid size={11}>
            <LHeader>
              <LinkText onClick={() => popPage('root')}>...</LinkText> / <LinkText onClick={() => popPage('Details')}>Details</LinkText> / Explain
            </LHeader>

            <Grid container spacing={2} marginTop={'1.5rem'}>
              <Grid size={12}>
                <SGHeader>AQI - Air Quality Index</SGHeader>
                <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
              </Grid>
              <Grid size={12}>
                <SGHeader>PM 2.5 - Particulate Matter 2.5</SGHeader>
                <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
              </Grid>
              <Grid size={12}>
                <SGHeader>NO2 - Nitrogen Dioxide</SGHeader>
                <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
              </Grid>
              <Grid size={12}>
                <SGHeader>BC - Black Carbon</SGHeader>
                <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
              </Grid>
            </Grid>
          </Grid>}

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
