import {useDispatch, useSelector} from "react-redux";
import {
  selectAverageType,
  selectClickedSensor, selectMetricData, selectMetricIndex,
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
import {ListSubheader} from "@mui/material";

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

const convertGeoJsonToCsv = (geojsonData, selectedParameter, separator= ',') => {
  // Build up our CSV rows as text, starting with the headers
  const csvHeaders = ['datasourceId', 'locationLongitude', 'locationLatitude', 'period', 'date', selectedParameter];
  let csvString = csvHeaders.join(separator) + '\n';
  geojsonData?.features?.forEach(f => {
    const { datasourceId, metrics, locationLongitude, locationLatitude } = f.properties;
    metrics[selectedParameter]?.data?.forEach((reading) => {
      const { type, date, value } = reading;
      csvString += [datasourceId, locationLongitude, locationLatitude, type, date, value || reading[datasourceId]].join(separator) + '\n';
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
  const metricIndex = useSelector(selectMetricIndex);

  const setSelectedParameter = (payload) => dispatch(setSensorParameter(payload));

  // Grab our previously-fetched data and use that to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const clickedLocation = getLocation(locations, clickedSensor);
  const {latestRow} = getMetadata({
    parameter: selectedParameter,
    datasourceId: clickedSensor,
    geojsonData
  });

  const downloadGeoJson = (geojsonData = sensorGeojson, filename = `chicago_${selectedParameter}.geojson`) => {
    downloadFile(JSON.stringify(geojsonData, null, 2), filename);
  };

  const downloadCsv = (geojsonData = sensorGeojson, separator= ',', filename = `chicago_${selectedParameter}.csv`) => {
    downloadFile(convertGeoJsonToCsv(geojsonData, selectedParameter), filename);
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

  const latestAqi = metrics?.['nowcast_aqi']?.data?.[0]?.[clickedSensor];
  const prevAqi = metrics?.['nowcast_aqi']?.data?.[1]?.[clickedSensor];
  const latestPm25 = metrics?.['clarity_pm25']?.data?.[0]?.[clickedSensor];
  const prevPm25 = metrics?.['clarity_pm25']?.data?.[1]?.[clickedSensor];
  const latestNo2 = metrics?.['clarity_no2']?.data?.[0]?.[clickedSensor];
  const prevNo2 = metrics?.['clarity_no2']?.data?.[1]?.[clickedSensor];

  const displayedAqi = latestAqi || prevAqi;
  const displayedPm25 = latestPm25 || prevPm25;
  const displayedNo2 = latestNo2 || prevNo2;

  return(
    <Grid size={11}>
      <LHeader><LinkText onClick={() => pop('root')}>{clickedLocation?.name}</LinkText> / Details</LHeader>

      <Grid container spacing={2} marginTop={'1.5rem'}>
        <Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={`AQI-PM2.5 : ${displayedAqi ? Number(displayedAqi).toFixed(0) + ' AQI' : '??'}`} disabled />
        </Grid>
        <Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={`PM2.5 : ${displayedPm25 ? Number(displayedPm25).toFixed(1) + ' μg/m³' : '??'}`} disabled />
        </Grid>
      </Grid>
      <Grid container spacing={2} marginTop={'1rem'}>
        <Grid size={12}>
          <TextField fullWidth slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={`NO₂ : ${displayedNo2 ? Number(displayedNo2).toFixed(1) : '??'} ppb`} disabled />
        </Grid>
        {/*<Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'BC : ??'} disabled />
        </Grid>*/}
      </Grid>
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
          <ListSubheader>Downloads all data from current session</ListSubheader>
          <MenuItem onClick={() => {downloadCsv();handleClose();}}>CSV</MenuItem>
          <MenuItem onClick={() => {downloadGeoJson();handleClose();}}>GeoJSON</MenuItem>
          <ListSubheader>Downloads all data for current indicator</ListSubheader>
          <MenuItem onClick={() => {downloadParquet();handleClose();}}>Parquet</MenuItem>
        </Menu>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={6}>
          <FormControl id="paramSelect" variant="outlined" fullWidth>
            <InputLabel htmlFor="paramSelect">Indicator</InputLabel>
            <Select
              variant={"filled"}
              value={selectedParameter}
              onChange={(e) => setSelectedParameter(e.target.value)}
            >
              <MenuItem value="nowcast_aqi">AQI-PM2.5</MenuItem>
              <MenuItem value="clarity_pm25">PM2.5</MenuItem>
              <MenuItem value="clarity_no2">NO₂</MenuItem>
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
              <MenuItem value="day" disabled={metricIndex.day <= 0}>Day</MenuItem>
              <MenuItem value="week" disabled={metricIndex.week <= 0}>Week</MenuItem>
              <MenuItem value="month" disabled={metricIndex.month <= 0} title={'hello world'}>Month</MenuItem>
              <MenuItem value="season" disabled={metricIndex.season <= 0}>Season</MenuItem>
              <MenuItem value="year" disabled={metricIndex.year <= 0}>Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <Grid offset={2} size={10}>
          {!latestRow && <Grid>No recent readings found.</Grid> }
        </Grid>
      </Grid>

      <SensorBarChart margin={{ top: 40, left: 40, right: 40 }}
                      pageSize={10}
                      showScroll={true}
                      context={'historical'}
                      averageType={averageType}
                      selectedParameter={selectedParameter}
                      metricData={metricData?.filter(d => d.type === averageType)?.map(r =>
                        ({ type: r.type, date: r.date, [selectedParameter]: r[clickedSensor] })
                      )} />
    </Grid>
  );
};
