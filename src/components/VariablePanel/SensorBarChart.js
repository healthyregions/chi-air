import {BarChart} from "@mui/x-charts/BarChart";
import {pm2_5Ranges} from "../../config";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import {Button} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import {FaChevronCircleLeft} from "@react-icons/all-files/fa/FaChevronCircleLeft";
import {FaChevronCircleRight} from "@react-icons/all-files/fa/FaChevronCircleRight";

const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: none;
    color: #005899;
`;

const dateTimeFormatter = (v, averageType) => {
  if (averageType === 'week' || averageType === 'season') {
    return v;
  }
  const isoTimestamp = v.split(' ').join('T') + 'Z';
  const d = new Date(isoTimestamp);

  // Use 'en-US' to ensure the Month/Day/Year order
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  }).formatToParts(d);

  // Reconstruct to place the time before the date with a comma
  const time = `${parts.find(p => p.type === 'hour').value}${parts.find(p => p.type === 'dayPeriod').value}`;
  const date = `${parts.find(p => p.type === 'month').value}/${parts.find(p => p.type === 'day').value}`;  //  /${parts.find(p => p.type === 'year').value}`;

  return averageType === 'hour' ? `${date} ${time}` : date;
}

export const SensorBarChart = ({ DEBUG = false, reset = () => true, margin = {left:30}, style = {}, showScroll = false, pageSize = 24, dataset, datasourceId, averageType }) => {
  const [page, setPage] = useState(0);

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
  const filteredData = useMemo(() => dataset?.slice(pageStart, pageEnd)?.reverse(), [dataset, pageStart, pageEnd]);
  const chartSettings = {
    dataset: filteredData,

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
    xAxis: [{
      disableLine: true, // Hides the main vertical line
      disableTicks: true,
      scaleType: 'band',
      dataKey: 'date',
      barGapRatio: 3,
      tickPlacement: 'middle',
      valueFormatter: (v) => dateTimeFormatter(v, averageType)
    }],
    series: [{ dataKey: 'value', valueFormatter: (v) => `${Number(v)?.toFixed(1)} μg/m³` }],
    height: 175,
  };

  const itemsCount = dataset?.length;
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
