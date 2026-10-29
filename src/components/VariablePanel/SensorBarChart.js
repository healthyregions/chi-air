import {BarChart, BarChartProps} from "@mui/x-charts/BarChart";
import {pm2_5Ranges} from "../../config";
import Grid from "@mui/material/Grid";
import {useEffect, useMemo, useRef, useState} from "react";
import { animated } from '@react-spring/web';
import {FaChevronCircleLeft} from "react-icons/fa";
import {FaChevronCircleRight} from "react-icons/fa";
import {formatDate, formatWeekDate, LButton, shortDateFormat} from "./common";
import {useDispatch, useSelector} from "react-redux";
import {
  selectClickedSensor,
  selectMetricIndex, selectSelectedTimeIndex,
  setSelectedTimeIndex
} from "../../store/slices/sensorDataSlice";
import {scaleColor} from "../../utils";


export const SensorBarChart = ({ context = 'recent', selectedParameter, margin = {left:30,top:30}, style = {}, showScroll = false, pageSize = 20, metricData, averageType }) => {
  const [page, setPage] = useState(0);
  const clickedSensor = useSelector(selectClickedSensor);
  const dispatch = useDispatch();
  const metricIndex = useSelector(selectMetricIndex);
  const selectedTimeIndex = useSelector(selectSelectedTimeIndex);

  // Listen for changes to averageType or selectedParameter
  // Reset page number when averageType or selectedParameter changes
  const prevType = useRef();
  const prevParam = useRef();
  const prevSensor = useRef();
  useEffect(() => {
    if (prevType.current !== averageType) {
      prevType.current = averageType;
      setPage(0);
      const index = metricIndex[averageType];
      const row = metricData?.[0];
      const date = row?.date;
      const value = row?.[selectedParameter];
      dispatch(setSelectedTimeIndex({ type: averageType, index: 0, date }));
    } else if (prevParam.current !== selectedParameter) {
      prevParam.current = selectedParameter;
      setPage(0);
    } else if (prevSensor.current !== clickedSensor) {
      prevSensor.current = clickedSensor;
      setPage(0);
    }
  }, [averageType, selectedParameter, clickedSensor]);

  const scrollBack = () => page > 0 && setPage(page - 1);
  const scrollForward = () => page < (numPages - 1) && setPage(page + 1);

  const formatValue = (v) => {
    if (selectedParameter === 'nowcast_aqi') {
      return `${Math.round(Number(v))} AQI`;
    } else if (selectedParameter === 'clarity_no2') {
      return `${Number(v)?.toFixed(1)} ppb`;
    } else if (selectedParameter === 'mean_pm25' || selectedParameter === 'clarity_pm25') {
      return `${Number(v)?.toFixed(1)} μg/m³`;
    } else {
      return `ERR`;
    }
  }

  const getMaxValue = () => {
    // For all metrics on the current page, compute and return the max numerical value
    return metricData
      ?.slice(pageStart, pageEnd)
      ?.reduce((max, m) => {
        const value =  m?.value || m?.[selectedParameter];
        return value > max ? value : max;
      }, -Infinity);
  };

  // Paging metadata: item count, number of pages, page number, page size, etc
  // TODO: how to calculate this with multiple parameters?
  const numItems = metricData?.length;
  const numPages = Math.ceil(numItems / pageSize);
  const pageStart = useMemo(() => pageSize * (page), [page, pageSize]);
  const pageEnd = useMemo(() => pageSize * (page + 1), [page, pageSize]);
  const isLastPage = useMemo(() => page === numPages - 1, [page, numPages]);
  const numItemsOnLastPage = useMemo(() => numItems % pageSize, [numItems, pageSize]);

  //const selectedTimeIndex = useSelector(selectSelectedTimeIndex);

  /*useEffect(() => {
    const type = selectedTimeIndex?.type;
    const index = metricIndex?.[type];
    const date = metricData?.[index]?.date;

    dispatch(setSelectedTimeIndex({ index, type, date }))
  }, [selectedTimeIndex?.type, dispatch, metricData, metricIndex]);*/

  const maxValue = getMaxValue();

  // Filter the data and build a bar graph from it
  const filteredData = useMemo(() => metricData?.slice(pageStart, pageEnd)?.reverse(), [metricData, pageStart, pageEnd]);

  const chartSettings: BarChartProps = {
    dataset: filteredData,
    height: 175,
    borderRadius: 4,

    // Data to graph: Mean PM2.5 Values
    series: [
      {
        dataKey: selectedParameter,
        minBarSize: 8,
        barLabel: context === 'historical' ? 'value' : '',
        barLabelPlacement: context === 'historical' ? 'outside' : '',
        valueGetter: (v) =>
          selectedParameter === 'nowcast_aqi' ? Math.round(Number(v?.[selectedParameter])) : Number(v?.[selectedParameter])?.toFixed(1),
        valueFormatter: (v) => formatValue(v)
      }
    ],

    // Y-Axis: Mean PM2.5 values
    yAxis: [{
      disableLine: true, // Hides the main vertical line
      disableTicks: true,
      position: 'none',  // Hides the Y-Axis, since bars have individual values
      width: 60,
      max: maxValue + (0.15 * maxValue),
      colorMap: {
        type: 'piecewise',
        thresholds: pm2_5Ranges?.map(r => {
          if (selectedParameter === 'nowcast_aqi') {
            return r.aqi_max;
          } else if (selectedParameter === 'clarity_pm25' || selectedParameter === 'mean_pm25') {
            return r.pm25_max;
          } else if (selectedParameter === 'clarity_no2') {
            return r.no2_max;
          } else {
            console.error('Unsupported metric name: ' + selectedParameter)
            return undefined;
          }
        }),
        colors: pm2_5Ranges?.map(r => r.color),
      },
    }],

    // X-Axis: Date
    xAxis: [{
      height: 25,
      disableLine: true, // Hides the main vertical line
      disableTicks: true,
      scaleType: 'band',
      dataKey: 'date',
      barGapRatio: 3,
      tickPlacement: 'middle',
      tickLabelStyle: {
        fontFamily: 'Space Grotesk',
        fontSize: '0.7rem',
      },
      valueFormatter: (v, context) => {
        // no-op for weekly / seasonal averages (e.g. 2026-W01, 2026-S1, etc)
        if (averageType === 'hour') {
          const {date, time} = formatDate({
            timestamp: v,
            format: 'long',
            year: context.location !== 'tick'
          });
          return context.location === 'tick' ? time?.split(' ')?.join( '\n') : `${date} ${time}`;
        } else if (averageType === 'day') {
          const {date} = formatDate({
            timestamp: v,
            format: 'long',
            year: context.location !== 'tick'
          });
          const shortStartDate = shortDateFormat.format(new Date(date));

          // Format xAxisLabel - strip off the year but show this in tooltip
          const xAxisLabel = shortStartDate.split(',')[0].replaceAll(' ', "\n");
          return context.location === 'tick' ? xAxisLabel : shortStartDate;
        } else if (averageType === 'week') {
          const [weekStartDate, weekEndDate] = formatWeekDate(v);

          // Format xAxisLabel strip off the year but show this in tooltip
          const xAxisLabel = weekStartDate.split(',')[0].replaceAll(' ', "\n");

          return context.location === 'tick' ? xAxisLabel : `${weekStartDate.toString()} - ${weekEndDate.toString()}`;
        } else if (averageType === 'month') {
          const segments = v?.split('-');
          const year = segments[0];
          const month = segments[1];
          switch (Number(month)) {
            case 1: return context.location === 'tick' ? `Jan\n${year}` : `January ${year}`;
            case 2: return context.location === 'tick' ? `Feb\n${year}` : `February ${year}`;
            case 3: return context.location === 'tick' ? `Mar\n${year}` : `March ${year}`;
            case 4: return context.location === 'tick' ? `Apr\n${year}` : `April ${year}`;
            case 5: return context.location === 'tick' ? `May\n${year}` : `May ${year}`;
            case 6: return context.location === 'tick' ? `June\n${year}` : `June ${year}`;
            case 7: return context.location === 'tick' ? `July\n${year}` : `July ${year}`;
            case 8: return context.location === 'tick' ? `Aug\n${year}` : `August ${year}`;
            case 9: return context.location === 'tick' ? `Sep\n${year}` : `September ${year}`;
            case 10: return context.location === 'tick' ? `Oct\n${year}` : `October ${year}`;
            case 11: return context.location === 'tick' ? `Nov\n${year}` : `November ${year}`;
            case 12: return context.location === 'tick' ? `Dec\n${year}` : `December ${year}`;
            default:
              console.error(`Encountered unsupported month=${month}: ` + v)
              return 'Unknown'
          }
        } else if (averageType === 'season') {
          const segments = v?.split('-');
          const year = segments[0];
          const season = segments[1];
          const seasonName = season.substring(0,1).toUpperCase() + season.substring(1);
          return context.location === 'tick' ? `${seasonName}\n${year} ` : `${seasonName} ${year}`
        } else if (averageType === 'year') {
          return v;
        } else {
          console.error(`ERROR: Encountered an unsupported averageType=${averageType}`)
        }
      }
    }],
  };

  const bins = pm2_5Ranges.map(r => {
    if (selectedParameter === 'nowcast_aqi') {
      return r.aqi_max;
    } else if (selectedParameter === 'clarity_pm25' || selectedParameter === 'mean_pm25') {
      return r.pm25_max;
    } else if (selectedParameter === 'clarity_no2') {
      return r.no2_max;
    } else {
      console.error('Unsupported metric name: ' + selectedParameter)
      return undefined
    }
  });

  const onBarClick = (d) => {
    const negativeOffset = d?.dataIndex;
    const offset = (page * pageSize) + ((pageSize-1) - negativeOffset);
    //const startIndex = metricIndex?.[averageType];

    const index = /*startIndex + */ offset;
    const row = metricData?.[index];
    const type = averageType;
    const date = row?.date;

    console.log(`Selected:  negativeOffset=${negativeOffset}   index=${index}   date=${date}   type=${type}`, metricIndex);
    dispatch(setSelectedTimeIndex({ index, date, type }));
  };

  return (
    <>
      <Grid container spacing={0} alignItems={'center'}>
        {showScroll && <Grid size={1}>
          {(page + 1) < numPages && <LButton style={{ fontSize: '28px', width: '36px', height: '36px', zIndex: 20 }} onClick={scrollForward}>
            <FaChevronCircleLeft style={{ ...style, border: '2px solid white', borderRadius: '100px', backgroundColor: 'white', color: 'rgba(0, 88, 153, 1)' }} />
          </LButton>}
        </Grid>}

        {filteredData.length > 0 && <Grid size={showScroll ? 10 : 12}>
          <BarChart {...chartSettings} onItemClick={(event, d) => onBarClick(d)} slots={{
            axisTickLabel: (props) => {
              const { text, ...otherProps } = props;
              if (!text) { return (<></>); }
              const [pre,post] = text?.split('\n');
              return (<text {...otherProps}>
                <tspan style={{ fontWeight: 'bold' }}>{pre}</tspan>
                {post && <tspan
                  x={otherProps.x}
                  dy="1.2em">{post}</tspan>
                }
              </text>);
            },
            // Conditionally color the barLabel text
            barLabel: (props) => {
              // Extract positioning metrics supplied by MUI X
              const {
                seriesId,
                dataIndex,
                color,
                isFaded,
                isHighlighted,
                classes,
                xOrigin,
                yOrigin,
                x,
                y,
                width,
                height,
                layout,
                skipAnimation,
                ...restOfMuiProps
              } = props;

              // BarGraph dataIndex returns a reverse index into the page
              const offsetIntoPage = (isLastPage ? numItemsOnLastPage : pageSize) - 1 - Number(props.dataIndex);
              const startOfPage = pageSize*page;
              const index = startOfPage + offsetIntoPage;
              const value = metricData?.[index]?.[selectedParameter];
              const fill = scaleColor(value, bins, value >= 100 ? pm2_5Ranges.map(r => r.color) : pm2_5Ranges.map(r => r.border));
              //console.log(`BARLABEL  offsetIntoPage=${offsetIntoPage}   startOfPage=${startOfPage}   index=${index}   value=${value}   fill=${fill}`);

              // Calculate the exact horizontal midpoint of the bar
              const barCenterRelativeX = x + width / 2;

              // Offset the Y value slightly if you want a bit of breathing room above the bar
              const labelSpacingAboveY = y - 6;
              return (
                <animated.text
                  {...restOfMuiProps}
                  fill={fill}
                  x={barCenterRelativeX}       // Assign the calculated center point
                  y={labelSpacingAboveY}       // Assign the vertical placement
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fontWeight: 'semibold', fontFamily: 'Lexend', fontSize: '0.5rem' }}
                >
                  {selectedParameter === 'nowcast_aqi' ? Number(value)?.toFixed(0) : Number(value)?.toFixed(1)}
                </animated.text>
              );
            },
          }} slotProps={{
            bar: (ownerState) => {
              // BarGraph dataIndex is a reverse index into the page
              const offsetIntoPage = (isLastPage ? numItemsOnLastPage : pageSize) - 1 - Number(ownerState.dataIndex);
              const startOfPage = pageSize*page;
              const index = startOfPage + offsetIntoPage;
              const value = metricData?.[index]?.[selectedParameter];

              const stroke = scaleColor(value, bins, pm2_5Ranges.map(r => r.border));
              console.log(`BAR  offsetIntoPage=${offsetIntoPage}   startOfPage=${startOfPage}   index=${index}   value=${value}   stroke=${stroke}`);

              return {
                stroke,
                strokeWidth: index === selectedTimeIndex?.index ? 6 : 3,
              }
            },
          }} />
        </Grid>}

        {showScroll && <Grid size={1}>
          {page > 0 && <LButton style={{ fontSize: '28px', right: '2rem', width: '36px', height: '36px' }} onClick={scrollBack}>
            <FaChevronCircleRight style={{ ...style, border: '2px solid white', borderRadius: '100px', backgroundColor: 'white', color: 'rgba(0, 88, 153, 1)' }} />
          </LButton>}
        </Grid>}
      </Grid>

      <Grid container>
        <Grid size={{ xs: 12 }} textAlign={'center'}>
          { averageType === 'week' && <strong>Start of Week</strong> }
        </Grid>
      </Grid>
    </>
  );
}
