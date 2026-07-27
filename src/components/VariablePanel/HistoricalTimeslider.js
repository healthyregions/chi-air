// AQColorScale.js
import {colors} from "../../config";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {selectPanelState, setPanelState} from "../../store/slices/legacyStoreSlice";
import {useDispatch, useSelector} from "react-redux";
import {FaHistory} from "react-icons/fa";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  selectAverageType, selectMetricData,
  selectMetricIndex,
  selectSelectedTimeIndex, selectSensorParameter,
  setAverageType
} from "../../store/slices/sensorDataSlice";
import MenuItem from "@mui/material/MenuItem";
import {Slider} from "@mui/material";
import {useCallback, useMemo, useState} from "react";

//// Styled components CSS
// Main container for entire panel
const TimesliderContainer = styled.div`
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
  padding: 24px 27px;
  box-sizing: border-box;
  transition:250ms all;
  font-family: 'Roboto', sans-serif;
  color:${colors.black};
  font-size:100%;
  z-index:7;
  transform: ${({ $large, $open }) => $open ? 'none' : ($large ? 'translateX(calc(-100%))' : 'translateX(calc(-100% - 1em))')};

  #avgTypeSelectHistorical div {
      font-family: Space Grotesk;
      font-size: 16px;
      font-weight: 400;
      padding: 0.4rem 0.4rem;
  }
    
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

const HistoryIcon = styled(FaHistory)`
    height: 16px;
    color: rgba(0, 88, 153, 0.5);
`;

const SliderLabel = styled.span`
    font-family: Space Grotesk, sans-serif;
    font-size: 14px;
    font-weight: 400;
`;

export const HistoricalTimeslider = () => {
  const largeScreen = useMediaQuery('(min-width: 600px)');

  const dispatch = useDispatch();
  const panelState = useSelector(selectPanelState);
  const [granularity, setGranularity] = useState('day');

  // Find data points when granularity changes
  const metricIndex = useSelector(selectMetricIndex);
  const selectedTimeIndex = useSelector(selectSelectedTimeIndex);
  const metricData = useSelector(selectMetricData);
  const selectedParameter = useSelector(selectSensorParameter);

  const handleOpenClose = () => dispatch(setPanelState({ history: !panelState.history }));
  const [value, setValue] = useState(30);

  const handleChange = (event, newValue) => { setValue(newValue); };

  const getStartDate = (endDate: Date): Date => {
    const startDate = new Date(endDate);
    if (granularity === 'day') {
      // show "Last Day" => start = 1 day ago ~ end - 1 day
      startDate.setDate(endDate.getDate() - 1);
    } else if (granularity === 'week') {
      // show "Last Week" => start = 7 days ago ~ end - 7 days
      startDate.setDate(endDate.getDate() - 7);
    } else if (granularity === 'month') {
      // show "Last Month" => start = 30 days ago ~ end - 30 days
      startDate.setDate(endDate.getDate() - 30);
    } else if (granularity === 'season') {
      // show "Last Season" => start = 3 months ago ~ end - 90 days
      startDate.setDate(endDate.getDate() - 90);
    } else if (granularity === 'year') {
      // show "Last Year" => start = 1 year ago ~ end - 365 days
      startDate.setDate(endDate.getDate() - 365);
    }
    return startDate;
  }

  const historicalSlice = useMemo(() => {
    const endDate = new Date(metricData?.[0]?.date);
    const startDate = getStartDate(endDate);

    const filtered = metricData?.filter((m) => m?.date > startDate?.toISOString());
    console.log(filtered);
    return filtered;
  }, [metricData, getStartDate]);

  const [sliderStart: Date, sliderEnd: Date] = useMemo(() => {
    // Select dataset based on granularity
    // Filter by time, unless user chooses "all"
    const data = granularity === 'all' ? metricData : historicalSlice;

    // Determine start + end dates based on our historical slice
    const endDate = new Date(data?.[0]?.date);
    const end = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const startDate = new Date(data?.[data?.length - 1]?.date);
    const start = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return [start, end];
  }, [granularity, metricData, historicalSlice]);

  return (
    <TimesliderContainer $large={largeScreen} $open={panelState.history}>
      <Grid container spacing={0} alignItems={'center'} justifyContent={'space-between'}>
        <Grid size={{ xs: 6 }} style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '18px', color: 'rgba(68, 68, 68, 1)' }}>
          <HistoryIcon /> Historical Trends
        </Grid>
        <Grid size={{ xs:4 }}>
          <FormControl id="avgTypeSelectHistorical" variant="outlined" fullWidth>
            <Select
              variant={"outlined"}
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
            >
              <MenuItem value="day" disabled={metricIndex.day <= 0}>Last Day</MenuItem>
              <MenuItem value="week" disabled={metricIndex.week <= 0}>Last Week</MenuItem>
              <MenuItem value="month" disabled={metricIndex.month <= 0}>Last Month</MenuItem>
              <MenuItem value="season" disabled={metricIndex.season <= 0}>Last Season</MenuItem>
              <MenuItem value="year" disabled={metricIndex.year <= 0}>Last Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid marginTop={'1.5rem'}>
        <Grid container alignItems={'center'}>
          <Grid size={{ xs: 2 }}>
            <SliderLabel>{sliderStart}</SliderLabel>
          </Grid>
          <Grid size={{ xs: 8 }}>
            <Slider aria-label="History" value={value} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 2 }} textAlign={'end'}>
            <SliderLabel>{sliderEnd}</SliderLabel>
          </Grid>
        </Grid>
      </Grid>

      <button onClick={handleOpenClose} id="showHideRight" className={panelState.history ? 'active' : 'hidden'}><FaHistory /></button>
    </TimesliderContainer>
  );
}

