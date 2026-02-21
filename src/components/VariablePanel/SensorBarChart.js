import {BarChart} from "@mui/x-charts/BarChart";
import {pm2_5Ranges} from "../../config";
import Grid from "@mui/material/Grid";
import {FaChevronCircleLeft} from "@react-icons/all-files/fa/FaChevronCircleLeft";
import styled from "styled-components";
import {Button} from "@mui/material";
import {FaChevronCircleRight} from "@react-icons/all-files/fa/FaChevronCircleRight";
import {useState} from "react";

const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: none;
    color: #005899;
`;

export const SensorBarChart = ({ dataset, datasourceId, averageType }) => {
  const pageSize = 24;
  const [page, setPage] = useState(0);

  const chartSettings = {
    dataset: dataset?.slice(dataset?.length - (pageSize*(page + 1)), dataset?.length - pageSize*(page)),
    yAxis: [{
      disableLine: true, // Hides the main vertical line
      label: 'PM2.5 Mass Concentration (μg/m³)',
      width: 60,
      min: 0,
      max: 300,
      colorMap: {
        type: 'piecewise',
        thresholds: pm2_5Ranges?.map(r => r.max),
        colors: pm2_5Ranges?.map(r => r.color),
      },
    }],
    xAxis: [{ scaleType: 'band', dataKey: 'date', barGapRatio: 3, tickPlacement:'middle', zoom: true, valueFormatter: (v) => {
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
        const date = `${parts.find(p => p.type === 'month').value}/${parts.find(p => p.type === 'day').value}/${parts.find(p => p.type === 'year').value}`;

        return averageType === 'hour' ? `${date} ${time}` : date;
      } }],
    series: [{ dataKey: datasourceId, valueFormatter: (v) => `${Number(v)?.toFixed(1)} μg/m³` }], // Minimum width of 10px
    height: 175,
    margin: { left: 0, top: 5 },
  };

  const scrollBack = () => {
    console.log('backward');
    setPage(page+1);
  }
  const scrollForward = () => {
    console.log('forward');
    page && setPage(page-1);
  }

  //console.log(dataset);
  return (
    <>
      <Grid container spacing={0}>
        <LButton style={{ position: 'absolute', left: '-2rem', fontSize: '28px',  width: '36px', height: '36px' }}
                 onClick={scrollBack}>
          <FaChevronCircleLeft style={{ border: '2px solid white', borderRadius: '100px', backgroundColor: 'white',color: 'rgba(0, 88, 153, 1)' }} />
        </LButton>

        <BarChart {...chartSettings}  />


        {!!page && <LButton style={{ position: 'absolute', right: '-2rem', fontSize: '28px', width: '36px', height: '36px' }}
                 onClick={scrollForward}>
          <FaChevronCircleRight style={{ border: '2px solid white', borderRadius: '100px', backgroundColor: 'white',color: 'rgba(0, 88, 153, 1)' }} />
        </LButton>}
      </Grid>
      <pre>{JSON.stringify(page, null ,2)}</pre>
    </>
  );
}
