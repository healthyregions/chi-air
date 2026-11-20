import {BarChart, BarChartProps} from "@mui/x-charts/BarChart";
import {pm2_5Ranges} from "../../config";
import Grid from "@mui/material/Grid";
import {useEffect, useMemo, useRef, useState} from "react";
import {FaChevronCircleLeft} from "react-icons/fa";
import {FaChevronCircleRight} from "react-icons/fa";
import {formatDate, LButton} from "./common";
import {useTranslation} from "react-i18next";


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

// Display-only date formatters, localized to the current UI language
const getShortDateFormat = (lng) => new Intl.DateTimeFormat(lng, {
  dateStyle: "medium",
  timeZone: "UTC",
});
// Axis tick label: month + day only (no year), split across two lines
const getTickDateFormat = (lng) => new Intl.DateTimeFormat(lng, {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const formatTick = (fmt, d) => fmt.format(d).replaceAll(' ', "\n");


export const SensorBarChart = ({ context = 'recent', selectedParameter, margin = {left:30,top:30}, style = {}, showScroll = false, pageSize = 24, metricData, averageType }) => {
  const [page, setPage] = useState(0);
  const { t, i18n } = useTranslation('panel');
  const lng = i18n.resolvedLanguage;
  const shortDateFormat = useMemo(() => getShortDateFormat(lng), [lng]);
  const tickDateFormat = useMemo(() => getTickDateFormat(lng), [lng]);

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
      return t('chart.error');
    }
  }

  const getMaxValue = () => {
    // For all metrics on the current page, compute and return the max numerical value
    return metricData
      ?.slice(pageStart, pageEnd)
      ?.reduce((max, m) => {
        const value =  m?.value || m?.[selectedParameter];
        return value > max ? value : max;
      }, -Infinity) + (selectedParameter === 'nowcast_aqi' ? 100 : 30);
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
      max: getMaxValue(),
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
          // Interpret the MM/DD/YY date as a UTC calendar date
          const [mm, dd, yy] = date.split('/').map(Number);
          const day = new Date(Date.UTC(2000 + yy, mm - 1, dd));
          const shortStartDate = shortDateFormat.format(day);

          // Format xAxisLabel - strip off the year but show this in tooltip
          const xAxisLabel = formatTick(tickDateFormat, day);
          return context.location === 'tick' ? xAxisLabel : shortStartDate;
        } else if (averageType === 'week') {
          const segments = v?.split('-W');
          const year = segments[0];
          const weekNum = segments[1];

          const {startDate, endDate} = getIsoWeekRange(year, weekNum);

          // Format ISO dates to be more human-readable
          const startOfWeek = new Date(startDate.toISOString().split('T')[0]);
          const endOfWeek = new Date(endDate.toISOString().split('T')[0]);
          const shortStartDate = shortDateFormat.format(startOfWeek);
          const shortEndDate = shortDateFormat.format(endOfWeek);

          // Format xAxisLabel strip off the year but show this in tooltip
          const xAxisLabel = formatTick(tickDateFormat, startOfWeek);

          return context.location === 'tick' ? xAxisLabel : `${shortStartDate.toString()} - ${shortEndDate.toString()}`;
        } else if (averageType === 'month') {
          const segments = v?.split('-');
          const year = segments[0];
          const month = segments[1];
          const monthNum = Number(month);
          if (!(monthNum >= 1 && monthNum <= 12)) {
            console.error(`Encountered unsupported month=${month}: ` + v)
            return t('chart.unknown');
          }
          // Localized month names (e.g. "Jan" / "2026 January")
          const monthDate = new Date(Date.UTC(Number(year), monthNum - 1, 1));
          return context.location === 'tick'
            ? new Intl.DateTimeFormat(lng, { month: 'short', timeZone: 'UTC' }).format(monthDate)
            : `${year} ${new Intl.DateTimeFormat(lng, { month: 'long', timeZone: 'UTC' }).format(monthDate)}`;
        } else if (averageType === 'season') {
          const segments = v?.split('-');
          const year = segments[0];
          const season = segments[1];
          const seasonName = t(`chart.seasons.${season?.toLowerCase()}`, { defaultValue: season.substring(0,1).toUpperCase() + season.substring(1) });
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
          { averageType === 'week' && <strong>{t('chart.startOfWeek')}</strong> }
        </Grid>
      </Grid>
    </>
  );
}
