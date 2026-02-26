import { asyncBufferFromUrl, parquetReadObjects } from 'hyparquet';
import {useEffect, useMemo, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSensorLocations, setSensorValuesMeanPm25, selectSensorValuesMeanPm25, selectSensorLocations,
  setSensorGeojsonData
} from '../../store/slices/sensorDataSlice';

// Cache values as they are read
/*const SensorDataStore = ({  }) => {
  const [yearly, setYearly] = useState(null);
  const [seasonal, setSeasonal] = useState(null);
  const [month, setMonth] = useState(null);
  const [week, setWeek] = useState(null);
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);
}*/

// Given a URL to a Parquet file, read it into memory
// There will always be at least 2 of these - one for locations.parquet and one for each metric displayed (e.g. mean_pm25)
const ParquetReaderComponent = ({ DEBUG }) => {
  const dispatch = useDispatch();
  const locations = useSelector(selectSensorLocations);
  const mean_pm25 = useSelector(selectSensorValuesMeanPm25);

  const [firstRows, setFirstRow] = useState({ year: 0, season: 0, month: 0, week: 0, day: 0, hour: 0 });

  const sensorIds = useMemo(() => [...new Set(locations?.filter(l => l?.currentSourceId)?.map(l => l.datasourceId))], [locations]);

  const s3endpoint = process.env.REACT_APP_S3_ENDPOINT_URL;
  const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;

  // MINIO => host="http://localhost:9000" bucket_name="chicago-aq"
  // AWS S3 => host="s3.us-east-2.amazonaws.com" bucket_name="chicago-aq"
  const meanPm25Url = `${s3endpoint}/${bucketName}/current/mean_pm25.parquet`;
  const locationsUrl = `${s3endpoint}/${bucketName}/current/locations.parquet`;

  const fetch = async ({ url, columns, rowStart, rowEnd, predicate = undefined }) => {
    // Fetch the list of location id, name, coordinates
    return await parquetReadObjects({
      file: await asyncBufferFromUrl({
        url
      }),
      columns,
      rowStart,
      rowEnd,
    });
  };

  useEffect(() => {// TODO: Support multiple metrics?
    const startTime = new Date().getTime();
    // Fetch the metric data (currently just mean_pm25) using our list of locations
    fetch({
      url: meanPm25Url,
      columns: ['type','date'],
      rowStart: 0,
      rowEnd: 500
    }).then(d => {
      setFirstRow({
        year: d.findIndex(r => r.type === 'year'),
        season: d.findIndex(r => r.type === 'season'),
        month: d.findIndex(r => r.type === 'month'),
        week: d.findIndex(r => r.type === 'week'),
        day: d.findIndex(r => r.type === 'day'),
        hour: d.findIndex(r => r.type === 'hour'),
      });
      dispatch(setSensorValuesMeanPm25(d));
      const endTime = new Date().getTime();
      console.log(`Finished locating first rows: ${endTime - startTime}ms`);
    });
  }, [dispatch, meanPm25Url]);

  useEffect(() => {
    const startTime = new Date().getTime();
    // Fetch the list of location id, name, coordinates
    fetch({
      url: locationsUrl,
      columns: ['datasourceId', 'sourceId', 'currentSourceId', 'locationLatitude', 'locationLongitude', 'name', 'community', 'zip' /*'group', 'tags',*/ ],
    }).then(l => {
      dispatch(setSensorLocations(l));
      const endTime = new Date().getTime();
      console.log(`Finished fetching sensor locations: ${endTime - startTime}ms`);
    });
  }, [dispatch, locationsUrl]);

  useEffect(() => {
    const startTime = new Date().getTime();
    // TODO: Support multiple metrics?
    // Fetch the metric data (currently just mean_pm25) using our list of locations
    fetch({
      url: meanPm25Url,
      columns: ['type','date', ...sensorIds],
      rowStart: firstRows.hour,
      rowEnd: firstRows.hour+1,
    }).then(d => {
      dispatch(setSensorValuesMeanPm25(d));
      const endTime = new Date().getTime();
      console.log(`Finished fetching sensor mean_pm25: ${endTime - startTime}ms`);
    });
  }, [dispatch, meanPm25Url, locations, sensorIds, firstRows.hour]);

  useEffect(() => {
    // Skip rendering if we don't have enough data
    if (locations?.length === 0 || mean_pm25?.length === 0) { return; }
    const startTime = new Date().getTime();
    //const geojsonUrl = "https://chicago-aq.s3.us-east-2.amazonaws.com/latest.geojson"
    const sortedHourlyRows = mean_pm25.filter(r => r.period === 'hour' || r.type === 'hour')
      .sort((a, b) => a.date.localeCompare(b.date))
      .reverse();
    const latestHourlyRow = sortedHourlyRows.find(() => true);
    const previousHourlyRow = sortedHourlyRows.slice(1).find(() => true);
    const geojsonData = {
      type: 'FeatureCollection',
      features: sensorIds.map((datasourceId) => {
        const location = locations.find(r => r.datasourceId === datasourceId);
        const metric_pm25 = mean_pm25.map((r) => ({
          period: r.period || r.type,
          date: r.date,
          [datasourceId]: r[datasourceId]
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
            last_update: latestHourlyRow?.[datasourceId] ? latestHourlyRow?.['date'] : previousHourlyRow?.['date'],
            latest_mean_pm25: latestHourlyRow?.[datasourceId] || previousHourlyRow?.[datasourceId],
            mean_pm25: metric_pm25
          },
        }
      }),
    };
    dispatch(setSensorGeojsonData(geojsonData));

    const endTime = new Date().getTime();
    console.log(`Finished building GeoJSON: ${endTime - startTime}ms`);
  }, [dispatch, locations, mean_pm25, sensorIds]);

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
