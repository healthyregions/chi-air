import Grid from "@mui/material/Grid";
import {FaArrowLeft} from "react-icons/fa";
import {pm2_5Ranges} from "../../../config";
import {
  removeSensorsFromSelection,
  selectClickedSensor, selectMetricData, selectSelectedAreas, selectSelectedSensors,
  selectSensorGeojsonData,
  /*selectSensorLocations,*/ selectSensorParameter,
  setClickedSensor, setSelectedAreas
} from "../../../store/slices/sensorDataSlice";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {formatDate, getMetadata, LButton, useSelectorAsState} from "../common";
import {LHeader} from "../common";

const SelectedSensorsPanelContainer = styled.div`
    overflow-y: auto;
    max-height: 40vh;
`;

const GridHeader = styled(Grid)`
    font-family: Lexend,sans-serif;
`;

const GridBody = styled(Grid)`
    font-family: Space Grotesk,serif;
    cursor: pointer;
    &:hover {
        background-color: #22222222;
    }
`;
const Color = styled.span`
    display: block;
    background-color: ${({ $color }) => $color};
    border: 2px solid ${({ $border }) => $border};
    border-radius: 10px;
    width: 16px;
    height: 16px;
`;
const ColorColumn = styled(Grid)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TimestampColumn = styled(Grid)``;
const AqiValueColumn = styled(Grid)``;
//const SensorIdColumn = styled(Grid)``;
const LocationNameColumn = styled(Grid)``;


export const SelectedAreaPanel = () => {
  const dispatch = useDispatch();

  const [, setSelections] = useSelectorAsState(selectSelectedAreas, setSelectedAreas, dispatch);

  //const locations = useSelector(selectSensorLocations);
  const clickedSensor = useSelector(selectClickedSensor);
  const selectedSensors = useSelector(selectSelectedSensors);
  const selectedParameter = useSelector(selectSensorParameter);
  const metricData = useSelector(selectMetricData);
  const geojsonData = useSelector(selectSensorGeojsonData);

  // Grab our previously-fetched data to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const firstHourlyRow = metricData?.find((r) => r.type === 'hour');

  const resetAll = () => {
    setSelections({community:[],zip:[],ward:[]});
    dispatch(removeSensorsFromSelection([...selectedSensors]));
  };

  const invertedColors = ['Good', 'Moderate'];

  const primary = (range) => invertedColors?.includes(range?.label) ? range?.border : range?.color;
  const secondary = (range) => invertedColors?.includes(range?.label) ? range?.color : range?.border;

  return(
    <SelectedSensorsPanelContainer>
      <Grid container spacing={0} alignItems={'center'} marginTop={'2rem'}>
        <Grid size={2}>
          <LButton onClick={() => resetAll()}>
            <FaArrowLeft style={{ width: '15px', height: '15px' }} />
          </LButton>
        </Grid>

        {firstHourlyRow && Object.keys(firstHourlyRow)?.length <= 2 ?  <>Loading, Please Wait...</> : <LHeader>Sensors in location</LHeader>}
      </Grid>

      {!clickedSensor && firstHourlyRow && Object.keys(firstHourlyRow)?.length > 2 && <GridHeader container spacing={0} marginTop={'1rem'}>
        <ColorColumn size={1}></ColorColumn>
        <AqiValueColumn size={2}>{selectedParameter === 'nowcast_aqi' ? 'AQI' : selectedParameter === 'clarity_no2' ? 'NO₂' : 'PM 2.5'}</AqiValueColumn>
        <LocationNameColumn size={4}>Name</LocationNameColumn>
        <TimestampColumn size={3}></TimestampColumn>
        {/*
        {selections?.community?.length === 0 && selections?.zip?.length === 0 && selections?.ward?.length === 0 && <SensorIdColumn size={3}>Sensor ID</SensorIdColumn>}
        {selections?.community?.length > 0 && <SensorIdColumn size={3}>Community</SensorIdColumn>}
        {selections?.zip?.length > 0 && <SensorIdColumn size={3}>Zip code</SensorIdColumn>}
        {selections?.ward?.length > 0 && <SensorIdColumn size={3}>Ward</SensorIdColumn>}
        */}
      </GridHeader>}

      {!clickedSensor && selectedSensors?.map((s, index) => {
        const { feature, latestRow, latestValue } = getMetadata({ parameter: selectedParameter, geojsonData, datasourceId: s });
        if (!latestValue) { return undefined; }
        const fixed = Number(latestValue)?.toFixed(1);
        const range = pm2_5Ranges.find(r => {
          if (selectedParameter === 'nowcast_aqi') {
            return r.aqi_min <= fixed && fixed <= r.aqi_max;
          } else if (selectedParameter === 'clarity_pm25') {
            return r.pm25_min <= fixed && fixed <= r.pm25_max;
          } else if (selectedParameter === 'clarity_no2') {
            return r.pm25_min <= fixed && fixed <= r.pm25_max;
          } else {
            console.warn('WARNING: selectedParameter not supported:', selectedParameter);
            return undefined;
          }
        });
        const {time, date} = formatDate({
          timestamp: latestRow?.date,
          format: 'short'
        });

        return (
          <GridBody container spacing={0} key={`selected-sensor-${s}-${index}`} onClick={() => dispatch(setClickedSensor(s))}>
            <ColorColumn size={1}>
              <Color $color={primary(range)} $border={secondary(range)}></Color>
            </ColorColumn>
            <AqiValueColumn size={2}>
              <strong style={{ color: primary(range) }}>{Number(latestValue)?.toFixed(selectedParameter === 'nowcast_aqi' ? 0 : 1)}</strong>
            </AqiValueColumn>
            <LocationNameColumn size={4}>
              <strong style={{ color: 'rgba(0, 88, 153, 1)' }}>{feature?.properties?.name}</strong>
            </LocationNameColumn>
            <TimestampColumn size={3}>
              <small>{date} {time}</small>
            </TimestampColumn>
            {/*
            <SensorIdColumn size={3}>
              {selections?.community?.length === 0 && selections?.zip?.length === 0 && selections?.ward?.length === 0 && <small>{feature?.properties?.datasourceId}</small>}
              {selections?.community?.length > 0 && <small>{locations?.find(l => l.datasourceId === feature?.properties?.datasourceId)?.community}</small>}
              {selections?.zip?.length > 0 && <small>{locations?.find(l => l.datasourceId === feature?.properties?.datasourceId)?.zip}</small>}
              {selections?.ward?.length > 0 && <small>{locations?.find(l => l.datasourceId === feature?.properties?.datasourceId)?.ward}</small>}
            </SensorIdColumn>
            */}
          </GridBody>
        );
      })}
    </SelectedSensorsPanelContainer>
  );
}
