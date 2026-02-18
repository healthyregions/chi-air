// This components formats the data for the selected geography
// and displays it in the right side panel.

// Import main libraries
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Import helper libraries
import styled from 'styled-components';
// import FormControl from '@mui/material/FormControl';
// import Slider from '@mui/material/Slider';
// import { withStyles, makeStyles } from '@mui/material/styles';

// Import config and sub-components
// import Tooltip from './tooltip';
// import BarChart from './BarChart';
import Histogram from '../Charts/Histogram';
import { Gutter } from '../Layout/Gutter';
// import NeighborhoodCounts from './NeighborhoodCounts';
import {selectPanelState, selectRanges, selectSelectionData, setPanelState} from '../../store/slices/legacyStoreSlice';
import {colors, pm2_5Ranges} from '../../config';
import { report } from '../../config/svg';
import VariablesDropdown from "../VariablePanel/VariablesDropdown";
import OverlaysDropdown from "../VariablePanel/OverlaysDropdown";
import {Button, FormControl, Menu} from "@mui/material";
import VariableDescriptionDisplay from "../VariablePanel/VariableDescriptionDisplay";
import OverlaysColorLegend from "../VariablePanel/OverlaysColorLegend";
import Geocoder from "./Geocoder";
import {FaCaretDown} from "@react-icons/all-files/fa/FaCaretDown";
import {FaHistory} from "@react-icons/all-files/fa/FaHistory";
import {
  removeSensorsFromSelection,
  selectSelectedSensors, selectSensorGeojsonData, selectSensorLocations,
  selectSensorValuesMeanPm25
} from "../../store/slices/sensorDataSlice";
import {NavLink} from "react-router-dom";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {DropdownButton} from "../VariablePanel/DropdownButton";

//// Styled components CSS
// Main container for entire panel
const DataPanelContainer = styled.div`
  position:fixed;
  width:433px;
  right:0.5em;
  top:0.5em;
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
    height:calc(100% - 6em);
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
    box-shadow: 2px 0px 5px ${colors.gray}88;
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
`
// Scrollable Wrapper for main report information
const ReportWrapper = styled.div`
  height:100%;
  overflow-y:scroll;

  ::-webkit-scrollbar {
    width: 10px;
  }
  
  /* Track */
  ::-webkit-scrollbar-track {
    background: ${colors.white};
  }
   
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: url('${process.env.PUBLIC_URL}/icons/grip.png'), ${colors.gray}55;
    background-position: center center;
    background-repeat: no-repeat, no-repeat;
    background-size: 50%, 100%; 
    transition:125ms all;
  }
  
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: url('${process.env.PUBLIC_URL}/icons/grip.png'), ${colors.darkgray}99;
    background-position: center center;
    background-repeat: no-repeat, no-repeat;
    background-size: 50%, 100%; 
  
`

// Inner container for report content
const ReportContainer = styled.div`
    padding:10px 15px;
    box-sizing:border-box;
    overflow-x:visible;
    max-height: calc(100vh - 2em);
    // Multi-column layout (NYI)
    // display:flex;
    // flex-direction:column;
    // flex-wrap:wrap;
    // width:500px;
    // columns:${props => props.cols} 250px;
    // column-gap:10px;
    // display:inline-block;
    h3, .h3 {
      font-size:150%;
      display:block;
      margin:0;
      padding:0 0 15px 0 !important;
      font-weight:bold;
      &:before {
        content: ': ';
        display: none;
      }
      &:after {
        content:" ";
        white-space:pre;
        height:0;
        display:none;
      }
    }
    h3.sectionHeader {
      margin:0;
      padding:0 !important;
    }
    div.numberContainer {
      display:flex;
    }
    .bigOnly {
      display:initial;
    }
    
`

// Subsection of report
const ReportSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const AgeColumnsToChart = [
  {
    'column':'percentage_seniors',
    'name':'% Seniors',
    'color':colors.skyblue,
    'preset':'',
  },
  {
    'column':'percentage_children',
    'name':'% Children',
    'color':colors.gray,
    'preset':'',
  },
]

const SelectedSensorsPanel = styled.div`
    overflow-y: auto;
    max-height: 40vh;
`;

const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: capitalize;
`;

const GridHeader = styled(Grid)`
    font-family: Lexend;
`;

const GridBody = styled(Grid)`
    font-family: Space Grotesk;
`;
const TimestampColumn = styled(Grid)``;
const AqiValueColumn = styled(Grid)`
    text-align: right;
