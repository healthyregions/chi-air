import { asyncBufferFromUrl, parquetReadObjects } from 'hyparquet';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSensorLocations, setSensorValuesMeanPm25, selectSensorValuesMeanPm25, selectSensorLocations } from '../../store/slices/sensorDataSlice';

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
  const data = useSelector(selectSensorValuesMeanPm25);

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

  useEffect(() => {
    // Fetch the list of location id, name, coordinates
    fetch({
      url: locationsUrl,
      columns: ['datasourceId', 'sourceId', 'locationLatitude', 'locationLongitude', 'name', 'group', 'tags', 'community', 'zip'],
    }).then(l => dispatch(setSensorLocations(l)) && console.log('Locations:', l));
  }, [dispatch, locationsUrl]);

  useEffect(() => {
    // TODO: Support multiple metrics?
    // Fetch the metric data (currently just mean_pm25) using our list of locations
    fetch({
      url: meanPm25Url,
      columns: ['type','date', ...new Set(locations.map(d => d.datasourceId))],
      rowStart: 0,
      rowEnd: 100
    }).then(d => dispatch(setSensorValuesMeanPm25(d)) && console.log('Data:', d));
  }, [dispatch, meanPm25Url, locations]);

  if (!data) return <>Loading...</>;

  return (
    DEBUG ? <>
      <h3>Parquet Data:</h3>
      <ul>
        {data.map((record, index) => (
          <li key={index}>{/* Render your data here, e.g., record.columnName */}</li>
        ))}
      </ul>
    </> : <></>
  );
};

export default ParquetReaderComponent;
