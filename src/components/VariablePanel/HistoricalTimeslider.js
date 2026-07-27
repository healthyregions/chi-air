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
  selectMetricData,
  selectMetricIndex,
  setSelectedTimeIndex,
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
  const metricData = useSelector(selectMetricData);

  const handleOpenClose = () => dispatch(setPanelState({ history: !panelState.history }));
  const [value, setValue] = useState(30);

  const fromIso = (d) => new Date(d.split(' ').join('T') + 'Z')
  const getStartDate = useCallback((endDate: Date): Date => {
    const startDate = new Date(endDate);
    if (granularity === 'day') {
      // show "Last Day" => start = 1 day ago ~ end - 1 day
      startDate.setDate(endDate.getDate() - 1);
      const firstDataPoint = metricData?.filter(m => m?.type === 'hour')?.reverse()?.find((m) => fromIso(m?.date)?.getTime() > startDate?.getTime());
      return fromIso(firstDataPoint?.date);
    } else if (granularity === 'week') {
      // show "Last Week" => start = 7 days ago ~ end - 7 days
      startDate.setDate(endDate.getDate() - 7);
      const firstDataPoint = metricData?.filter(m => m?.type === 'hour')?.reverse()?.find((m) => fromIso(m?.date)?.getTime() > startDate?.getTime());
      return fromIso(firstDataPoint?.date);
    } else if (granularity === 'month') {
      // show "Last Month" => start = 1 month ago ~ end - 1 month
      startDate.setMonth(endDate.getMonth() - 1);
      const firstDataPoint = metricData?.filter(m => m?.type === 'hour')?.reverse()?.find((m) => fromIso(m?.date)?.getTime() > startDate?.getTime());
      return fromIso(firstDataPoint?.date);
    } else if (granularity === 'season') {
      // show "Last Season" => start = 3 months ago ~ end - 3 months
      startDate.setMonth(endDate.getMonth() - 3);
      const firstDataPoint = metricData?.filter(m => m?.type === 'hour')?.reverse()?.find((m) => fromIso(m?.date)?.getTime() > startDate?.getTime());
      return fromIso(firstDataPoint?.date);
    } else if (granularity === 'year') {
      // show "Last Year" => start = 1 year ago ~ end - 1 year
      startDate.setFullYear(endDate.getFullYear() - 1);
      const firstDataPoint = metricData?.filter(m => m?.type === 'hour')?.reverse()?.find((m) => fromIso(m?.date)?.getTime() > startDate?.getTime());
      return fromIso(firstDataPoint?.date);
    } else if (granularity === 'all') {
      return new Date(metricData?.filter(m => m?.type === 'hour')?.reverse()?.find(() => true)?.date.split(' ').join('T') + 'Z');
    }
    return startDate;
  }, [metricData, granularity]);

  function valuetext(value, length) {
    const offset = length - value;
    const isoDate = metricData?.filter(m => m?.type === 'hour')?.[offset]?.date?.split(' ').join('T') + 'Z';
    return new Date(isoDate)?.toLocaleTimeString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' });
  }

  const [sliderStart: Date, sliderEnd: Date] = useMemo(() => {
    // Select dataset based on granularity
    // Filter by time, unless user chooses "all"
    //const data = granularity === 'all' ? metricData : historicalSlice;

    // Determine start + end dates based on our historical slice
    //const endDate = new Date(data?.[0]?.date.split(' ').join('T') + 'Z');
    const endDateIso = metricData?.filter(m => m?.type === 'hour')?.find(() => true)?.date.split(' ').join('T') + 'Z';
    const endDate = new Date(endDateIso);

    const end = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    //const startDate = new Date(data?.[data?.length - 1]?.date.split(' ').join('T') + 'Z');
    const startDate = getStartDate(endDate);
    const start = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return [start, end];
  }, [getStartDate, metricData]);

  const numTicks = () => {
    const now = new Date();
    if (granularity === 'day') {
      return 24;
      //const dayAgo = new Date()?.setTime(now?.getTime() - 24*60*60*1000);  // 24 hours
      //return metricData?.filter(m => m?.type === 'hour' && fromIso(m?.date)?.getTime() > dayAgo)?.length;
    } else if (granularity === 'week') {
      return 7*24;
      //const weekAgo = new Date()?.setTime(now?.getTime() - 7*24*60*60*1000);  // 7 days
      //return metricData?.filter(m => m?.type === 'hour' && fromIso(m?.date)?.getTime() > weekAgo)?.length;
    } else if (granularity === 'month') {
      const monthAgo = new Date()?.setTime(now?.getTime() - 30*24*60*60*1000);  // 30 days
      return metricData?.filter(m => m?.type === 'hour' && fromIso(m?.date)?.getTime() > monthAgo)?.length;
    } else if (granularity === 'season') {
      const threeMonthsAgo = new Date()?.setTime(now?.getTime() - 3*30*24*60*60*1000);  // 90 days
      return metricData?.filter(m => m?.type === 'hour' && fromIso(m?.date)?.getTime() > threeMonthsAgo)?.length;
    } else if (granularity === 'year') {
      const oneYearAgo = new Date()?.setTime(now?.getTime() - 365*24*60*60*1000);  // 24 hours
      return metricData?.filter(m => m?.type === 'hour' && fromIso(m?.date)?.getTime() > oneYearAgo)?.length;
    } else {
      return metricData?.filter(m => m?.type === 'hour')?.length;
    }
  }

  const handleChange = (event, newValue) => { setValue(newValue); };
  const handleCommit = (event, finalValue) => {
    const index = numTicks() - finalValue;
    console.log("Triggered only when mouse is released:", index);
    // Call your API or heavy logic here

    console.log(`Now showing on the map: ${index}`);

    dispatch(setSelectedTimeIndex({ index }));
  };

  return (
    <TimesliderContainer $large={largeScreen} $open={panelState.history}>
      <Grid container spacing={0} alignItems={'center'} justifyContent={'space-between'}>
        <Grid size={{ xs: 6 }} style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '18px', color: 'rgba(68, 68, 68, 1)' }}>
          <HistoryIcon /> Historical Trends
        </Grid>
        <Grid size={{ xs: 5 }}>
          <FormControl id="avgTypeSelectHistorical" variant="outlined" fullWidth>
            <Select
              variant={"outlined"}
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
            >
              <MenuItem value="day" disabled={metricIndex.day <= 0}>Past Day</MenuItem>
              <MenuItem value="week" disabled={metricIndex.week <= 0}>Past Week</MenuItem>
              <MenuItem value="month" disabled={metricIndex.month <= 0}>Past Month</MenuItem>
              <MenuItem value="season" disabled={metricIndex.season <= 0}>Past 3 Months</MenuItem>
              <MenuItem value="year" disabled={metricIndex.year <= 0}>Past Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid marginTop={'1.5rem'}>
        <Grid container alignItems={'center'}>
          <Grid size={{ xs: 2 }}>
            { granularity !== 'year' && granularity !== 'all' && <SliderLabel>{sliderStart}</SliderLabel> }
            { granularity === 'year' && <SliderLabel>{sliderStart}</SliderLabel> }
            { granularity === 'all' && <SliderLabel>{sliderStart}</SliderLabel> }
          </Grid>
          <Grid size={{ xs: 8 }}>
            <Slider aria-label="History"
                    // Value format & display
                    getAriaValueText={valuetext}
                    valueLabelFormat={(value) => valuetext(value, numTicks())}
                    valueLabelDisplay="on"
                    value={value}

                    // Numerical behavior
                    shiftStep={8}
                    min={0}
                    max={numTicks()}
                    onChange={handleChange}
                    onChangeCommitted={handleCommit}

                    // Custom styling for valueLabel / tooltip
                    track={false}
                    sx={{
                      '& .MuiSlider-rail': {
                        color: '#41B6E6'
                      },
                      '& .MuiSlider-thumb': {
                        color: '#005899'
                      },
                      // Target the value label container
                      '& .MuiSlider-valueLabel': {
                        fontSize: 12,
                        fontWeight: 'normal',
                        fontFamily: 'Space Grotesk',
                        top: 50, // Adjust distance from thumb
                        backgroundColor: '#00000000', // transparent background
                        color: '#41B6E6', // Change text color
                        '&::before': {
                          display: 'none', // Hides the default little arrow bubble point
                        },
                      },
                    }}
            />
          </Grid>
          <Grid size={{ xs: 2 }} textAlign={'end'}>
            { granularity !== 'year' && granularity !== 'all' && <SliderLabel>{sliderEnd}</SliderLabel> }
            { granularity === 'year' && <SliderLabel>{sliderEnd}</SliderLabel> }
            { granularity === 'all' && <SliderLabel>{sliderEnd}</SliderLabel> }
          </Grid>
        </Grid>
      </Grid>

      <button onClick={handleOpenClose} id="showHideRight" className={panelState.history ? 'active' : 'hidden'}><FaHistory /></button>
    </TimesliderContainer>
  );
}

