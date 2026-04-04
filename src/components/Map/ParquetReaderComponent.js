import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSensorLocations,
  selectSensorLocations,
  setSensorGeojsonData,
  selectSensorParameter,
  setMetricData,
  selectMetricData,
  selectMetricIndex,
  setMetricIndex, selectMetrics,
} from '../../store/slices/sensorDataSlice';
import {fetchPq} from "../VariablePanel/common";

// MINIO => host="http://localhost:9000" bucket_name="chicago-aq"
// AWS S3 => host="s3.us-east-2.amazonaws.com" bucket_name="chicago-aq"
const s3endpoint = process.env.REACT_APP_S3_ENDPOINT_URL;
const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;
const s3prefix = `${s3endpoint}/${bucketName}/current`;

const allMetrics = ['nowcast_aqi', 'mean_pm25'];

const ParquetReaderComponent = ({ DEBUG }) => {
  const dispatch = useDispatch();
  const locations = useSelector(selectSensorLocations);
  const selectedParameter = useSelector(selectSensorParameter);
  const metrics = useSelector(selectMetrics);
  const metricData = useSelector(selectMetricData);
  const firstRowIndices = useSelector(selectMetricIndex);

  // Awareness of current dataset
  // TODO: Only fetch new data if we don't already have it?
  // const mean_pm25 = metricData?.['mean_pm25']?.data;
  // const nowcast_aqi = metricData?.['nowcast_aqi']?.data;

  useEffect(() => {
    // Fetch index JSON file for each metric
    // This will tell us the first occurrence of each type (e.g. "hour", "day", etc)
    const startTime = new Date().getTime();
    allMetrics.forEach(metric_name => {
      fetch(`${s3prefix}/${metric_name}.index.json`)
        .then(async index_file_json => {
          dispatch(setMetricIndex({ parameter: metric_name, index: await index_file_json.json() }));
          const endTime = new Date().getTime();
          console.log(`Finished locating first rows for ${metric_name}: ${endTime - startTime}ms`);
        });
    });
  }, [dispatch]);

  useEffect(() => {
    // Fetch the list of location id, name, coordinates for all sensors
    const startTime = new Date().getTime();
    fetchPq({
      url: `${s3prefix}/locations.parquet.brotli`,
    }).then(l => {
      dispatch(
        setSensorLocations(
          l?.filter(loc => loc?.currentSourceId)
            ?.filter(loc => loc?.sourceType === 'CLARITY_NODE')
        )
      );
      const endTime = new Date().getTime();
      console.log(`Finished fetching sensor locations: ${endTime - startTime}ms`);
    });
  }, [dispatch]);

  useEffect(() => {
    // Fetch initial metric data for the map
    const startTime = new Date().getTime();
    fetchPq({
      url: `${s3prefix}/${selectedParameter}.parquet.brotli`,
      rowStart: 0,
      rowEnd: 2,
    }).then(data => {
      dispatch(setMetricData({ parameter: selectedParameter, data }));

      const endTime = new Date().getTime();
      console.log(`Finished fetching initial map data: ${endTime - startTime}ms`);
    });

    // Grab only this row to quickly color the map
    // fetchPq({
    //   url: meanPm25Url,
    //   columns,
    //   rowStart: startIndex,
    //   rowEnd: endIndex,
    // }).then(d => {
    //   dispatch(setSensorValuesMeanPm25(d));
    //   const endTime = new Date().getTime();
    //   console.log(`Finished fetching latest sensor mean_pm25: ${endTime - startTime}ms`);
    //
    //   fetchPq({
    //     url: meanPm25Url,
    //     columns,
    //     rowStart: firstRowIndices.hour,
    //     rowEnd: firstRowIndices.hour+24,
    //   }).then(d => {
    //     dispatch(setSensorValuesMeanPm25(d));
    //     const endTime = new Date().getTime();
    //     console.log(`Finished fetching last 24-hours mean_pm25: ${endTime - startTime}ms`);
    //
    //     fetchPq({
    //       url: meanPm25Url,
    //       columns
    //     }).then(d => {
    //       dispatch(setSensorValuesMeanPm25(d));
    //       const endTime = new Date().getTime();
    //       console.log(`Finished fetching historical mean_pm25: ${endTime - startTime}ms`);
    //     });
    //   });
    // });
  }, [dispatch, locations, selectedParameter]);

  useEffect(() => {
    // Skip rendering if we don't have enough data
    if (!locations?.length || !metricData?.length) { return; }
    console.log(`Building GeoJSON from metricData:`, metricData);
    const startTime = new Date().getTime();
    const geojsonData = {
      type: 'FeatureCollection',
      features: locations?.filter(l => !!l?.currentSourceId && !!l?.datasourceId)?.map((location) => {
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
            metrics: allMetrics.reduce((acc, metric) => ({
              ...acc,
              [metric]: {
                index: metrics?.[metric]?.index,
                data: metrics?.[metric]?.data?.map(d => ({
                  type: d.type,
                  date: d.date,
                  value: d[location.datasourceId],
                }))
              }
            }), {}),
          },
        }
      }) || [],
    };

    console.log(`Built GeoJSON from sensor data: `, geojsonData);
    dispatch(setSensorGeojsonData(geojsonData));

    const endTime = new Date().getTime();
    console.log(`Finished building GeoJSON: ${endTime - startTime}ms`);
  }, [dispatch, locations, metricData, metrics]);

  if (!metricData) return <>Loading...</>;

  return (
    DEBUG ? <>
      <h3>Parquet Data:</h3>
      <ul>
        {metricData[selectedParameter].map((record, index) => (
          <li key={index}>{/* Render your data here, e.g., record.columnName */}</li>
        ))}
      </ul>
    </> : <></>
  );
};

export default ParquetReaderComponent;
