import {BarChart} from "@mui/x-charts/BarChart";
import {pm2_5Ranges} from "../../config";
import Grid from "@mui/material/Grid";
import {useEffect, useMemo, useRef, useState} from "react";
import {FaChevronCircleLeft} from "react-icons/fa";
import {FaChevronCircleRight} from "react-icons/fa";
import {formatDate, LButton} from "./common";

export const SensorBarChart = ({ selectedParameter, margin = {left:30}, style = {}, showScroll = false, pageSize = 24, metricData, averageType }) => {
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

  // Paging metadata: item count, number of pages, page number, page size, etc
  // TODO: how to calculate this with multiple parameters?
  const itemsCount = metricData?.length;
  const numPages = Math.ceil(itemsCount / pageSize);
  const pageStart = useMemo(() => pageSize * (page), [page, pageSize]);
  const pageEnd = useMemo(() => pageSize * (page + 1), [page, pageSize]);

  // Filter the data and build a bar graph from it
  const filteredData = useMemo(() => metricData?.slice(pageStart, pageEnd)?.reverse(), [metricData, pageStart, pageEnd]);
  const chartSettings = {
    dataset: filteredData,
    height: 175,

    // Data to graph: Mean PM2.5 Values
    series: [
      {
        dataKey: selectedParameter,
        valueFormatter: (v) => {
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
      }
   ],

    // Y-Axis: Mean PM2.5 values
    yAxis: [{
      disableLine: true, // Hides the main vertical line
      disableTicks: true,
      width: 60,
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
            return undefined
          }
        }),
        colors: pm2_5Ranges?.map(r => r.color),
      },
    }],

    // X-Axis: Date
    xAxis: [{
      disableLine: true, // Hides the main vertical line
      disableTicks: true,
      scaleType: 'band',
      dataKey: 'date',
      barGapRatio: 3,
      tickPlacement: 'middle',
      valueFormatter: (v, context) => {
        // no-op for weekly / seasonal averages (e.g. 2026-W01, 2026-S1, etc)
        if (averageType === 'hour' || averageType === 'day') {
          const {date, time} = formatDate({
            timestamp: v,
            format: 'long',
            year: context.location !== 'tick'
          });
          if (averageType === 'hour') {
            return context.location === 'tick' ? time : `${date} ${time}`;
          } else {
            return context.location === 'tick' ? date : date;
          }
        } else if (averageType === 'week') {
          const segments = v?.split('-W');
          const year = segments[0];
          const weekNum = segments[1];
          return context.location === 'tick' ? `W${weekNum}` : `${year} Week ${weekNum.toString()}`;
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

  return (
    <>
      <Grid container spacing={0} alignItems={'center'}>
        {showScroll && <Grid size={1}>
          {(page + 1) < numPages && <LButton style={{ fontSize: '28px', width: '36px', height: '36px', zIndex: 20 }} onClick={scrollForward}>
            <FaChevronCircleLeft style={{ ...style, border: '2px solid white', borderRadius: '100px', backgroundColor: 'white', color: 'rgba(0, 88, 153, 1)' }} />
          </LButton>}
        </Grid>}

        {filteredData.length > 0 && <Grid size={showScroll ? 10 : 12}>
          <BarChart {...chartSettings} margin={margin} />
        </Grid>}

        {showScroll && <Grid size={1}>
          {page > 0 && <LButton style={{ fontSize: '28px', right: '2rem', width: '36px', height: '36px' }} onClick={scrollBack}>
            <FaChevronCircleRight style={{ ...style, border: '2px solid white', borderRadius: '100px', backgroundColor: 'white', color: 'rgba(0, 88, 153, 1)' }} />
          </LButton>}
        </Grid>}
      </Grid>
    </>
  );
}
