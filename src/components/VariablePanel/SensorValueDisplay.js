import Grid from "@mui/material/Grid";
import {FaInfoCircle} from "@react-icons/all-files/fa/FaInfoCircle";
import {pm2_5Ranges} from "../../config";
import styled from "styled-components";

const SensorValueDisplayContainer = styled.div`
    font-family: Lexend;
`;

const SensorValueColorIndicator = styled.span`
    display: block;
    background-color: ${({ color }) => color};
    border: 4px solid ${({ border }) => border};
    border-radius: 100px;
    width: 32px;
    height: 32px;
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
const SensorLabelPanel = styled.div`
    border: 2px solid ${({ color }) => color};
    border-radius: 8px;
    padding: 0 0.75rem;
`;

const SensorValueLabel = styled.span`
    font-weight: 500;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: ${({ color }) => color};
    font-size: 18px;
`;
const SensorValueLabelTooltip = styled(FaInfoCircle)`
    width: 15px;
    height: 15px;
    margin-left: 0.5rem;
`;

export const SensorValueDisplay = ({ showColor = true, style, value, scale = 'AQI' }) => {
  // TODO: is zero an expected value? if not, change to value === null
  if (value == null || value === "NaN" || value === "None") {
    return (<></>);
  }

  const range = pm2_5Ranges?.find(r => r.min < value && value <= r.max);
  const invertedColors = ['Good', 'Moderate'];

  const primary = invertedColors?.includes(range?.label) ? range?.border : range?.color;
  const secondary = invertedColors?.includes(range?.label) ? range?.color : range?.border;

  return (
    <>
      <SensorValueDisplayContainer style={style}>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid size={2}>
            {showColor && <SensorValueColorIndicator color={primary} border={secondary}></SensorValueColorIndicator>}
          </Grid>
          <Grid>
            <SensorNumericalValue color={primary}>{Number(value).toFixed(1)}</SensorNumericalValue>
            <SensorValueScale color={primary}>{scale}</SensorValueScale>
          </Grid>
        </Grid>

        <Grid container spacing={0} alignItems={'center'} marginTop={'0.5rem'}>
          <Grid offset={2} size={8}>
            <SensorLabelPanel color={primary}>
              <SensorValueLabel color={primary}>{range?.label}</SensorValueLabel>
            </SensorLabelPanel>
          </Grid>
          <Grid size={2}>
            <SensorValueLabelTooltip style={{ alignSelf: 'center' }} color={'rgba(0, 88, 153, 0.5)'} />
          </Grid>
        </Grid>
      </SensorValueDisplayContainer>
    </>
  );
};
