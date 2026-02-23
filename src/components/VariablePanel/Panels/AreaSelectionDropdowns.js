import Grid from "@mui/material/Grid";
import {FaTimes} from "@react-icons/all-files/fa/FaTimes";
import {DropdownButton} from "../DropdownButton";
import {
  selectSelectedAreas,
  selectSensorLocations,
  setSelectedAreas
} from "../../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {LButton, LLabel, useSelectorAsState} from "../common";


export const AreaSelectionDropdowns = ({ showSelectedAreas = true, onChange, size }) => {
  const dispatch = useDispatch();

  const [selections, setSelections] = useSelectorAsState(selectSelectedAreas, setSelectedAreas, dispatch);

  const locations = useSelector(selectSensorLocations);

  const clearSelection = () => {
    setSelections({...selections, community: [], zip: [], ward: []});
  }
  const noSelection = selections?.zip?.length === 0 && selections?.community?.length === 0;
  const hasSelection = selections?.zip?.length > 0 || selections?.community?.length > 0;

  return(
    <>
      {(noSelection || !showSelectedAreas) && <Grid container size={size === 'small' ? 12 : 8}>
        <Grid size={4}>
          <DropdownButton onChange={(s) => onChange(s, 'community')}
                          ButtonComponent={LButton}
                          label={'Community'}
                          buttonProps={{ size }}
                          style={{ textTransform: 'capitalize' }}
                          menuStyle={{ textTransform: 'capitalize' }}
                          options={locations?.map(l => l.community)} />
        </Grid>
        <Grid size={8}>
          <DropdownButton onChange={(s) => onChange(s, 'zip')}
                          ButtonComponent={LButton}
                          label={'Zip code'}
                          buttonProps={{ size }}
                          options={locations?.map(l => l.zip)} />
        </Grid>
      </Grid>}

      {showSelectedAreas && (!noSelection || hasSelection) && <Grid container spacing={0} marginTop={'0.5rem'} alignItems={'center'}>
        <Grid>
          {selections?.community?.length > 0 && <span><LLabel>Community:</LLabel> {selections?.community?.[0]}</span>}
          {selections?.zip?.length > 0 && <span><LLabel>Zip code:</LLabel> {selections?.zip?.[0]}</span>}
        </Grid>
        <Grid size={1}>
          <LButton variant={'text'} size={'small'} onClick={clearSelection}><FaTimes /></LButton>
        </Grid>
      </Grid>}
    </>
  );
}
