import Grid from "@mui/material/Grid";
import {LButton, LHeader, SGBody} from "../common";
import {FaArrowCircleLeft} from "react-icons/fa";
import {pm2_5Ranges} from "../../../config";
import {useSelector} from "react-redux";
import {selectSensorParameter} from "../../../store/slices/sensorDataSlice";


export const ColorCodingAQPanel = ({ pop }) => {
  const selectedParameter = useSelector(selectSensorParameter);
  const isPM25 = selectedParameter === 'mean_pm25';

  return(
    <>
      <Grid container spacing={0} marginTop={'1rem'}>
        <LButton as={Grid} size={1} variant={'text'} onClick={() => pop()}
                 style={{ cursor: 'pointer', marginTop: '0.4rem' }}>
          <FaArrowCircleLeft style={{ width: '19px', height: '19px' }} />
        </LButton>

        <Grid size={11}>
          <LHeader>Color Coding {isPM25 ? 'PM 2.5' : 'Air Quality'}</LHeader>

          <SGBody style={{ margin: '1rem 0' }}>
            {isPM25
              ? <>The <strong>PM 2.5</strong> color scale shows concentrations of fine particulate matter in micrograms per cubic meter (μg/m³). Colors range from Green (good) to Maroon (hazardous), with higher values indicating greater health risks.</>
              : <>The <strong>Air Quality Index (AQI)</strong> color scale is a standardized, six-color, 0-500 system used to communicate health risks from air pollution. Colors range from Green (good) to Maroon (hazardous), with higher numbers and warmer colors indicating higher pollution levels and greater health risks.</>
            }
          </SGBody>

          {pm2_5Ranges?.map(({ aqi_min, aqi_max, pm25_min, pm25_max, label, color, border}, index) => <Grid key={`color-coding-${index}`} container spacing={2}>
            <Grid size={12} key={`overlay-key-${index}-${label}`} alignItems={'center'} display={'flex'}>
              <span style={{ display: 'inline-block', backgroundColor: color, width: '19px', height: '64px', margin: '0.3rem 0' }}></span>
              <div style={{ marginLeft: '1rem' }}>
                <LHeader style={{ fontSize: '18px', fontWeight: 700, color: ['Good', 'Moderate'].includes(label) ? border : color }}>{label}</LHeader>
                {isPM25
                  ? <SGBody style={{ fontSize: '14px', marginTop: '0.5rem' }}>PM 2.5 {pm25_min.toFixed(1)}{pm25_max > 9999 ? '+' : <> - {pm25_max.toFixed(1)} μg/m³</>}</SGBody>
                  : <SGBody style={{ fontSize: '14px', marginTop: '0.5rem' }}>AQI {Number(aqi_min)}{Number(aqi_max) > 999 ? '+' : <> - {Number(aqi_max)}</>}</SGBody>
                }
              </div>
            </Grid>
          </Grid>)}
        </Grid>
      </Grid>
    </>
  );
};
