import Grid from "@mui/material/Grid";
import {FaTimes} from "react-icons/fa";
import {DropdownButton} from "../DropdownButton";
import {
  selectSelectedAreas,
  selectSensorLocations,
  setSelectedAreas
} from "../../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {LButton, LLabel, useSelectorAsState} from "../common";
import centroid from "@turf/centroid";
import {createSearchParams, useNavigate} from "react-router-dom";

export const getBoundariesPath = (key) => {
  switch (key) {
    case 'community':
      return '/geojson/community_areas.geojson';
    case 'zip':
      return '/geojson/chiZipCodes.geojson';
    case 'ward':
      return '/geojson/boundaries_wards_2015_.geojson';
    default:
      console.error('Unrecognized selection key encountered: ' + key)
  }
};

const getBoundaries = (key) => {
  return fetch(getBoundariesPath(key));
}

export const getFeature = (boundaries, name, key) => {
  return boundaries?.features?.find(b => b?.properties[key] === name);
}

const flyToCenter = (boundaries, name, key, navigate) => {
  const feature = getFeature(boundaries, name, key);
  if (!feature) {
    console.error('Feature not found:', `${key}=${name}`);
    return;
  }
  const centerPoint = centroid(feature);
  const [lon, lat] = centerPoint?.geometry?.coordinates;
  if (!lon || !lat) {
    console.error(`Failed to navigate to user selection ${key}=${name} - Invalid lon/lat:`, [lon, lat]);
    return;
  }

  navigate({
    pathname: "/map",
    search: createSearchParams({
      lon,
      lat,
      key,
      z: 12
    }).toString()
  });
}


export const AreaSelectionDropdowns = ({ showSelectedAreas = true, onChange, size }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selections, setSelections] = useSelectorAsState(selectSelectedAreas, setSelectedAreas, dispatch);

  const locations = useSelector(selectSensorLocations);

  // Runs user's onChange, then our magic handling to fly to the center
  const handleChange = async (name, key) => {
    onChange(name, key);
    const boundariesResponse = await getBoundaries(key);
    const boundaries = await boundariesResponse.json();
    console.log(`Boundaries fetched for ${key}:`, boundaries);
    flyToCenter(boundaries, name, key, navigate);
  }

  const clearSelection = () => {
    setSelections({...selections, community: [], zip: [], ward: []});
  }
  const noSelection = selections?.zip?.length === 0 && selections?.community?.length === 0;
  const hasSelection = selections?.zip?.length > 0 || selections?.community?.length > 0;

  return(
    <>
      {(noSelection || !showSelectedAreas) && <Grid container size={size === 'small' ? 12 : 8}>
        <Grid size={4}>
          <DropdownButton onChange={(s) => handleChange(s, 'community')}
                          ButtonComponent={LButton}
                          label={'Community'}
                          buttonProps={{ size }}
                          style={{ textTransform: 'capitalize' }}
                          menuStyle={{ textTransform: 'capitalize' }}
                          options={locations?.map(l => l.community)} />
        </Grid>
        <Grid size={8}>
          <DropdownButton onChange={(s) => handleChange(s, 'zip')}
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
