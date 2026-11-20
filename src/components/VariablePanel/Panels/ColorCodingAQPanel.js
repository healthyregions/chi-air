import Grid from "@mui/material/Grid";
import {LButton, LHeader, SGBody} from "../common";
import {FaArrowCircleLeft} from "react-icons/fa";
import {pm2_5Ranges} from "../../../config";
import {useSelector} from "react-redux";
import {selectSensorParameter} from "../../../store/slices/sensorDataSlice";
import {Trans, useTranslation} from "react-i18next";
import useConfigText from "../../../i18n/useConfigText";


export const ColorCodingAQPanel = ({ pop }) => {
  const selectedParameter = useSelector(selectSensorParameter);
  const { t } = useTranslation('panel');
  const tc = useConfigText();

  return(
    <>
      <Grid container spacing={0} marginTop={'1rem'}>
        <LButton as={Grid} size={1} variant={'text'} onClick={() => pop()}
                 style={{ cursor: 'pointer', marginTop: '0.4rem' }}>
          <FaArrowCircleLeft style={{ width: '19px', height: '19px' }} />
        </LButton>

        <Grid size={11}>
          <LHeader>
            {selectedParameter === 'nowcast_aqi' && <>{t('colorCoding.title.aqi')}</>}
            {selectedParameter === 'clarity_pm25' && <>{t('colorCoding.title.pm25')}</>}
            {selectedParameter === 'clarity_no2' && <>{t('colorCoding.title.no2')}</>}
          </LHeader>

          <SGBody style={{ margin: '1rem 0' }}>
            {selectedParameter === 'nowcast_aqi' && <Trans t={t} i18nKey="colorCoding.body.aqi" components={{ strong: <strong /> }} />}
            {selectedParameter === 'clarity_pm25' && <Trans t={t} i18nKey="colorCoding.body.pm25" components={{ strong: <strong /> }} />}
            {selectedParameter === 'clarity_no2' && <Trans t={t} i18nKey="colorCoding.body.no2" components={{ strong: <strong /> }} />}
          </SGBody>

          {pm2_5Ranges?.map(({ aqi_min, aqi_max, pm25_min, pm25_max, no2_min, no2_max, label, color, border}, index) =>
            <Grid key={`color-coding-${index}`} container spacing={2}>
              <Grid size={12} key={`overlay-key-${index}-${label}`} alignItems={'center'} display={'flex'}>
                <span style={{ display: 'inline-block', backgroundColor: color, width: '19px', height: '64px', margin: '0.3rem 0' }}></span>
                <div style={{ marginLeft: '1rem' }}>
                  <LHeader style={{ fontSize: '18px', fontWeight: 700, color: ['Good', 'Moderate'].includes(label) ? border : color }}>{tc('aqiLevels', label, 'label', label)}</LHeader>
                  {selectedParameter === 'nowcast_aqi' && <SGBody style={{ fontSize: '14px', marginTop: '0.5rem' }}>AQI {Number(aqi_min)}{Number(aqi_max) > 999 ? '+' : <> - {Number(aqi_max)}</>}</SGBody>}
                  {selectedParameter === 'clarity_pm25' && <SGBody style={{ fontSize: '14px', marginTop: '0.5rem' }}>PM2.5 {pm25_min.toFixed(1)}{pm25_max > 9999 ? '+' : <> - {pm25_max.toFixed(1)}</>} μg/m³</SGBody>}
                  {selectedParameter === 'clarity_no2' && <SGBody style={{ fontSize: '14px', marginTop: '0.5rem' }}>NO₂ {no2_min.toFixed(1)}{no2_max > 9999 ? '+' : <> - {no2_max.toFixed(1)}</>} ppb</SGBody>}
                </div>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};
