import {BarChart} from "@mui/x-charts/BarChart";
import {pm2_5Ranges} from "../../config";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import {Button} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import {FaChevronCircleLeft} from "@react-icons/all-files/fa/FaChevronCircleLeft";
import {FaChevronCircleRight} from "@react-icons/all-files/fa/FaChevronCircleRight";
import {formatDate} from "./common";

const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: none;
    color: #005899;
`;

export const SensorBarChart = ({ margin = {left:30}, style = {}, showScroll = false, pageSize = 24, mean_pm25, averageType }) => {
  const [page, setPage] = useState(0);

  // Listen for changes to averageType
  // Reset page number when averageType changes
  const prevType = useRef();
  useEffect(() => {
    if (prevType.current !== averageType) {
      prevType.current = averageType;
      setPage(0);
    }
  }, [averageType]);

  const pageStart = useMemo(() => pageSize * (page), [page, pageSize]);
  const pageEnd = useMemo(() => pageSize * (page + 1), [page, pageSize]);
  const filteredData = useMemo(() => mean_pm25?.slice(pageStart, pageEnd)?.reverse(), [mean_pm25, pageStart, pageEnd]);
  const chartSettings = {
    dataset: filteredData,
    height: 175,

    // Data to graph: Mean PM2.5 Values
    series: [{
      dataKey: 'mean_pm25',
      valueFormatter: (v) => `${Number(v)?.toFixed(1)} μg/m³`
    }],

    // Y-Axis: Mean PM2.5 values
    yAxis: [{
      disableLine: true, // Hides the main vertical line
      disableTicks: true,
      width: 60,
      colorMap: {
        type: 'piecewise',
        thresholds: pm2_5Ranges?.map(r => r.max),
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
      valueFormatter: (v) => {
        // no-op for weekly / seasonal averages (e.g. 2026-W01, 2026-S1, etc)
        if (averageType === 'week' || averageType === 'season') {
          return v;
        }
        const {date, time} = formatDate({
          timestamp: v,
          format: 'short',
          year: false
        });
        return averageType === 'hour' ? `${date} ${time}` : date;
      }
    }],
  };

  // TODO: how to calculate this with multiple parameters?
  const itemsCount = mean_pm25?.length;
  const numPages = Math.ceil(itemsCount / pageSize);
  const scrollBack = () => page > 0 && setPage(page - 1);
  const scrollForward = () => page < (numPages - 1) && setPage(page + 1);

  return (
    <>
      <Grid container spacing={0} alignItems={'center'}>
        {showScroll && <Grid size={1}>
          {(page + 1) < numPages && <LButton style={{ fontSize: '28px', width: '36px', height: '36px', zIndex: 20 }} onClick={scrollForward}>
            <FaChevronCircleLeft style={{ ...style, border: '2px solid white', borderRadius: '100px', backgroundColor: 'white', color: 'rgba(0, 88, 153, 1)' }} />
          </LButton>}
        </Grid>}

        <Grid size={showScroll ? 10 : 12}>
          <BarChart {...chartSettings} margin={margin} />
        </Grid>

        {showScroll && <Grid size={1}>
          {page > 0 && <LButton style={{ fontSize: '28px', right: '2rem', width: '36px', height: '36px' }} onClick={scrollBack}>
            <FaChevronCircleRight style={{ ...style, border: '2px solid white', borderRadius: '100px', backgroundColor: 'white', color: 'rgba(0, 88, 153, 1)' }} />
          </LButton>}
        </Grid>}
      </Grid>
    </>
  );
}
