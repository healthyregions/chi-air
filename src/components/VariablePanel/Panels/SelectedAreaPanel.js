import Grid from "@mui/material/Grid";
import {FaArrowLeft} from "react-icons/fa";
import {pm2_5Ranges} from "../../../config";
import {
  removeSensorsFromSelection,
  selectClickedSensor, selectMetricData, selectSelectedAreas, selectSelectedSensors,
  selectSensorGeojsonData,
  selectSensorLocations, selectSensorParameter,
  setClickedSensor, setSelectedAreas
} from "../../../store/slices/sensorDataSlice";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {formatDate, getLatestValue, LButton, useSelectorAsState} from "../common";
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
    border: 1px solid ${({ $border }) => $border};
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
const AqiValueColumn = styled(Grid)`
    text-align: right;
`;
const SensorIdColumn = styled(Grid)``;
const LocationNameColumn = styled(Grid)``;


export const SelectedAreaPanel = () => {
  const dispatch = useDispatch();

  const [selections, setSelections] = useSelectorAsState(selectSelectedAreas, setSelectedAreas, dispatch);

  const locations = useSelector(selectSensorLocations);
  const clickedSensor = useSelector(selectClickedSensor);
  const selectedSensors = useSelector(selectSelectedSensors);
  const selectedParameter = useSelector(selectSensorParameter);
  const metricData = useSelector(selectMetricData(selectedParameter));
  const geojsonData = useSelector(selectSensorGeojsonData);

  // Grab our previously-fetched data to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const firstHourlyRow = metricData?.find((r) => r.type === 'hour');

  const resetAll = () => {
    setSelections({community:[],zip:[],ward:[]});
    dispatch(removeSensorsFromSelection([...selectedSensors]));
  };

  return(
    <SelectedSensorsPanelContainer>
      <Grid container spacing={0} alignItems={'center'} marginTop={'2rem'}>
        <Grid size={2}>
          <LButton onClick={() => resetAll()}>
            <FaArrowLeft style={{ width: '15px', height: '15px' }} />
          </LButton>
        </Grid>

        {firstHourlyRow && Object.keys(firstHourlyRow)?.length <= 2 ?  <>Loading, Please Wait...</> : <LHeader>Selected
          {!selections?.community?.length && !selections?.zip?.length && !selections?.ward?.length && <> Locations </>}
          {selections?.community?.length > 0 && <> Community </>}
          {selections?.zip?.length > 0 && <> Zip code </>}
          {selections?.ward?.length > 0 && <> Ward </>}
        </LHeader>}
      </Grid>

      {!clickedSensor && firstHourlyRow && Object.keys(firstHourlyRow)?.length > 2 && <GridHeader container spacing={0} marginTop={'1rem'}>
        <TimestampColumn size={3}></TimestampColumn>
        <AqiValueColumn size={1}>PM2.5</AqiValueColumn>
        <ColorColumn size={1}></ColorColumn>
        <LocationNameColumn size={4}>Name</LocationNameColumn>
        {selections?.community?.length === 0 && selections?.zip?.length === 0 && selections?.ward?.length === 0 && <SensorIdColumn size={3}>Sensor ID</SensorIdColumn>}
        {selections?.community?.length > 0 && <SensorIdColumn size={3}>Community</SensorIdColumn>}
        {selections?.zip?.length > 0 && <SensorIdColumn size={3}>Zip code</SensorIdColumn>}
        {selections?.ward?.length > 0 && <SensorIdColumn size={3}>Ward</SensorIdColumn>}
      </GridHeader>}

      {!clickedSensor && selectedSensors?.map((s, index) => {
        const latestValue = getLatestValue(geojsonData, s);
        if (!latestValue) { return undefined; }
        const { latest_mean_pm25, datasourceId, name, last_update } = latestValue;
        const fixed = Number(latest_mean_pm25)?.toFixed(1);
        const range = pm2_5Ranges.find(r => r.min <= fixed && fixed <= r.max);
        const {time, date} = formatDate({
          timestamp: last_update,
          format: 'short'
        });

        return (
          <GridBody container spacing={0} key={`selected-sensor-${s}-${index}`} onClick={() => dispatch(setClickedSensor(s))}>
            <TimestampColumn size={3}>
              <small>{date} {time}</small>
            </TimestampColumn>
            <AqiValueColumn size={1}>
              <small>{Number(latest_mean_pm25)?.toFixed(1)}</small>
            </AqiValueColumn>
            <ColorColumn size={1}>
              <Color $color={range?.color} $border={range?.border}></Color>
            </ColorColumn>
            <LocationNameColumn size={4}>
              <small>{name}</small>
            </LocationNameColumn>
            <SensorIdColumn size={3}>
              {selections?.community?.length === 0 && selections?.zip?.length === 0 && selections?.ward?.length === 0 && <small>{datasourceId}</small>}
              {selections?.community?.length > 0 && <small>{locations?.find(l => l.datasourceId === datasourceId)?.community}</small>}
              {selections?.zip?.length > 0 && <small>{locations?.find(l => l.datasourceId === datasourceId)?.zip}</small>}
              {selections?.ward?.length > 0 && <small>{locations?.find(l => l.datasourceId === datasourceId)?.ward}</small>}
            </SensorIdColumn>
          </GridBody>
        );
      })}
    </SelectedSensorsPanelContainer>
  );
}
