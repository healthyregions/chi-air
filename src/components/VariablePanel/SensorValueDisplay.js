import Grid from "@mui/material/Grid";
import {FaInfoCircle} from "@react-icons/all-files/fa/FaInfoCircle";
import {pm2_5Ranges} from "../../config";
import styled from "styled-components";

const Color = styled.span`
    display: block;
    background-color: ${({ color }) => color};
    border: 4px solid ${({ border }) => border};
    border-radius: 100px;
    width: 32px;
    height: 32px;
`;

const SensorValueContainer = styled.div`
    font-family: Lexend;
`;
const SensorLabelContainer = styled.div`
    font-family: Lexend;
`;
const SensorNumericalValue = styled.span`
    font-weight: 700;
    font-style: Bold;
    font-size: 36px;
    color: ${({ color }) => color};
`;
const SensorValueScale = styled.small`
    font-weight: 400;
    margin-left:0.3rem;
    font-size: 24px;
    color: ${({ color }) => color};
`;
const SensorValueLabel = styled.span`
    font-weight: 500;
    letter-spacing: 4px;
    padding: 0 0.75rem;
    text-transform: uppercase;
    color: ${({ color }) => color};
    border: 2px solid ${({ color }) => color};
    border-radius: 8px;
    font-size: 18px;
`;

export const SensorValueDisplay = ({ value, scale = 'AQI' }) => {
  if (!value || value === "NaN" || value === "None") {
    return (<></>);
  }

  const range = pm2_5Ranges?.find(r => r.min < value && value <= r.max);
  const invertedColors = ['Good', 'Moderate'];

  const primary = invertedColors?.includes(range?.label) ? range?.border : range?.color;
  const secondary = invertedColors?.includes(range?.label) ? range?.color : range?.border;

  return (
    <>
      <SensorValueContainer>
        <Grid container spacing={0} alignItems={'center'}>
          <Grid size={2}>
            <Color color={primary} border={secondary}></Color>
          </Grid>
          <Grid size={3}>
            <SensorNumericalValue color={primary}>{Number(value).toFixed(1)}</SensorNumericalValue>
            <SensorValueScale color={primary}>{scale}</SensorValueScale>
          </Grid>
        </Grid>
      </SensorValueContainer>

      <SensorLabelContainer>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid offset={2}>
            <SensorValueLabel color={primary}>{range?.label}</SensorValueLabel>
          </Grid>
          <Grid size={2}>
            <FaInfoCircle color={'rgba(0, 88, 153, 0.5)'} />
          </Grid>
        </Grid>
      </SensorLabelContainer>
    </>
  );
};
