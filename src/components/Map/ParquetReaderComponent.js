import { asyncBufferFromUrl, parquetReadObjects } from 'hyparquet';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSensorLocations,
  setSensorValuesMeanPm25,
  selectSensorValuesMeanPm25,
  selectSensorLocations,
  setSensorGeojsonData,
  setFirstRowIndices,
  selectFirstRowIndices,
} from '../../store/slices/sensorDataSlice';
import {compressors} from "hyparquet-compressors";

// TODO: Cache values as they are read?
/*const SensorDataStore = ({  }) => {
  const [yearly, setYearly] = useState(null);
  const [seasonal, setSeasonal] = useState(null);
  const [month, setMonth] = useState(null);
  const [week, setWeek] = useState(null);
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);
}*/

const s3endpoint = process.env.REACT_APP_S3_ENDPOINT_URL;
const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;

// MINIO => host="http://localhost:9000" bucket_name="chicago-aq"
// AWS S3 => host="s3.us-east-2.amazonaws.com" bucket_name="chicago-aq"
const meanPm25Url = `${s3endpoint}/${bucketName}/current/mean_pm25.parquet.brotli`;
const locationsUrl = `${s3endpoint}/${bucketName}/current/locations.parquet.brotli`;

const maxRetries = 5;

// Given a URL to a Parquet file, read it into memory
// There will always be at least 2 of these - one for locations.parquet and one for each metric displayed (e.g. mean_pm25)
const ParquetReaderComponent = ({ DEBUG }) => {
  const dispatch = useDispatch();
  const locations = useSelector(selectSensorLocations);
  const mean_pm25 = useSelector(selectSensorValuesMeanPm25);
  const firstRowIndices = useSelector(selectFirstRowIndices);

  const fetchPq = async ({ url, columns, rowStart, rowEnd }) => {
    let retries = 0;
    // Fetch the list of location id, name, coordinates
    while (retries < maxRetries) {
      try {
        return await parquetReadObjects({
          file: await asyncBufferFromUrl({url}),
          columns,
          rowStart,
          rowEnd,
          compressors
        });
      } catch (e) {
        console.warn(`Warning: Failed fetching (${retries}/${maxRetries}) from ${url}. Retrying...`, e);
        retries = retries+1;
      }
    }

    console.error(`ERROR: Failed to fetch Parquet dataset from ${url} after ${maxRetries} retries.`);
  };

  // TODO: pipeline could produce these indices to save us another ~500ms
  // TODO: Support multiple metrics?
  useEffect(() => {
    const startTime = new Date().getTime();
    console.log(`Finding first indices...`);
    // Fetch the metric data (currently just mean_pm25) using our list of locations
    fetchPq({
      url: meanPm25Url,
      columns: ['type','date'],
      rowStart: 0,
      rowEnd: 100
    }).then(d => {
      dispatch(setFirstRowIndices({
        year: d?.findIndex(r => r.type === 'year'),
        season: d?.findIndex(r => r.type === 'season'),
        month: d?.findIndex(r => r.type === 'month'),
        week: d?.findIndex(r => r.type === 'week'),
        day: d?.findIndex(r => r.type === 'day'),
        hour: d?.findIndex(r => r.type === 'hour'),
      }));
      const endTime = new Date().getTime();
      console.log(`Finished locating first rows: ${endTime - startTime}ms`);
    });
  }, [dispatch]);

  useEffect(() => {
    const startTime = new Date().getTime();
    // Fetch the list of location id, name, coordinates
    fetchPq({
      url: locationsUrl,
    }).then(l => {
      dispatch(setSensorLocations(l?.filter(loc => loc?.currentSourceId)));
      const endTime = new Date().getTime();
      console.log(`Finished fetching sensor locations: ${endTime - startTime}ms`);
    });
  }, [dispatch]);

  useEffect(() => {
    // Skip fetching if we don't have enough data
    if (locations?.length === 0 || firstRowIndices.hour < 0) { return; }
    const startIndex = firstRowIndices.hour;
    const endIndex = startIndex + 24;

    const startTime = new Date().getTime();
    // TODO: Support multiple metrics?
    // Fetch the metric data (currently just mean_pm25) using our list of locations
    const columns = [ 'type','date', ...new Set(locations?.map(l => l.datasourceId)) ];
    // Grab only this row to quickly color the map
    fetchPq({
      url: meanPm25Url,
      columns,
      rowStart: startIndex,
      rowEnd: endIndex,
    }).then(d => {
      dispatch(setSensorValuesMeanPm25(d));
      const endTime = new Date().getTime();
      console.log(`Finished fetching latest sensor mean_pm25: ${endTime - startTime}ms`);

      // Next, fill in with 24 hours of graph data
      fetchPq({
        url: meanPm25Url,
        columns,
        rowStart: firstRowIndices.hour,
        rowEnd: firstRowIndices.hour+24,
      }).then(d => {
        dispatch(setSensorValuesMeanPm25(d));
        const endTime = new Date().getTime();
        console.log(`Finished fetching last 24-hours mean_pm25: ${endTime - startTime}ms`);

        // fill in with historical data
        fetchPq({
          url: meanPm25Url,
          columns
        }).then(d => {
          dispatch(setSensorValuesMeanPm25(d));
          const endTime = new Date().getTime();
          console.log(`Finished fetching historical mean_pm25: ${endTime - startTime}ms`);
        });
      });
    });
  }, [dispatch, locations, firstRowIndices]);

  useEffect(() => {
    if (locations?.length === 0) { return; }
    // Skip rendering if we don't have enough data
    const startTime = new Date().getTime();
    //const geojsonUrl = "https://chicago-aq.s3.us-east-2.amazonaws.com/latest.geojson"
    const sortedHourlyRows = mean_pm25?.filter(r => r?.type === 'hour');
      //.sort((a, b) => a.date.localeCompare(b.date))
      //.reverse();
    const latestHourlyRow = sortedHourlyRows?.find(() => true);
    const previousHourlyRow = sortedHourlyRows?.slice(1)?.find(() => true);
    const geojsonData = {
      type: 'FeatureCollection',
      features: locations?.filter(l => !!l?.currentSourceId && !!l?.datasourceId)?.map((location) => {
        const metric_pm25 = mean_pm25?.map((r) => ({
          type: r.type,
          date: r.date,
          [location.datasourceId]: r[location.datasourceId]
        }));

        return {
          type: 'Feature',
          geometry: {
            type: "Point",
            coordinates: [
              location.locationLongitude,
              location.locationLatitude
            ],
          },
          // Ensure this is valid GeoJSON format
          properties: {
            ...location,
            last_update: latestHourlyRow?.[location.datasourceId] ? latestHourlyRow?.['date'] : previousHourlyRow?.['date'],
            latest_mean_pm25: latestHourlyRow?.[location.datasourceId] || previousHourlyRow?.[location.datasourceId],
            mean_pm25: metric_pm25
          },
        }
      }) || [],
    };
    dispatch(setSensorGeojsonData(geojsonData));

    const endTime = new Date().getTime();
    console.log(`Finished building GeoJSON: ${endTime - startTime}ms`);
  }, [dispatch, locations, mean_pm25]);

  if (!mean_pm25) return <>Loading...</>;

  return (
    DEBUG ? <>
      <h3>Parquet Data:</h3>
      <ul>
        {mean_pm25.map((record, index) => (
          <li key={index}>{/* Render your data here, e.g., record.columnName */}</li>
        ))}
      </ul>
    </> : <></>
  );
};

export default ParquetReaderComponent;
