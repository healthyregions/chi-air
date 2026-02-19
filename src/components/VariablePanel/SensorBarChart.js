import {BarChart} from "@mui/x-charts/BarChart";
import {pm2_5Ranges} from "../../config";

export const SensorBarChart = ({ dataset, datasourceId, averageType }) => {
  const chartSetting = {
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
    series: [{ dataKey: datasourceId, valueFormatter: (v) => `${Number(v)?.toFixed(1)} μg/m³`, minBarSize: '20px', }], // Minimum width of 10px
    height: 200,
    margin: { left: 0 },
  };

  //console.log(dataset);
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        dataset={dataset}
        xAxis={[{ scaleType: 'band', dataKey: 'date' }]}

        {...chartSetting}
      />
    </div>
  );
}