`;
const SensorIdColumn = styled(Grid)``;
const LocationNameColumn = styled(Grid)``;
const Color = styled.span`
    display: block;
    background-color: ${(props) => props.color};
    border: 1px solid ${(props) => props.border};
    border-radius: 10px;
    width: 16px;
    height: 16px;
`;
const ColorColumn = styled(Grid)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;


// DataPanel Function Component
const DataPanel = ({ handleGeocoder }) => {
  const dispatch = useDispatch();

  // Legacy map controls
  const selectionData = useSelector(selectSelectionData);
  const panelState = useSelector(selectPanelState);
  const ranges = useSelector(selectRanges);

  // New sensor data
  const geojsonData = useSelector(selectSensorGeojsonData);
  const selectedSensors = useSelector(selectSelectedSensors);
  const data = useSelector(selectSensorValuesMeanPm25);
  const locations = useSelector(selectSensorLocations);
  // const filterValues = useSelector(selectFilterValues);

  // handles panel open/close
  const handleOpenClose = () => dispatch(setPanelState({ info: !panelState.info }))
  const [breadcrumbs, setBreadcrumbs] = useState(['root']);

  // Page selector logic for navigating the panel via breadcrumbs and links
  const currentPage = breadcrumbs[breadcrumbs.length - 1];
  const pushPage = (bc) => {
    setBreadcrumbs([...breadcrumbs, bc]);
  };
  const popPage = () => {
    if (currentPage !== 'root') {
      setBreadcrumbs([...breadcrumbs.slice(0, breadcrumbs.length-1)]);
    }
  };

  const getLatestValue = (id) => {
    const first = geojsonData?.features?.find(f => {
      return f.properties['datasourceId'] === id;
    });
    return first?.properties;
  }

  const formatDate = (input) => {
    if (Object.prototype.toString.call(input) !== "[object Date]" || isNaN(input)) {
      // either not a date object or date object is not valid

      return undefined;
    }

    // Use 'en-US' to ensure the Month/Day/Year order
    const parts = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    }).formatToParts(input);

    // Reconstruct to place the time before the date with a comma
    const time = `${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value} ${parts.find(p => p.type === 'dayPeriod').value}`;
    const date = `${parts.find(p => p.type === 'month').value}/${parts.find(p => p.type === 'day').value}/${parts.find(p => p.type === 'year').value}`;

      return { time, date };
  }


  // Grab our previously-fetched data and use that to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const firstHourlyRow = data.find((r) => r.type === 'hour');
  const lastUpdatedUtcTimestamp = firstHourlyRow?.date?.split(' ')?.join('T') + 'Z';
  const lastUpdated = new Date(lastUpdatedUtcTimestamp);
  const formatted = formatDate(lastUpdated);
  const [open, setOpen] = useState(false);
  const [community, setCommunity] = useState([]);
  const [zip, setZip] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCommunityChange = (event) => {
    setCommunity(event.target.value);
  };
  const handleZipChange = (event) => {
    setZip(event.target.value);
  };

  return (
    <DataPanelContainer className={panelState.info ? 'open' : ''} id="data-panel" otherPanels={panelState.variables}>
      {currentPage === 'root' && <>

      <Grid container spacing={4} alignItems={'center'}>
        <Grid size={9}><img src={'/icons/chiair-logo.svg'} alt={'Chicago Air Quality'} width={254} height={41}/></Grid>
        <Grid><LButton variant={'text'} size={'small'} endIcon={<FaCaretDown />}>Eng</LButton></Grid>
      </Grid>
        <LButton
          component={NavLink} // Use the NavLink component for routing
          to="/"         // Specify the destination path
          variant="text" // Optional: apply Material UI button styles
        >
          &larr; Homepage
        </LButton>
        <Grid container spacing={0} alignItems={'center'} justifyContent={'space-between'}>
          <Grid size={6}><span style={{ fontWeight: 200, flexDirection: 'column', alignContent:'center', fontFamily: 'Space Grotesk' }}>
            <strong style={{ fontWeight: 600 }}>Search</strong> any Chicago Address</span>
          </Grid>
          <Grid><LButton variant={'text'} onClick={() => pushPage('layers')}>Map Layers</LButton></Grid>
        </Grid>
        <Geocoder
          id="Geocoder"
          style={{ borderRadius: '100px' }}
          placeholder={" Type in an address or zip code to start mapping, e.g. 60643"}
          onChange={handleGeocoder}
        />

        <Grid container spacing={4}>
          <Grid size={4}>
            <DropdownButton ButtonComponent={LButton} label={'Community'} options={locations?.map(l => l.community)} />
          </Grid>
          <Grid size={8}>
            <DropdownButton ButtonComponent={LButton} label={'Zip code'} options={locations?.map(l => l.zip)} />
          </Grid>
        </Grid>

        {selectedSensors?.length === 0 && <div style={{ margin: '0.5rem 0' }}>
            <span style={{ fontWeight: 200, fontFamily: 'Space Grotesk' }}>
              <FaHistory style={{ transform: 'scaleX(-1)', color: 'lightblue', marginRight: '0.35rem' }} />
              <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', marginRight: '0.25rem' }}>updat{formatted?.time ? 'ed' : 'ing'}</span>
              {formatted?.time || 'Loading'}, {formatted?.date || 'Please Wait...'}
            </span>
          </div>
        }
        {selectedSensors?.length > 0 && <SelectedSensorsPanel>
          <hr />
          <LButton onClick={() => dispatch(removeSensorsFromSelection([...selectedSensors]))}>&larr; Back</LButton>

          <GridHeader container spacing={0}>
            <TimestampColumn size={3}></TimestampColumn>
            <AqiValueColumn size={1}>PM2.5</AqiValueColumn>
            <ColorColumn size={1}></ColorColumn>
            <LocationNameColumn size={4}>Location Name</LocationNameColumn>
            <SensorIdColumn size={3}>Sensor ID</SensorIdColumn>
          </GridHeader>

          {selectedSensors?.map((s, index) => {
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
              <GridBody container spacing={0} key={`selected-sensor-${s}-${index}`}>
                <TimestampColumn size={3}>
                  <small>{date} {time}</small>
                </TimestampColumn>
                <AqiValueColumn size={1}>
                  <small>{Number(latest_mean_pm25)?.toFixed(1)}</small>
                </AqiValueColumn>
                <ColorColumn size={1}>
                  <small><Color color={range?.color} border={range?.border}></Color></small>
                </ColorColumn>
                <LocationNameColumn size={4}>
                  <small>{name}</small>
                </LocationNameColumn>
                <SensorIdColumn size={3}>
                  <small>{datasourceId}</small>
                </SensorIdColumn>
              </GridBody>
            );
          })}
        </SelectedSensorsPanel>}
      </>}

      {currentPage === 'layers' && <>
        <LButton variant={'text'} onClick={() => popPage()}>Back</LButton>
        <h1>Map Layers</h1>

        <div>
          Customize your view to see how air quality intersects with
          your community. Use overlays and filters to explore how
          social determinants impact health outcomes in your area.
        </div>

        <VariablesDropdown></VariablesDropdown>
        <VariableDescriptionDisplay></VariableDescriptionDisplay>
        <OverlaysDropdown></OverlaysDropdown>
        <OverlaysColorLegend></OverlaysColorLegend>
      </>}

      {currentPage === 'selection' && <>
        <LButton variant={'text'} onClick={() => popPage()}>Back</LButton>
        <div>Selected sensors</div>
        {selectionData.success &&
          <ReportWrapper>
            <ReportContainer>
              <ReportSection>
                <h1>Current View</h1>
                {/*  <p>Tree Canopy Coverage</p>
                    <h3>{selectionData.treeCoverage.toFixed(1)}%</h3> */}
                <p>Heat Island Percentile</p>
                <h3>{selectionData.heatIsland.toFixed(1)}</h3>

              </ReportSection>
              <h2>Filters</h2>
              <br/>
              <p style={{padding:0}}>
                These charts show the distribution of variables in the tracts on your screen. Adjust the sliders to filter the map.
              </p>
              <Gutter height="1em" />
              <h3 className="sectionHeader">Age Demographics</h3>
              {
                AgeColumnsToChart.map(({name, column, color}, i) =>
                  <Histogram
                    name={name}
                    column={column}
                    histCounts={selectionData.histCounts[column]}
                    density={selectionData.densities[column]}
                    range={ranges[column]}
                    color={color}
                    key={`distribution-5-${i}`}
                  />
                )
              }
            </ReportContainer>
          </ReportWrapper>
        }
      </>}


      <button onClick={handleOpenClose} id="showHideRight" className={panelState.info ? 'active' : 'hidden'}>{report}</button>
    </DataPanelContainer>
  );
}

export default DataPanel;
