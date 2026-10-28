import {FaHistory} from "react-icons/fa";
import {
  selectSelectedTimeIndex,
  selectSensorGeojsonData,
  selectSensorParameter
} from "../../store/slices/sensorDataSlice";
import {useSelector} from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import {formatDate, fromIso, getMetadata} from "./common";
import dayjs from "dayjs";


export const LastUpdatedDisplay = ({ timestamp, datasourceId }) => {
  const geojsonData = useSelector(selectSensorGeojsonData);
  const selectedParameter = useSelector(selectSensorParameter);
  //const locations = useSelector(selectSensorLocations);
  //const metricData = useSelector(selectMetricData);
  const selectedTimeIndex = useSelector(selectSelectedTimeIndex);
  //const averageType = useSelector(selectAverageType);

  const { latestRow } = getMetadata({ parameter: selectedParameter, geojsonData, datasourceId, selectedTimeIndex });
  const {time, date, utc} = formatDate({
    timestamp: timestamp || latestRow?.['date'],
    format: 'long'
  });

  const selectedTimestamp = selectedTimeIndex?.date?.split(' ').join('T') + 'Z';
  const prettyAverageType = ((type) => {
    if (type === 'season') {
      return 'seasonal';
    } else if (type === 'day') {
      return 'daily';
    }
    return `${type}ly`;
  })(selectedTimeIndex?.type);

  const template = ((type) => {
    if (type === 'hour'){
      return 'h:mmA, M/D/YY';
    } else if (type === 'day') {
      return 'M/D/YY';
    } else if (type === 'week') {
      return selectedTimeIndex?.date;
    }
    return selectedTimeIndex?.date;
  })(selectedTimeIndex?.type);

  return (
    <div style={{ margin: '0.5rem 0' }}>
      {(selectedTimeIndex?.date && selectedTimeIndex?.index > 0) ?
        <span style={{ fontWeight: 200, fontFamily: 'Space Grotesk' }}>
          <FaHistory style={{ transform: 'scaleX(-1)', color: 'rgba(0, 88, 153, 0.5)', marginRight: '0.35rem' }} />
          <Tooltip arrow={true} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', marginRight: '0.25rem' }} title={`Viewing past ${prettyAverageType} average: ${fromIso(selectedTimestamp)}`}>past {prettyAverageType} average</Tooltip>
          {dayjs(selectedTimestamp).tz("utc")?.format(template)}
        </span> : <span style={{ fontWeight: 200, fontFamily: 'Space Grotesk' }}>
          <FaHistory style={{ transform: 'scaleX(-1)', color: 'rgba(0, 88, 153, 0.5)', marginRight: '0.35rem' }} />
          <Tooltip arrow={true} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', marginRight: '0.25rem' }} title={`Updated hourly: ${utc?.toUTCString()}`}>updat{time ? 'ed' : 'ing'}</Tooltip>
          {time || 'Loading'}, {date || 'Please Wait...'}
        </span>
      }
    </div>
  );
};
