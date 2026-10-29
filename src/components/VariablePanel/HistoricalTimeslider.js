// AQColorScale.js
import {colors} from "../../config";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {selectPanelState, setPanelState} from "../../store/slices/legacyStoreSlice";
import {useDispatch, useSelector} from "react-redux";
import {FaRegCalendarAlt} from "react-icons/fa";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  selectAverageType,
  selectMetricData,
  selectMetricIndex, selectSelectedTimeIndex, setAverageType,
  setSelectedTimeIndex,
} from "../../store/slices/sensorDataSlice";
import MenuItem from "@mui/material/MenuItem";
import {Slider} from "@mui/material";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import {formatWeekDate, fromIso} from "./common";

// Extend dayjs with the required plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

//// Styled components CSS
// Main container for entire panel
const TimesliderContainer = styled.div`
  position: fixed;
  border-radius: 8px;
  border: 1px solid rgba(65, 182, 230, 1);
  width: 433px;
  left: ${({ $open }) => $open ? '2rem' : '0'};
  bottom: ${({ $large }) => $large ? '2rem' : '0'};
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
        top:calc(1em + 45px);
        height: max-content; // calc(100% - 55em);
        bottom:.5em;
        left: ${({ $large, $open }) => $open ?  '.5em' : '' };
        padding-bottom: 2em;
        z-index:51;
        display: ${props => (props.otherPanels || props.dataLength === 0) ? 'none' : 'initial'};
    }

    button#showHideRight {
        position:absolute;
        bottom:20px;
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
            //transform:rotate(180deg);
            transition:500ms all;
        }
        :after {
            opacity:0;
            font-weight:bold;
            color:${colors.gray};
            position: relative;
            bottom:-17px;
            transition:500ms all;
            content: 'Report';
            right:50px;
            z-index:4;
        }
        &.hidden {
            svg {
                //transform:rotate(0deg);
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
                //transform:rotate(0deg);
            }
            :after {
                display:none;
            }
            &.active {
                left:90%;
            }
            &.active svg {
                //transform:rotate(90deg);
            }
        }
    }
    
`;

const SliderLabel = styled.span`
    font-family: Space Grotesk, sans-serif;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    color: ${colors.chicagoDarkBlue};
`;

