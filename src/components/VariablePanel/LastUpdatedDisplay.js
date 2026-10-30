import {FaHistory} from "react-icons/fa";
import {
  selectSelectedTimeIndex,
  selectSensorGeojsonData,
  selectSensorParameter
} from "../../store/slices/sensorDataSlice";
import {useSelector} from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import {formatDate, formatWeekDate, fromIso, getMetadata} from "./common";
import dayjs from "dayjs";


export const LastUpdatedDisplay = ({ timestamp, datasourceId }) => {
  const geojsonData = useSelector(selectSensorGeojsonData);
  const selectedParameter = useSelector(selectSensorParameter);
  //const locations = useSelector(selectSensorLocations);
  //const metricData = useSelector(selectMetricData);
  const selectedTimeIndex = useSelector(selectSelectedTimeIndex);
  //const averageType = useSelector(selectAverageType);

  const selectedTimestamp = selectedTimeIndex?.type === 'hour' ? fromIso(selectedTimeIndex?.date) : selectedTimeIndex?.date;
  const prettyAverageType = ((type) => {
    if (!type) {
      return 'hourly';
    }
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

  const { latestRow } = getMetadata({ parameter: selectedParameter, geojsonData, datasourceId, selectedTimeIndex });
  const {time, date, utc} = (!selectedTimeIndex?.type || selectedTimeIndex?.type === 'hour') ? formatDate({
    timestamp: timestamp || latestRow?.['date'],
    format: 'long'
  }) : {time: undefined, date: undefined, utc: undefined};

  return (
    <div style={{ margin: '0.5rem 0' }}>
      {(selectedTimeIndex?.type === 'hour' && selectedTimeIndex?.index === 0) ?
        <span style={{ fontWeight: 200, fontFamily: 'Space Grotesk' }}>
          <FaHistory style={{ transform: 'scaleX(-1)', color: 'rgba(0, 88, 153, 0.5)', marginRight: '0.35rem' }} />
          <Tooltip arrow={true} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', marginRight: '0.25rem' }} title={`Updated hourly: ${utc?.toUTCString()}`}>updat{time ? 'ed' : 'ing'}</Tooltip>
          {time || 'Loading'}, {date || 'Please Wait...'}
        </span> : <span style={{ fontWeight: 200, fontFamily: 'Space Grotesk' }}>
          <FaHistory style={{ transform: 'scaleX(-1)', color: 'rgba(0, 88, 153, 0.5)', marginRight: '0.35rem' }} />
          <Tooltip arrow={true} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', marginRight: '0.25rem' }} title={`Viewing past ${prettyAverageType} average: ${selectedTimestamp}`}>past {prettyAverageType} average</Tooltip>
          {
            selectedTimeIndex?.type === 'day' || selectedTimeIndex?.type === 'hour' ? dayjs(selectedTimestamp).tz("America/Chicago")?.format(template) :
              selectedTimeIndex?.type === 'week' ? `${formatWeekDate(selectedTimestamp)[0]} - ${formatWeekDate(selectedTimestamp)[1]}` :
                selectedTimeIndex?.type === 'month' ? `${dayjs(selectedTimestamp).tz("utc").startOf('month').format('MMMM YYYY')}` :
                  selectedTimeIndex?.type === 'season' ?
                    (selectedTimestamp?.split('-')[1]?.toLowerCase() === 'spring' ? `Spring ${selectedTimestamp?.split('-')[0]}` :
                        selectedTimestamp?.split('-')[1]?.toLowerCase() === 'summer' ? `Summer ${selectedTimestamp?.split('-')[0]}` :
                          (selectedTimestamp?.split('-')[1]?.toLowerCase() === 'fall' || selectedTimestamp?.split('-')[1]?.toLowerCase() === 'autumn') ? `Fall ${selectedTimestamp?.split('-')[0]}` : `Winter ${selectedTimestamp?.split('-')[0]}`
                    ) : selectedTimestamp
          }
        </span>
      }
    </div>
  );
};
