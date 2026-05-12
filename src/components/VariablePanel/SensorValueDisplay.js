import Grid from "@mui/material/Grid";
import {pm2_5Ranges} from "../../config";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {selectSensorParameter} from "../../store/slices/sensorDataSlice";
import {FaSlash, FaWifi} from "react-icons/fa";

const SensorValueDisplayContainer = styled.div`
    font-family: Lexend,sans-serif;
`;

const SensorValueColorIndicator = styled.div`
    display: block;
    background-color: ${({ $color }) => $color};
    border: 4px solid ${({ $border }) => $border};
    border-radius: 100px;
    margin-right: 0.8rem;
    width: 32px;
    height: 32px;
`;
const SensorNumericalValue = styled.span`
    font-weight: 700;
    font-size: 36px;
    color: ${({ $color }) => $color};
`;
const SensorValueScale = styled.small`
    font-weight: 400;
    margin-left:0.3rem;
    font-size: 24px;
    color: ${({ $color }) => $color};
`;
const SensorLabelPanel = styled.div`
    border: 2px solid ${({ $color }) => $color};
    border-radius: 8px;
    padding: 0 0.75rem;
`;

const SensorValueLabel = styled.span`
    font-weight: 500;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: ${({ $color }) => $color};
    font-size: 18px;
`;

export const SensorValueDisplay = ({ showColor = true, style, value }) => {
  const selectedParameter = useSelector(selectSensorParameter);

  const scale = selectedParameter === 'nowcast_aqi' ? 'AQI' : selectedParameter === 'clarity_no2' ? 'ppb' : 'μg/m³';

  const rounded = selectedParameter === 'nowcast_aqi' ? value : Math.round(value * 10) / 10;
  const range = pm2_5Ranges?.find(r => {
    if (selectedParameter === 'nowcast_aqi') {
      return r.aqi_min <= rounded && rounded <= r.aqi_max;
    } else if (selectedParameter === 'clarity_pm25') {
      return r.pm25_min <= rounded && rounded <= r.pm25_max;
    } else if (selectedParameter === 'clarity_no2') {
      return r.no2_min <= rounded && rounded <= r.no2_max;
    } else {
      console.warn('Unrecognized parameter in SensorValueDisplay:', selectedParameter);
      return undefined;
    }
  });

  const invertedColors = ['Good', 'Moderate'];

  const primary = invertedColors?.includes(range?.label) ? range?.border : range?.color;
  const secondary = invertedColors?.includes(range?.label) ? range?.color : range?.border;

  return (
    <>
      <SensorValueDisplayContainer style={{...style}}>

        {/* No recent reading, report sensor offline */}
        {(!value || value === "NaN" || value === "None") &&
          <Grid container spacing={0} alignItems={'center'}>
            <Grid size={{ xs: 12 }}>
              <span style={{ color: 'rgba(228, 0, 43, 1)' }}>
                <>
                  <FaSlash style={{ transform: 'scaleX(-1)', position: 'absolute'}}></FaSlash>
                  <FaWifi></FaWifi>
                </> Sensor currently offline
              </span>
            </Grid>
            <Grid size={{ xs: 12 }} style={{ marginTop: '2rem' }}>
              <Grid container spacing={0} alignItems={'center'}>
                <Grid size={{ xs: 2 }}>
                  <SensorValueColorIndicator $color={'rgba(68, 68, 68, 0.2)'} $border={'rgba(68, 68, 68, 0.3)'}></SensorValueColorIndicator>
                </Grid>
                <Grid size={{ xs: 10 }}>
                  <SensorValueLabel $color={'rgba(68, 68, 68, 0.75)'}>
                    {rounded ? range?.label : 'Unavailable'}
                  </SensorValueLabel>
                </Grid>
              </Grid>
            </Grid>
          </Grid>}

        {/* Show latest reading */}
        {!!rounded && <Grid container spacing={0} alignItems={'center'}>
          {showColor && <SensorValueColorIndicator $color={primary} $border={secondary}></SensorValueColorIndicator>}
          <Grid>
            <SensorNumericalValue $color={rounded ? primary : 'rgba(68, 68, 68, 0.75)'}>
              {selectedParameter === 'nowcast_aqi' && Number(rounded)}
              {/*{selectedParameter === 'mean_pm25' && Number(rounded).toFixed(1)}*/}
              {selectedParameter === 'clarity_pm25' && Number(rounded).toFixed(1)}
              {selectedParameter === 'clarity_no2' && Number(rounded).toFixed(1)}
            </SensorNumericalValue>
            <SensorValueScale $color={rounded ? primary : 'rgba(68, 68, 68, 0.75)'}>{scale}</SensorValueScale>
          </Grid>
        </Grid>}

        {!!rounded && <Grid container spacing={0} alignItems={'center'} marginTop={'0.5rem'}>
          <Grid offset={2}>
            <SensorLabelPanel $color={primary}>
              <SensorValueLabel $color={rounded ? primary : 'rgba(68, 68, 68, 0.75)'}>
                {rounded ? range?.label : 'Unavailable'}
              </SensorValueLabel>
            </SensorLabelPanel>
          </Grid>
        </Grid>}
      </SensorValueDisplayContainer>
    </>
  );
};