export const HistoricalTimeslider = () => {
  const largeScreen = useMediaQuery('(min-width: 600px)');
  const selectedTimeIndex = useSelector(selectSelectedTimeIndex);

  const dispatch = useDispatch();
  const panelState = useSelector(selectPanelState);
  const averageType = useSelector(selectAverageType);

  // Find data points when averageType changes
  const metricIndex = useSelector(selectMetricIndex);
  const metricData = useSelector(selectMetricData);

  // State for the start/end DatePickers
  const sliderStartRef = useRef();
  const sliderEndRef = useRef();
  const sliderStartValueRef = useRef();
  const sliderEndValueRef = useRef();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [sliderStartDate, setSliderStartDate] = useState(dayjs(new Date().getTime() - (60*60*24*7*1000)));
  const [sliderEndDate, setSliderEndDate] = useState(dayjs(new Date()?.toISOString()));

  const handleOpenClose = () => dispatch(setPanelState({ history: !panelState.history }));
  const [value, setValue] = useState(9999999);

  const formatDate = (date) => {
    if (!date) { return; }
    //console.log(`Formatting: date=${date}`, averageType);
    if (averageType === 'hour') {
      const format = { month: 'short', day: 'numeric', hour: 'numeric' };
      if (sliderStartDate?.year() !== sliderEndDate?.year()) {
        format.year = 'numeric';    // show year only if it is relevant
      }
      return new Date(fromIso(date))?.toLocaleTimeString('en-US', format);
    } else if (averageType === 'day') {
      const format = { month: 'short', day: 'numeric', year: 'numeric' };
      return dayjs(date)?.toDate().toLocaleDateString('en-US', format);
    } else if (averageType === 'week') {
      const [weekStartDate,] = formatWeekDate(date);
      return 'Week of ' + weekStartDate;
    } else if (averageType === 'month') {
      const startOfMonth = dayjs(date).tz("utc").startOf('month');
      return 'Month of ' + startOfMonth.format('MMMM YYYY');
    } else if (averageType === 'season') {
      const [year: string, season: string] = date?.split('-');
      const s = season?.toLowerCase();
      if (s === 'spring') {
        return `Spring ${year}`;
      } else if (s === 'summer') {
        return `Summer ${year}`;
      } else if (s === 'winter') {
        return `Winter ${year}`;
      } else if (s === 'fall') {
        return `Fall ${year}`;
      }
    } else if (averageType === 'year') {
      return date;
    } else {
      console.log(`WARNING: unrecognized averageType=${averageType}`);
    }
  }

  const filteredValues = useMemo(() => {
    const filteredData = metricData?.filter(m => m?.type === averageType);
    if (averageType === 'hour') {
      const start = dayjs(sliderStartDate).tz("America/Chicago").hour(0).minute(0).second(0).millisecond(0);
      const end = dayjs(sliderEndDate).tz("America/Chicago").hour(0).minute(0).second(0).millisecond(0);
      const hourFiltered = filteredData?.filter(m => {
        const current = dayjs(fromIso(m?.date));
        return (start <= current) && (current <= end);
      });
      //console.log(`start=${start}   end=${end}`, hourFiltered);
      return hourFiltered;
    } else if (averageType === 'day') {
      const start = dayjs(sliderStartDate).tz("utc").hour(0).minute(0).second(0).millisecond(0);
      const end = dayjs(sliderEndDate).tz("utc").hour(0).minute(0).second(0).millisecond(0);
      const dayFiltered = filteredData?.filter(m => {
        const current = dayjs(m?.date).tz("utc");
        return (start <= current) && (current <= end);
      });
      //console.log(`start=${start}   end=${end}`, dayFiltered);
      return dayFiltered;
    } else if (averageType === 'week') {
      const start = dayjs(sliderStartDate).tz("utc").hour(0).minute(0).second(0).millisecond(0);
      const end = dayjs(sliderEndDate).tz("utc").hour(0).minute(0).second(0).millisecond(0);
      const weekFiltered = filteredData?.filter(m => {
        const [weekStartDate, weekEndDate] = formatWeekDate(m?.date);
        return dayjs(weekStartDate).isBetween(start, end) || dayjs(weekEndDate).isBetween(start, end) || dayjs(start).isBetween(weekStartDate, weekEndDate) || dayjs(end).isBetween(weekStartDate, weekEndDate);
      });
      //console.log(`start=${start}   end=${end}`, weekFiltered);
      return weekFiltered;
    } else if (averageType === 'month') {
      const start = dayjs(sliderStartDate).tz("utc").hour(0).minute(0).second(0).millisecond(0);
      const end = dayjs(sliderEndDate).tz("utc").hour(0).minute(0).second(0).millisecond(0);
      const monthFiltered = filteredData?.filter(m => {
        const startOfMonth = dayjs(m?.date).tz("utc").startOf('month');
        const endOfMonth = dayjs(m?.date).tz("utc").endOf('month');
        return dayjs(startOfMonth).isBetween(start, end) || dayjs(endOfMonth).isBetween(start, end) || dayjs(start).isBetween(startOfMonth, endOfMonth) || dayjs(end).isBetween(startOfMonth, endOfMonth);
      });
      //console.log(`start=${start}   end=${end}`, monthFiltered);
      return monthFiltered;
    } else if (averageType === 'season') {
      const start = dayjs(sliderStartDate).tz("utc").hour(0).minute(0).second(0).millisecond(0);
      const end = dayjs(sliderEndDate).tz("utc").hour(0).minute(0).second(0).millisecond(0);
      const seasonFiltered = filteredData?.filter(m => {
        const [year, season] = m?.date?.split('-');
        const month =
          season?.toLowerCase() === 'spring' ? 3 :
          season?.toLowerCase() === 'summer' ? 6 :
          season?.toLowerCase() === 'fall' || season?.toLowerCase() === 'autumn' ? 9 : 12;
        //console.log(`DATE=${m?.date}   year=${year}   season=${season}   month=${month}`, );
        const startOfSeason = dayjs().month(month).year(year).tz("utc").startOf('month');
        const endOfSeason = dayjs().month(month).year(year).tz("utc").endOf('month');
        return dayjs(startOfSeason).isBetween(start, end) || dayjs(endOfSeason).isBetween(start, end) || dayjs(start).isBetween(startOfSeason, endOfSeason) || dayjs(end).isBetween(startOfSeason, endOfSeason);
      });
      //console.log(`start=${start}   end=${end}`, seasonFiltered);
      return seasonFiltered;
    } else if (averageType === 'year') {
      const start = dayjs(sliderStartDate).tz("utc").hour(0).minute(0).second(0).millisecond(0);
      const end = dayjs(sliderEndDate).tz("utc").hour(0).minute(0).second(0).millisecond(0);
      const yearFiltered = filteredData?.filter(m => {
        const year = m?.date;
        const startOfYear = dayjs().year(year).tz("utc").startOf('year');
        const endOfYear = dayjs().year(year).tz("utc").endOf('year');
        return dayjs(startOfYear).isBetween(start, end) || dayjs(endOfYear).isBetween(start, end) || dayjs(start).isBetween(startOfYear, endOfYear) || dayjs(end).isBetween(startOfYear, endOfYear);
      });
      //console.log(`start=${start}   end=${end}`, yearFiltered);
      return yearFiltered;
    } else {
      console.log(`WARNING: encountered unrecognized averageType=${averageType}`);
    }
  }, [sliderStartDate, sliderEndDate, averageType, metricData]);

  function valuetext(value, length) {
    // Value is numerical index of the slider selection
    // We want to dereference this index, then format the resulting date
    const offsetInRange = (length - 1) - value;
    //console.log(`Offset=${offsetInRange}   Length=${length}`);
    const filteredData = filteredValues?.[offsetInRange];
    //console.log(`Selected=`, filteredData);
    return formatDate(filteredData?.date);
  }

  const getRow = useCallback((finalValue) => {
    // Timeslider returns a reverse index into filteredData
    const offset = filteredValues?.length - 1 - finalValue;
    const startIndex = metricIndex[averageType];

    // Find the index into the full dataset
    const index = startIndex + offset;
    return [metricData?.[index], index];
  }, [filteredValues, averageType, metricIndex, metricData]);

  const setMapState = useCallback((offset) => {
    const [row, index] = getRow(offset);
    const date = row?.date;
    const type = row?.type;
    console.log(`index=${index}  date=${date}  type=${type}`);

    dispatch(setSelectedTimeIndex({ index, date, type }));
  }, [dispatch, getRow]);

  const handleChange = (event, newValue) => { setValue(newValue); };
  const handleCommit = (event, finalValue) => {
    //setValue(finalValue);
    setMapState(finalValue);
  };

  const selectedDateRef = useRef();

  useEffect(() => {
    // Update slider value if it changes elsewhere (sync w/ Historical Trends panel)
    if (selectedDateRef?.current !== selectedTimeIndex?.date) {
      selectedDateRef.current = selectedTimeIndex?.date;
      const found = filteredValues?.find(r => r?.date === selectedDateRef.current);
      const index = filteredValues?.indexOf(found);
      setValue(filteredValues?.length - 1 - index);
    }
    const selectedDate = fromIso(selectedTimeIndex?.date);
    console.log(`SelectedDate=${dayjs(selectedDate).tz("America/Chicago")}`, filteredValues);
    // const prevStart = sliderStartValueRef?.current;
    // const currStart = sliderStartDate?.toDate();
    // const beforeRangeStart = sliderStartDate.toDate().getTime() > dayjs(fromIso(selectedTimeIndex?.date)).toDate().getTime();
    // if (prevStart !== currStart && beforeRangeStart) {
    //   // Set to range start
    //   setValue(0);
    //   setMapState(0);
    //   sliderStartValueRef.current = currStart;
    // }
    // const prevEnd = sliderEndValueRef?.current;
    // const currEnd = sliderEndDate?.toDate();
    // const afterRangeEnd = sliderEndDate.toDate().getTime() < dayjs(fromIso(selectedTimeIndex?.date)).toDate().getTime();
    // if (prevEnd !== currEnd && afterRangeEnd) {
    //   // Set to range end
    //   setValue(filteredValues?.length - 1);
    //   setMapState(filteredValues?.length - 1);
    //   sliderEndValueRef.current = currEnd;
    // }
  }, [filteredValues, sliderStartDate, sliderEndDate, selectedTimeIndex?.date, setMapState]);

  const prettyAverageType = ((type) => {
    if (type === 'season') {
      return 'seasonal';
    } else if (type === 'day') {
      return 'daily';
    }
    return `${type}ly`;
  })(averageType);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimesliderContainer $large={largeScreen} $open={panelState.history}>
        <Grid container spacing={0} alignItems={'center'} justifyContent={'space-between'}>
          <Grid size={{ xs: 6 }} style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '18px', color: '#444444' }}>
            Change Over Time
          </Grid>
          <Grid size={{ xs: 5 }}>
            <FormControl id="avgTypeSelectSlider" variant="outlined" fullWidth>
              {/*<InputLabel id={"avgTypeSelectSlider-label"}>Type</InputLabel>*/}
              <Select
                aria-describedby={`avgTypeSelectSlider-helper-text`}
                labelId={`avgTypeSelectSlider-label`}
                variant={"outlined"}
                sx={{ color: '#444444' }}
                value={averageType}
                renderValue={(value) => prettyAverageType[0]?.toUpperCase() + prettyAverageType.substring(1)}
                //label={"Type"}
                onChange={(e) => dispatch(setAverageType(e.target.value))}
              >
                <MenuItem value="hour">Hourly</MenuItem>
                <MenuItem value="day" disabled={metricIndex.day <= 0}>Daily</MenuItem>
                <MenuItem value="week" disabled={metricIndex.week <= 0}>Weekly</MenuItem>
                <MenuItem value="month" disabled={metricIndex.month <= 0}>Monthly</MenuItem>
                <MenuItem value="season" disabled={metricIndex.season <= 0}>Seasonal</MenuItem>
                <MenuItem value="year" disabled={metricIndex.year <= 0}>Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>


        <Grid marginTop={'2rem'}>
          <Grid container alignItems={'center'}>
            <Grid size={{ xs: 2 }}>
              <SliderLabel ref={sliderStartRef} onClick={() => setStartDateOpen(true)}>
                <div>{sliderStartDate?.format('MMM D')}</div>
                <small>{sliderStartDate?.format('YYYY')}</small>
              </SliderLabel>
              <DatePicker
                inputRef={sliderStartRef?.current}
                open={startDateOpen}
                maxDate={sliderEndDate}
                format={'MMM D\nYYYY'}
                onOpen={() => setStartDateOpen(true)}
                onClose={() => setStartDateOpen(false)}
                value={sliderStartDate}
                onChange={(newValue) => setSliderStartDate(newValue)}
                slotProps={{
                  popper: {
                    anchorEl: sliderStartRef?.current
                  },
                  textField: {
                    style: {display:'none'}
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 8 }}>
              <Slider aria-label="History"
                      // Value format & display
                      getAriaValueText={valuetext}
                      valueLabelFormat={(value) => valuetext(value, filteredValues?.length)}
                      valueLabelDisplay="on"
                      value={value}
                      disabled={filteredValues?.length === 0}

                      // Numerical behavior
                      shiftStep={8}
                      min={0}
                      max={filteredValues?.length - 1}
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
                          fontSize: 14,
                          fontWeight: 'semibold',
                          fontFamily: 'Space Grotesk',
                          bottom: 50, // Adjust distance from thumb
                          paddingBottom: '0.75rem',
                          backgroundColor: '#00000000', // transparent background
                          color: '#005899', // Change text color
                          '&::before': {
                            display: 'none', // Hides the default little arrow bubble point
                          },
                        },
                      }}
              />
              {filteredValues?.length > 0 ? <Grid container justifyContent={'center'} textAlign={'center'} style={{ fontFamily: 'Space Grotesk', fontSize:'0.6rem' }}>
                Results: {filteredValues?.length}
              </Grid> : <></>}
              {filteredValues?.length === 0 ? <Grid container justifyContent={'center'} textAlign={'center'} style={{ fontFamily: 'Space Grotesk', fontSize:'0.6rem', color: colors.chicagoRed }}>
                No {prettyAverageType} results found within selected dates.<br/>
                Click the Start/End Date to choose a new range.
              </Grid> : <></>}
            </Grid>
            <Grid size={{ xs: 2 }} textAlign={'end'}>
              <SliderLabel ref={sliderEndRef} onClick={() => setEndDateOpen(true)}>
                <div>{sliderEndDate?.format('MMM D')}</div>
                <small>{sliderEndDate?.format('YYYY')}</small>
              </SliderLabel>
              <DatePicker
                inputRef={sliderEndRef?.current}
                open={endDateOpen}
                format={'MMM D\nYYYY'}
                minDate={sliderStartDate}
                maxDate={dayjs(new Date())}
                onOpen={() => setEndDateOpen(true)}
                onClose={() => setEndDateOpen(false)}
                value={sliderEndDate}
                onChange={(newValue) => setSliderEndDate(newValue)}
                slotProps={{
                  popper: {
                    anchorEl: sliderEndRef?.current
                  },
                  textField: {
                    style: {display:'none'}
                  }
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <button onClick={handleOpenClose} id="showHideRight" className={panelState.history ? 'active' : 'hidden'}><FaRegCalendarAlt /></button>

      </TimesliderContainer>
    </LocalizationProvider>
  );
}

