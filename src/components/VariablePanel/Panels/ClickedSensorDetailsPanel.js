import {useDispatch, useSelector} from "react-redux";
import {
  selectAverageType,
  selectClickedSensor, selectMetricData,
  selectMetrics, selectSensorGeojsonData, selectSensorLocations, selectSensorParameter,
  setAverageType, setSensorParameter
} from "../../../store/slices/sensorDataSlice";
import {Divider, getLocation, getMetadata, LButton, LHeader, LinkText} from "../common";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {LastUpdatedDisplay} from "../LastUpdatedDisplay";
import {FaChartLine} from "react-icons/fa";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {SensorBarChart} from "../SensorBarChart";
import {useState} from "react";
import Menu from "@mui/material/Menu";

const s3endpoint = process.env.REACT_APP_S3_ENDPOINT_URL;
const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;

const downloadFile = (fileContents, filename) => {
  // Create a Blob w/ a temporary URL from JSON string
  const blob = new Blob([fileContents], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create an invisible anchor element and click it to trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link); // Required for some browsers
  link.click();

  // Cleanup: remove the link and revoke the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const convertGeoJsonToCsv = (geojsonData, separator= ',') => {
  // Build up our CSV rows as text, starting with the headers
  const csvHeaders = ['datasourceId', 'locationLongitude', 'locationLatitude', 'period', 'date', 'mean_pm25'];
  let csvString = csvHeaders.join(separator) + '\n';
  geojsonData?.features?.forEach(f => {
    const { datasourceId, mean_pm25, locationLongitude, locationLatitude } = f.properties;
    mean_pm25.forEach((reading) => {
      const { type, date, value, mean_pm25 } = reading;
      csvString += [datasourceId, locationLongitude, locationLatitude, type, date, value || mean_pm25 || reading[datasourceId]].join(separator) + '\n';
    });
  });
  return csvString;
}

export const ClickedSensorDetailsPanel = ({ push, pop }) => {
  const dispatch = useDispatch();

  const averageType = useSelector(selectAverageType);
  const clickedSensor = useSelector(selectClickedSensor);
  const sensorGeojson = useSelector(selectSensorGeojsonData);

  const locations = useSelector(selectSensorLocations);
  const selectedParameter = useSelector(selectSensorParameter);
  const metricData = useSelector(selectMetricData);
  const geojsonData = useSelector(selectSensorGeojsonData);
  const metrics = useSelector(selectMetrics);

  const setSelectedParameter = (payload) => dispatch(setSensorParameter(payload));

  // Grab our previously-fetched data and use that to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const clickedLocation = getLocation(locations, clickedSensor);
  const {latestRow} = getMetadata({
    parameter: selectedParameter,
    datasourceId: clickedSensor,
    geojsonData
  });

  const downloadGeoJson = (geojsonData = sensorGeojson, filename = 'chicago_mean_pm25.geojson') => {
    downloadFile(JSON.stringify(geojsonData, null, 2), filename);
  };

  const downloadCsv = (geojsonData = sensorGeojson, separator= ',', filename = 'chicago_mean_pm25.csv') => {
    downloadFile(convertGeoJsonToCsv(geojsonData), filename);
  };

  // MINIO => host="http://localhost:9000" bucket_name="chicago-aq"
  // AWS S3 => host="s3.us-east-2.amazonaws.com" bucket_name="chicago-aq"
  const downloadParquet = () => {
    window.open(`${s3endpoint}/${bucketName}/current/${selectedParameter}.parquet.brotli`, '_blank');
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const latestAqi = metrics?.['nowcast_aqi']?.data?.find(r => r[clickedSensor] > 0)?.[clickedSensor];
  const latestPm25 = Number(metrics?.['mean_pm25']?.data?.find(r => r[clickedSensor] > 0)?.[clickedSensor]).toFixed(1);
  return(
    <Grid size={11}>
      <LHeader><LinkText onClick={() => pop('root')}>{clickedLocation?.name}</LinkText> / Details</LHeader>

      <Grid container spacing={2} marginTop={'1.5rem'}>
        <Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={`AQI : ${latestAqi ? latestAqi + ' AQI' : '??'}`} disabled />
        </Grid>
        <Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={`PM 2.5 : ${latestPm25 ? latestPm25 + ' μg/m³' : '??'}`} disabled />
        </Grid>
      </Grid>
      {/*<Grid container spacing={2} marginTop={'1rem'}>
        <Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'NO₂ : ??'} disabled />
        </Grid>
        <Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'BC : ??'} disabled />
        </Grid>
      </Grid>*/}
      <Grid container spacing={2} justifyContent={'space-between'} alignItems={'center'}>
        <LastUpdatedDisplay datasourceId={clickedSensor}></LastUpdatedDisplay>
        <LButton onClick={() => push(['Explain'])}>Explain &rarr;</LButton>
      </Grid>

      <Divider />

      <Grid container spacing={2} margin={'1rem 0'} justifyContent={'space-between'} alignItems={'center'}>
        <div style={{ display: 'flex' }}>
          <FaChartLine style={{ width: '28px', height: '28px', color: 'rgba(65, 182, 230, 1)' }} />
          <LHeader style={{ marginLeft: '0.5rem', fontSize: '18px' }}>Historical Trends</LHeader>
        </div>
        <LButton onClick={handleClick}>Download &rarr;</LButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'basic-button',
            },
          }}
        >
          <MenuItem onClick={() => {downloadCsv();handleClose();}}>CSV</MenuItem>
          <MenuItem onClick={() => {downloadGeoJson();handleClose();}}>GeoJSON</MenuItem>
          <MenuItem onClick={() => {downloadParquet();handleClose();}}>Parquet</MenuItem>
        </Menu>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={6}>
          <FormControl id="paramSelect" variant="outlined" fullWidth>
            <InputLabel htmlFor="paramSelect">Parameter</InputLabel>
            <Select
              variant={"filled"}
              value={selectedParameter}
              onChange={(e) => setSelectedParameter(e.target.value)}
            >
              <MenuItem value="mean_pm25">PM 2.5</MenuItem>
              <MenuItem value="nowcast_aqi">AQI</MenuItem>
              {/*<MenuItem value="mean_no2">NO₂</MenuItem>*/}
              {/*<MenuItem value="mean_bc">BC</MenuItem>*/}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl id="avgTypeSelect" variant="outlined" fullWidth>
            <InputLabel htmlFor="avgTypeSelect">View by</InputLabel>
            <Select
              variant={"filled"}
              value={averageType}
              onChange={(e) => dispatch(setAverageType(e.target.value))}
            >
              <MenuItem value="hour">Hour</MenuItem>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="season">Season</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <Grid offset={2} size={10}>
          {!latestRow && <Grid>No recent readings found.</Grid> }
        </Grid>
      </Grid>

      <SensorBarChart margin={{ left: 60 }}
                      showScroll={true}
                      averageType={averageType}
                      selectedParameter={selectedParameter}
                      metricData={metricData?.filter(d => d.type === averageType)?.map(r =>
                        ({ type: r.type, date: r.date, [selectedParameter]: r[clickedSensor] })
                      )} />
    </Grid>
  );
};
