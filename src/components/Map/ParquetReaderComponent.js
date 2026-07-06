import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSensorLocations,
  selectSensorLocations,
  setSensorGeojsonData,
  selectSensorParameter,
  setMetricData,
  selectMetricData,
  setMetricIndex, selectMetrics, selectClickedSensor, selectBreadcrumbs, selectMetricIndex, selectAverageType,
  selectSelectedTimeIndex,
} from '../../store/slices/sensorDataSlice';
import {fetchPq} from "../VariablePanel/common";

// MINIO => host="http://localhost:9000" bucket_name="chicago-aq"
// AWS S3 => host="s3.us-east-2.amazonaws.com" bucket_name="chicago-aq"
const s3endpoint = process.env.REACT_APP_S3_ENDPOINT_URL;
const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;
const s3prefix = `${s3endpoint}/${bucketName}/current`;

const allMetrics = ['nowcast_aqi', 'clarity_pm25', 'clarity_no2'];

const ParquetReaderComponent = ({ DEBUG }) => {
  const dispatch = useDispatch();
  const locations = useSelector(selectSensorLocations);
  const clickedSensor = useSelector(selectClickedSensor);
  const selectedParameter = useSelector(selectSensorParameter);
  const metrics = useSelector(selectMetrics);
  const metricData = useSelector(selectMetricData);
  const breadcrumbs = useSelector(selectBreadcrumbs);
  const metricIndex = useSelector(selectMetricIndex);
  const averageType = useSelector(selectAverageType);
  const selectedTimeIndex = useSelector(selectSelectedTimeIndex);

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
          const respJson = await index_file_json.json();
          dispatch(setMetricIndex({ parameter: metric_name, index: respJson }));
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
  }, [dispatch, locations, selectedParameter]);

  useEffect(() => {
    if (!clickedSensor){
      // No sensor clicked? No-op
      return;
    }
    /*if (metricData?.filter(r => r.type === 'hour')?.length < 20) {
      console.log(`Already have ~24hrs of data for ${clickedSensor}. Using cached data.`);
      return;
    }*/
    // Fetch ~24hrs graph data for the graph when a sensor is clicked
    const startTime = new Date().getTime();
    fetchPq({
      url: `${s3prefix}/${selectedParameter}.parquet.brotli`,
      columns: ['type', 'date', clickedSensor],
      rowStart: 0,
      rowEnd: 24
    }).then(data => {
      dispatch(setMetricData({ parameter: selectedParameter, data }));
      const endTime = new Date().getTime();
      console.log(`Finished fetching 24hr clicked sensor data: ${endTime - startTime}ms`);
    });
  }, [dispatch, clickedSensor, selectedParameter]);

  // Fetch latest row(s) for selected parameter when Details panel opens
  useEffect(() => {
    const currentPage = breadcrumbs[breadcrumbs.length - 1];
    if (!clickedSensor || currentPage !== 'Details') {
      // No sensor clicked? No-op
      return;
    }

    const startTime = new Date().getTime();
    allMetrics.forEach(parameter => {
      fetchPq({
        url: `${s3prefix}/${parameter}.parquet.brotli`,
        columns: ['type', 'date', clickedSensor],
        rowStart: 0,
        rowEnd: 2
      }).then(data => {
        dispatch(setMetricData({ parameter, data }));
        const endTime = new Date().getTime();
        console.log(`Finished fetching initial Details panel data: ${endTime - startTime}ms`);
      });
    });
  }, [dispatch, clickedSensor, breadcrumbs]);

  useEffect(() => {
    // Fetch initial metric data for the map
    const startTime = new Date().getTime();
    fetchPq({
      url: `${s3prefix}/${selectedParameter}.parquet.brotli`,
      rowStart: selectedTimeIndex,
      rowEnd: selectedTimeIndex+1,
    }).then(data => {
      dispatch(setMetricData({ parameter: selectedParameter, data }));

      const endTime = new Date().getTime();
      console.log(`Finished fetching ${selectedParameter} map data for index=${selectedTimeIndex}: ${endTime - startTime}ms`);
    });
  }, [dispatch, locations, selectedParameter, selectedTimeIndex]);

  useEffect(() => {
    const currentPage = breadcrumbs[breadcrumbs.length - 1];
    if (!clickedSensor || currentPage !== 'Details') {
      // No sensor clicked? No-op
      return;
    }
    // FIXME: this is volatile - data can change in between fetches, hard to keep track of by index
    // FIXME: May need to update index file whenever new data is fetched
    /*if (metricData?.filter(r => r.type === 'hour')?.length < 20) {
      console.log(`Already have ~24hrs of data for ${clickedSensor}. Using cached data.`);
      return;
    }*/

    // FIXME: Determine row indices for target data
    const rowStart = metricIndex[averageType];
    const rowEnd = Object.keys(metricIndex).find(key => metricIndex[key] > rowStart);
    console.log(metricIndex);
    console.log(`Fetching from ${rowStart} to ${rowEnd} from ${s3prefix}/${selectedParameter}.parquet.brotli`)

    // Fetch metric for the Historical Trends graph with the given parameters
    const startTime = new Date().getTime();
    fetchPq({
      url: `${s3prefix}/${selectedParameter}.parquet.brotli`,
      columns: ['type', 'date', clickedSensor],
      rowStart,
      rowEnd: rowEnd === -1 ? rowEnd : undefined
    }).then(data => {
      dispatch(setMetricData({ parameter: selectedParameter, data }));
      const endTime = new Date().getTime();
      console.log(`Finished fetching initial map data: ${endTime - startTime}ms`);
    });
  }, [dispatch, clickedSensor, selectedParameter, breadcrumbs, metricIndex, averageType]);

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
                  value: Number(d[location.datasourceId]),
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
