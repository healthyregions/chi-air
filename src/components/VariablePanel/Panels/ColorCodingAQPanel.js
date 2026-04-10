import Grid from "@mui/material/Grid";
import {LButton, LHeader, SGBody} from "../common";
import {FaArrowCircleLeft} from "react-icons/fa";
import {pm2_5Ranges} from "../../../config";


export const ColorCodingAQPanel = ({ pop }) => {
  return(
    <>
      <Grid container spacing={0} marginTop={'1rem'}>
        <LButton as={Grid} size={1} variant={'text'} onClick={() => pop()}
                 style={{ cursor: 'pointer', marginTop: '0.4rem' }}>
          <FaArrowCircleLeft style={{ width: '19px', height: '19px' }} />
        </LButton>

        <Grid size={11}>
          <LHeader>Color Coding Air Quality</LHeader>

          <SGBody style={{ margin: '1rem 0' }}>
            The Air Quality Index (AQI) color scale is a standardized, six-color, 0-500 system used to communicate health risks from air pollution. Colors range from Green (good) to Maroon (hazardous), with higher numbers and warmer colors indicating higher pollution levels and greater health risks. These same colors can be used to describe PM2.5 as well, using different values.
          </SGBody>

          {pm2_5Ranges?.map(({ aqi_min, aqi_max, pm25_min, pm25_max, label, color, border}, index) => <Grid key={`color-coding-${index}`} container spacing={2}>
            <Grid size={12} key={`overlay-key-${index}-${label}`} alignItems={'center'} display={'flex'}>
              <span style={{ display: 'inline-block', backgroundColor: color, width: '19px', height: '64px', margin: '0.3rem 0' }}></span>
              <div style={{ marginLeft: '1rem' }}>
                <LHeader style={{ fontSize: '18px', fontWeight: 700, color: ['Good', 'Moderate'].includes(label) ? border : color }}>{label}</LHeader>
                <SGBody style={{ fontSize: '14px', marginTop: '0.5rem' }}>AQI {Number(aqi_min)}{Number(aqi_max) > 999 ? '+' : <> - {Number(aqi_max)}</>}</SGBody>
                {/*<SGBody style={{ fontSize: '14px', marginTop: '0.5rem' }}>PM 2.5 {pm25_min.toFixed(1)}{pm25_max.toFixed(1) > 9999 ? '+' : <> - {pm25_max.toFixed(1)}</>}</SGBody>*/}
              </div>
            </Grid>
          </Grid>)}
        </Grid>
      </Grid>
    </>
  );
};
