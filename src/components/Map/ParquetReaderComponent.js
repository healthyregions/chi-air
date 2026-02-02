import { asyncBufferFromUrl, parquetReadObjects, parquetMetadataAsync, parquetSchema } from 'hyparquet';
import { useEffect, useState } from 'react';

// Cache values as they are read
const SensorDataStore = ({  }) => {
  const [yearly, setYearly] = useState(null);
  const [seasonal, setSeasonal] = useState(null);
  const [month, setMonth] = useState(null);
  const [week, setWeek] = useState(null);
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);

}

// Given a URL to a Parquet file, read it into memory
// There will always be at least 2 of these - one for locations.parquet and one for each metric displayed (e.g. mean_pm25)
const ParquetReaderComponent = ({ }) => {
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState([]);

  const meanPm25Url = 'http://localhost:9000/chicago-aq/current/mean_pm25.parquet';
  const locationsUrl = 'http://localhost:9000/chicago-aq/current/locations.parquet';

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

  //setData(fetchData());
  useEffect(() => {
    (async () => {
      setMetadata(await parquetMetadataAsync(
        await asyncBufferFromUrl({
          url: meanPm25Url
        }))
      );
    })();
  }, []);

  useEffect(() => {
    // Fetch the list of location id, name, coordinates
    fetch({
      url: locationsUrl,
      columns: ['datasourceId','sourceId', 'locationLatitude', 'locationLongitude', 'name', 'group', 'tags'],
    }).then(l => setLocations(l));
  }, [locationsUrl]);

  useEffect(() => {
    // TODO: Support multiple metrics?
    // Fetch the metric data (currently just mean_pm25) using our list of locations
    fetch({
      url: meanPm25Url,
      columns: ['type','date', ...new Set(locations.map(d => d.datasourceId))],
      rowStart: 0,
      rowEnd: 100
    }).then(d => setData(d));
  }, [meanPm25Url, locations]);

  console.log(`Metadata: `, metadata);
  console.log('Locations:', locations)
  console.log('Data:', data)

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h3>Parquet Data:</h3>
      <ul>
        {data.map((record, index) => (
          <li key={index}>{/* Render your data here, e.g., record.columnName */}</li>
        ))}
      </ul>
    </div>
  );
};

export default ParquetReaderComponent;
