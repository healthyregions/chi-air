import {FaHistory} from "react-icons/fa";
import {
  selectSensorGeojsonData,
  selectSensorParameter
} from "../../store/slices/sensorDataSlice";
import {useSelector} from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import {formatDate, getMetadata} from "./common";
import {useTranslation} from "react-i18next";


export const LastUpdatedDisplay = ({ timestamp, datasourceId }) => {
  const geojsonData = useSelector(selectSensorGeojsonData);
  const selectedParameter = useSelector(selectSensorParameter);
  const { t, i18n } = useTranslation('panel');
  //const locations = useSelector(selectSensorLocations);
  //const metricData = useSelector(selectMetricData);

  const { latestRow } = getMetadata({ parameter: selectedParameter, geojsonData, datasourceId });
  const {time, date, utc} = formatDate({
    timestamp: timestamp || latestRow?.['date'],
    format: 'long'
  });

  return (
    <div style={{ margin: '0.5rem 0' }}>
      <span style={{ fontWeight: 200, fontFamily: 'Space Grotesk' }}>
        <FaHistory style={{ transform: 'scaleX(-1)', color: 'rgba(0, 88, 153, 0.5)', marginRight: '0.35rem' }} />
        <Tooltip arrow={true} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', marginRight: '0.25rem' }} title={t('lastUpdated.tooltip', { date: utc?.toLocaleString(i18n.resolvedLanguage, { timeZone: 'UTC', dateStyle: 'full', timeStyle: 'long' }) })}>{time ? t('lastUpdated.updated') : t('lastUpdated.updating')}</Tooltip>
        {time || t('lastUpdated.loading')}, {date || t('lastUpdated.pleaseWait')}
      </span>
    </div>
  );
};
