import {BarChart, BarChartProps} from "@mui/x-charts/BarChart";
import {pm2_5Ranges} from "../../config";
import Grid from "@mui/material/Grid";
import {useEffect, useMemo, useRef, useState} from "react";
import {FaChevronCircleLeft} from "react-icons/fa";
import {FaChevronCircleRight} from "react-icons/fa";
import {formatDate, LButton} from "./common";


const getIsoWeekRange = (year, weekNumber) => {
  // ISO 8601 rule: Week 1 always contains January 4th
  const jan4 = new Date(year, 0, 4);

  // Get Day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = jan4.getDay();

  // Adjust so Monday is 1 and Sunday is 7
  const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  // Find the Monday of Week 1
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setDate(jan4.getDate() - isoDayOfWeek + 1);

  // Calculate the target week's Monday (Start Date)
  const startDate = new Date(startOfWeek1);
  startDate.setDate(startOfWeek1.getDate() + (weekNumber - 1) * 7);

  // Calculate the target week's Sunday (End Date)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  // Optional: Reset time to midnight/end of day if needed
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}

const shortDateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UCT",
});


export const SensorBarChart = ({ context = 'recent', selectedParameter, margin = {left:30,top:30}, style = {}, showScroll = false, pageSize = 24, metricData, averageType }) => {
  const [page, setPage] = useState(0);

  // Listen for changes to averageType or selectedParameter
  // Reset page number when averageType or selectedParameter changes
  const prevType = useRef();
  const prevParam = useRef();
  useEffect(() => {
    if (prevType.current !== averageType) {
      prevType.current = averageType;
      setPage(0);
    }
    if (prevParam.current !== selectedParameter) {
      prevParam.current = selectedParameter;
      setPage(0);
    }
  }, [averageType, selectedParameter]);

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
  const itemsCount = metricData?.length;
  const numPages = Math.ceil(itemsCount / pageSize);
  const pageStart = useMemo(() => pageSize * (page), [page, pageSize]);
  const pageEnd = useMemo(() => pageSize * (page + 1), [page, pageSize]);

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
      max: getMaxValue() + 100,
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
          const segments = v?.split('-W');
          const year = segments[0];
          const weekNum = segments[1];

          const {startDate, endDate} = getIsoWeekRange(year, weekNum);

          // Format ISO dates to be more human-readable
          const startOfWeek = startDate.toISOString().split('T')[0];
          const endOfWeek = endDate.toISOString().split('T')[0];
          const shortStartDate = shortDateFormat.format(new Date(startOfWeek));
          const shortEndDate = shortDateFormat.format(new Date(endOfWeek));

          // Format xAxisLabel strip off the year but show this in tooltip
          const xAxisLabel = shortStartDate.split(',')[0].replaceAll(' ', "\n");

          return context.location === 'tick' ? xAxisLabel : `${shortStartDate.toString()} - ${shortEndDate.toString()}`;
        } else if (averageType === 'month') {
          const segments = v?.split('-');
          const year = segments[0];
          const month = segments[1];
          switch (Number(month)) {
            case 1: return context.location === 'tick' ? 'Jan' : `${year} January`;
            case 2: return context.location === 'tick' ? 'Feb' : `${year} February`;
            case 3: return context.location === 'tick' ? 'Mar' : `${year} March`;
            case 4: return context.location === 'tick' ? 'Apr' : `${year} April`;
            case 5: return context.location === 'tick' ? 'May' : `${year} May`;
            case 6: return context.location === 'tick' ? 'June' : `${year} June`;
            case 7: return context.location === 'tick' ? 'July' : `${year} July`;
            case 8: return context.location === 'tick' ? 'Aug' : `${year} August`;
            case 9: return context.location === 'tick' ? 'Sep' : `${year} September`;
            case 10: return context.location === 'tick' ? 'Oct' : `${year} October`;
            case 11: return context.location === 'tick' ? 'Nov' : `${year} November`;
            case 12: return context.location === 'tick' ? 'Dec' : `${year} December`;
            default:
              console.error(`Encountered unsupported month=${month}: ` + v)
              return 'Unknown'
          }
        } else if (averageType === 'season') {
          const segments = v?.split('-');
          const year = segments[0];
          const season = segments[1];
          const seasonName = season.substring(0,1).toUpperCase() + season.substring(1);
          return context.location === 'tick' ? seasonName : `${year} ${seasonName}`
        } else if (averageType === 'year') {
          return v;
        } else {
          console.error(`ERROR: Encountered an unsupported averageType=${averageType}`)
        }
      }
    }],
  };

  // Additional styling for Historical Trends
  if (context === 'historical') {
    chartSettings.sx = {
      // Shrinks the legend/series labels
      '& .MuiBarChart-seriesLabels > text': {
        fontSize: '0.6rem',
        fontFamily: 'Lexend',
        fontWeight: 500,
      },
    };
  }

  return (
    <>
      <Grid container spacing={0} alignItems={'center'}>
        {showScroll && <Grid size={1}>
          {(page + 1) < numPages && <LButton style={{ fontSize: '28px', width: '36px', height: '36px', zIndex: 20 }} onClick={scrollForward}>
            <FaChevronCircleLeft style={{ ...style, border: '2px solid white', borderRadius: '100px', backgroundColor: 'white', color: 'rgba(0, 88, 153, 1)' }} />
          </LButton>}
        </Grid>}

        {filteredData.length > 0 && <Grid size={showScroll ? 10 : 12}>
          <BarChart {...chartSettings} margin={{...margin, top:20, }} />
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
