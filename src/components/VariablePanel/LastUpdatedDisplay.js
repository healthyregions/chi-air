import {FaHistory} from "react-icons/fa";
import {selectSensorGeojsonData} from "../../store/slices/sensorDataSlice";
import {useSelector} from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import {formatDate, getLatestValue} from "./common";


export const LastUpdatedDisplay = ({ timestamp, datasourceId }) => {
  const geojsonData = useSelector(selectSensorGeojsonData);

  const latest = timestamp ?? getLatestValue(geojsonData, datasourceId)?.last_update;
  const {time, date, utc} = formatDate({
    timestamp: latest,
    format: 'long'
  });

  return (
    <div style={{ margin: '0.5rem 0' }}>
      <span style={{ fontWeight: 200, fontFamily: 'Space Grotesk' }}>
        <FaHistory style={{ transform: 'scaleX(-1)', color: 'rgba(0, 88, 153, 0.5)', marginRight: '0.35rem' }} />
        <Tooltip arrow={true} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', marginRight: '0.25rem' }} title={`Updated hourly: ${utc?.toUTCString()}`}>updat{time ? 'ed' : 'ing'}</Tooltip>
        {time || 'Loading'}, {date || 'Please Wait...'}
      </span>
    </div>
  );
};
