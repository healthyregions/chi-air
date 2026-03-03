import {useDispatch, useSelector} from "react-redux";
import {
  selectAverageType,
  selectClickedSensor, selectSensorGeojsonData, selectSensorLocations,
  selectSensorValuesMeanPm25, setAverageType
} from "../../../store/slices/sensorDataSlice";
import {Divider, getMetadata, LButton, LHeader, LinkText} from "../common";
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


export const ClickedSensorDetailsPanel = ({ push, pop }) => {
  const dispatch = useDispatch();
  const [, setSelectedParameter] = useState(null);
  const averageType = useSelector(selectAverageType);
  const clickedSensor = useSelector(selectClickedSensor);

  const locations = useSelector(selectSensorLocations);
  const mean_pm25 = useSelector(selectSensorValuesMeanPm25);
  const geojsonData = useSelector(selectSensorGeojsonData);

  // Grab our previously-fetched data and use that to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const {clickedLocation, latest, firstHourlyRow, recentValueCount} = getMetadata(clickedSensor, locations, geojsonData, mean_pm25);

  return(
    <Grid size={11}>
      <LHeader><LinkText onClick={() => pop('root')}>{clickedLocation?.name}</LinkText> / Details</LHeader>

      <Grid container spacing={2} marginTop={'1.5rem'}>
        <Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'AQI : ??'} disabled />
        </Grid>
        <Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'PM 2.5 : ' + latest?.latest_mean_pm25} disabled />
        </Grid>
      </Grid>
      <Grid container spacing={2} marginTop={'1rem'}>
        <Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'NO₂ : ??'} disabled />
        </Grid>
        <Grid size={6}>
          <TextField slotProps={{ input: { style: { textAlign: 'center' } } }} variant="outlined" value={'BC : ??'} disabled />
        </Grid>
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
        <LButton onClick={() => {
          const s3endpoint = process.env.REACT_APP_S3_ENDPOINT_URL;
          const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;

          // MINIO => host="http://localhost:9000" bucket_name="chicago-aq"
          // AWS S3 => host="s3.us-east-2.amazonaws.com" bucket_name="chicago-aq"
          const meanPm25Url = `${s3endpoint}/${bucketName}/current/mean_pm25.parquet`;
          //const locationsUrl = `${s3endpoint}/${bucketName}/current/locations.parquet`;
          window.open(meanPm25Url, '_blank');
          //window.open(locationsUrl, '_blank');

          // TODO: transfer to CSV before download?
        }}>Download &rarr;</LButton>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={6}>
          <FormControl id="paramSelect" variant="outlined" fullWidth>
            <InputLabel htmlFor="paramSelect">Parameter</InputLabel>
            <Select
              variant={"filled"}
              value={'mean_pm25'}
              onChange={(e) => setSelectedParameter(e.target.value)}
            >
              <MenuItem value="mean_pm25">PM 2.5</MenuItem>
              <MenuItem value="mean_aqi">AQI</MenuItem>
              <MenuItem value="mean_no2">NO₂</MenuItem>
              <MenuItem value="mean_bc">BC</MenuItem>
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
          {firstHourlyRow && Object.keys(firstHourlyRow)?.length <= 2 && <>Loading, Please Wait...</>}
          {firstHourlyRow && Object.keys(firstHourlyRow)?.length > 2 && recentValueCount === 0 && <Grid>No recent readings found.</Grid> }
        </Grid>
      </Grid>

      {recentValueCount > 0 && <>
        <SensorBarChart margin={{ left: 60 }}
                        showScroll={true}
                        averageType={averageType}
                        selectedParameter={'mean_pm25'}
                        mean_pm25={mean_pm25?.filter(d => d.type === averageType)?.map(r =>
                          ({ type: r.type, date: r.date, mean_pm25: r[clickedSensor] })
                        )} />
      </>}
    </Grid>
  );
};
