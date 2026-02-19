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
    margin-top: 0.5rem;
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
const SensorValueLabelTooltip = styled(FaInfoCircle)`
    width: 15px;
    height: 15px;
    margin-left: 0.5rem;
`;

export const SensorValueDisplay = ({ showColor = true,  value, scale = 'AQI' }) => {
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
      <SensorValueDisplayContainer>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid>
            {showColor && <SensorValueColorIndicator color={primary} border={secondary}></SensorValueColorIndicator>}
          </Grid>

          <Grid>
            <SensorNumericalValue color={primary}>{Number(value).toFixed(1)}</SensorNumericalValue>
            <SensorValueScale color={primary}>{scale}</SensorValueScale>
            <SensorLabelPanel>
              <SensorValueLabel color={primary}>{range?.label}</SensorValueLabel>
              <SensorValueLabelTooltip color={'rgba(0, 88, 153, 0.5)'} />
            </SensorLabelPanel>
          </Grid>
        </Grid>
      </SensorValueDisplayContainer>
    </>
  );
};
