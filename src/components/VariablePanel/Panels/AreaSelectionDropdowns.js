import Grid from "@mui/material/Grid";
import {FaCaretDown, FaTimes} from "react-icons/fa";
import {
  selectSelectedAreas,
  selectSensorLocations,
  setSelectedAreas
} from "../../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {flyToCenter, getBoundaries, LButton, LLabel, useSelectorAsState} from "../common";
import {useNavigate} from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {useCallback, useMemo, useState} from "react";
import {selectMapParams, setMapParams} from "../../../store/slices/legacyStoreSlice";

export const AreaSelectionDropdowns = ({ showSelectedAreas = true, onChange, size }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mapParams = useSelector(selectMapParams);

  // Keep track of our anchor element
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;
  const [type, setType] = useState(null);

  const [selections, setSelections] = useSelectorAsState(selectSelectedAreas, setSelectedAreas, dispatch);

  const locations = useSelector(selectSensorLocations);

  // Handle user opening or closing the dropdown
  const handleOpen = (e, key) => {
    setAnchorEl(e?.currentTarget);
    setType(key);
  }
  const handleClose = () => {
    setAnchorEl(null);
    setType(null);
  }

  // Runs user's onChange, then our magic handling to fly to the center
  const handleChange = async (name, key) => {
    onChange(name, key);
    const boundariesResponse = await getBoundaries(key);
    const boundaries = await boundariesResponse.json();
    flyToCenter(boundaries, name, key, navigate);
    const overlay_id = key === 'community' ? 'community_areas' : (key === 'zip' ? 'zip_codes' : 'wards');
    dispatch(setMapParams({
      ...mapParams,
      overlays: [
        ...mapParams.overlays
          ?.filter(k => k !== 'community_areas' && k !== 'zip_codes' && k !== 'wards'),
        overlay_id
      ]
    }));
    handleClose();
  }

  const clearSelection = () => {
    setSelections({...selections, community: [], zip: [], ward: []});
  }
  const noSelection = selections?.zip?.length === 0 && selections?.community?.length === 0 && selections?.ward?.length === 0;
  const hasSelection = selections?.zip?.length > 0 || selections?.community?.length > 0 || selections?.ward?.length > 0;

  const prettyTypeName = useCallback((t) => t === 'zip' ? 'Zip code' : t === 'community' ? 'Community' : 'Ward', []);

  const options = useMemo(() => {
    return [...new Set(locations?.filter(l => !!l[type])?.map(l => l[type]))];
  }, [type, locations]);

  console.log(locations)

  return(
    <>
      {(noSelection || !showSelectedAreas) && <Grid container width={'100%'} justifyContent={'space-around'} alignItems={'center'}>
        {!type && [ 'community', 'zip', 'ward' ]?.map((key) => <Grid size key={key}>
          <LButton
            id={`basic-button-${key}`}
            size={'small'}

            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(e) => handleOpen(e, key)}
          >
            {prettyTypeName(key)} <FaCaretDown style={{ marginLeft: '2px' }} />
          </LButton>
        </Grid>)}

        {type && <Grid size={12} margin={'0 1rem'} padding={0} alignItems={'center'}>
          <Autocomplete
            options={options.sort()}
            openOnFocus
            onBlur={handleClose}
            autoComplete
            onChange={(e, s) => handleChange(s, type)}
            slotProps={{ listbox: { sx: { fontFamily: 'Lexend' } } }}
            renderInput={params => (
              <TextField
                {...params}
                margin={'none'}
                variant="filled"
                autoFocus={true}
                InputProps={{ ...params.InputProps, startAdornment: (<></>) }}
                placeholder={`Search ${prettyTypeName(type)} here...`}
                fullWidth
              />
            )}
          />
        </Grid>}
      </Grid>}

      {showSelectedAreas && (!noSelection || hasSelection) && <Grid container width={'100%'} spacing={0} marginTop={'0.5rem'} alignItems={'center'} display={'flex'} flexDirection={"row"} justifyContent={'space-between'} fontFamily={'Lexend'}>
        <Grid size>
          {selections?.community?.length > 0 && <span><LLabel>Community:</LLabel> {selections?.community?.[0]}</span>}
          {selections?.zip?.length > 0 && <span><LLabel>Zip code:</LLabel> {selections?.zip?.[0]}</span>}
          {selections?.ward?.length > 0 && <span><LLabel>Ward:</LLabel> {selections?.ward?.[0]}</span>}
        </Grid>
        <Grid size={2}>
          <LButton variant={'text'} size={'small'} onClick={clearSelection}><FaTimes /></LButton>
        </Grid>
      </Grid>}
    </>
  );
}
