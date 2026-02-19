import {FaHistory} from "@react-icons/all-files/fa/FaHistory";
import {selectSensorGeojsonData} from "../../store/slices/sensorDataSlice";
import {useSelector} from "react-redux";
import {Tooltip} from "@mui/material";

export const formatDate = (input) => {
  if (Object.prototype.toString.call(input) !== "[object Date]" || isNaN(input)) {
    // either not a date object or date object is not valid

    return undefined;
  }

  // Use 'en-US' to ensure the Month/Day/Year order
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  }).formatToParts(input);

  // Reconstruct to place the time before the date with a comma
  const time = `${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value} ${parts.find(p => p.type === 'dayPeriod').value}`;
  const date = `${parts.find(p => p.type === 'month').value}/${parts.find(p => p.type === 'day').value}/${parts.find(p => p.type === 'year').value}`;

  return { time, date };
}

const getLatestValue = (geojsonData, id) => {
  if (!id) { return undefined; }
  const first = geojsonData?.features?.find(f => {
    return f.properties['datasourceId'] === id;
  });
  return first?.properties;
}

export const LastUpdatedDisplay = ({ date, datasourceId }) => {
  const geojsonData = useSelector(selectSensorGeojsonData);

  const latest = date ?? getLatestValue(geojsonData, datasourceId)?.last_update;
  const isoTimestampUtc = latest?.split(' ')?.join('T') + 'Z';
  const lastUpdated = new Date(isoTimestampUtc);
  const formatted = formatDate(lastUpdated);

  return (
    <div style={{ margin: '0.5rem 0' }}>
      <span style={{ fontWeight: 200, fontFamily: 'Space Grotesk' }}>
        <FaHistory style={{ transform: 'scaleX(-1)', color: 'rgba(0, 88, 153, 0.5)', marginRight: '0.35rem' }} />
        <Tooltip style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', marginRight: '0.25rem' }} title={lastUpdated?.toUTCString()}>updat{formatted?.time ? 'ed' : 'ing'}</Tooltip>
        {formatted?.time || 'Loading'}, {formatted?.date || 'Please Wait...'}
      </span>
    </div>
  );
};
