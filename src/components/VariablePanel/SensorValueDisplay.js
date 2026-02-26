import Grid from "@mui/material/Grid";
import {pm2_5Ranges} from "../../config";
import styled from "styled-components";

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

export const SensorValueDisplay = ({ showColor = true, style, value, scale = 'AQI' }) => {
  // TODO: is zero an expected value? if not, change to value === null
  if (value == null || value === "NaN" || value === "None") {
    return (<></>);
  }

  const rounded = Math.round(value * 10) / 10;
  const range = pm2_5Ranges?.find(r => r.min <= rounded && rounded <= r.max);

  const invertedColors = ['Good', 'Moderate'];

  const primary = invertedColors?.includes(range?.label) ? range?.border : range?.color;
  const secondary = invertedColors?.includes(range?.label) ? range?.color : range?.border;

  return (
    <>
      <SensorValueDisplayContainer style={{...style}}>
        <Grid container spacing={0} alignItems={'center'}>
          {showColor && <SensorValueColorIndicator $color={primary} $border={secondary}></SensorValueColorIndicator>}
          <Grid>
            <SensorNumericalValue $color={primary}>{Number(rounded).toFixed(1)}</SensorNumericalValue>
            <SensorValueScale $color={primary}>{scale}</SensorValueScale>
          </Grid>
        </Grid>

        <Grid container spacing={0} alignItems={'center'} marginTop={'0.5rem'}>
          <Grid offset={2}>
            <SensorLabelPanel $color={primary}>
              <SensorValueLabel $color={primary}>{range?.label}</SensorValueLabel>
            </SensorLabelPanel>
          </Grid>
        </Grid>
      </SensorValueDisplayContainer>
    </>
  );
};
