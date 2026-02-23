import Grid from "@mui/material/Grid";
import {FaTimes} from "@react-icons/all-files/fa/FaTimes";
import {DropdownButton} from "../DropdownButton";
import {
  selectClickedSensor,
  selectSelectedAreas,
  selectSelectedSensors,
  selectSensorLocations,
  setClickedSensor, setSelectedAreas,
  setSelectedSensors
} from "../../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {LButton, LLabel} from "../common";


export const AreaSelectionDropdowns = ({ push, pop }) => {
  const dispatch = useDispatch();

  const selections = useSelector(selectSelectedAreas);
  const setSelections = (sel) => dispatch(setSelectedAreas(sel));

  const locations = useSelector(selectSensorLocations);
  const selectedSensors = useSelector(selectSelectedSensors);
  const clickedSensor = useSelector(selectClickedSensor);

  const clearSelection = () => {
    setSelections({...selections, community: [], zip: [], ward: []});
  }
  const handleDropdownChanged = (s, key = 'community') => {
    setSelections({...selections, [key]: [s]});
    const newSelectedSensors = locations.filter(l => l[key] === s)?.map(l => l.datasourceId);
    dispatch(setSelectedSensors([...newSelectedSensors]));
    if (!selectedSensors?.includes(clickedSensor)) {
      dispatch(setClickedSensor());
      pop('root');
    }
  }

  return(
    <>
      {(selections?.community?.length > 0 || selections?.zip?.length > 0) && <Grid container spacing={4} marginTop={'0.5rem'}>
        <Grid size={10}>
          {selections?.community?.length > 0 && <span><LLabel>Community:</LLabel> {selections?.community?.[0]}</span>}
          {selections?.zip?.length > 0 && <span><LLabel>Zip code:</LLabel> {selections?.zip?.[0]}</span>}
        </Grid>
        <Grid size={2}>
          <LButton variant={'text'} size={'small'} onClick={clearSelection}><FaTimes /></LButton>
        </Grid>
      </Grid>}

      {selections?.zip?.length === 0 && selections?.community?.length === 0 && <Grid container spacing={4}>
        <Grid size={4}>
          <DropdownButton onChange={(s) => handleDropdownChanged(s, 'community')}
                          ButtonComponent={LButton}
                          label={'Community'}
                          style={{ textTransform: 'capitalize' }}
                          menuStyle={{ textTransform: 'capitalize' }}
                          options={locations?.map(l => l.community)} />
        </Grid>
        <Grid size={8}>
          <DropdownButton onChange={(s) => handleDropdownChanged(s, 'zip')}
                          ButtonComponent={LButton}
                          label={'Zip code'}
                          options={locations?.map(l => l.zip)} />
        </Grid>
      </Grid>}
    </>
  );
}
