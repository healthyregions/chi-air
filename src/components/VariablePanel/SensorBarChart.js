import {BarChart} from "@mui/x-charts/BarChart";
import {pm2_5Ranges} from "../../config";

export const SensorBarChart = ({ dataset, datasourceId, averageType }) => {
  const chartSettings = {
    dataset,
    yAxis: [{
      disableLine: true, // Hides the main vertical line
      label: 'PM2.5 Mass Concentration (μg/m³)',
      width: 60,
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

        return averageType === 'hour' ? time : date;
      } }],
    series: [{ dataKey: datasourceId, valueFormatter: (v) => `${Number(v)?.toFixed(1)} μg/m³` }], // Minimum width of 10px
    height: 175,
    margin: { left: 0, top: 5 },
  };

  //console.log(dataset);
  return (
    <div style={{ width: '100%' }}>
      <BarChart {...chartSettings}  />
    </div>
  );
}
