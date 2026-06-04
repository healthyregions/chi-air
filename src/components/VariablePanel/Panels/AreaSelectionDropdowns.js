import Grid from "@mui/material/Grid";
import {FaCaretDown, FaSearch, FaTimes} from "react-icons/fa";
import styled from "styled-components";
import {
  selectSelectedAreas,
  selectSensorLocations,
  setSelectedAreas
} from "../../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {flyToCenter, getBoundaries, LButton, LLabel, useSelectorAsState} from "../common";
import {useNavigate} from "react-router-dom";
import {useCallback, useMemo, useState} from "react";
import {selectMapParams, setMapParams} from "../../../store/slices/legacyStoreSlice";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import useMediaQuery from "@mui/material/useMediaQuery";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const HomeDropdownCard = styled.div`
  width: 16rem;
  max-width: 45rem;
  margin: 0 auto;
  z-index: 10;
  border-radius: 0.75rem;
  border: 1px solid #005899;
  background: #FFF;
  box-shadow: 2px 2px 4px 0 rgba(30, 30, 30, 0.05);
  //overflow: hidden;

  position: ${({ $largeScreen }) => $largeScreen ? 'absolute' : 'relative'};
  left: 0;
  right: 0;
`;

const HomeDropdownSearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem 1.25rem 0.75rem;
  color: #444444;
`;

const HomeDropdownDivider = styled.div`
  margin: 0 1.25rem;
  border-top: 2px solid #41B6E6;
`;

const HomeDropdownSearchInput = styled(InputBase)`
  flex: 1;
  color: #444444;
  font-family: Space Grotesk,serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;

  input::placeholder {
    color: #A8A8A8;
    opacity: 1;
  }
`;

const HomeDropdownOptions = styled(Box)`
  max-height: 23rem;
  overflow-y: auto;
  padding: 0.75rem 1.25rem 1.25rem;

  &::-webkit-scrollbar {
    width: 25px;
  }

  &::-webkit-scrollbar-thumb {
    background: #8DBBDD;
    border-radius: 2px;
      
    /* Use a transparent border to create the offset */
    border-left: 2px solid transparent;
    border-right: 20px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const HomeDropdownOption = styled.button`
  display: block;
  width: 100%;
  padding: 0.325rem 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: #444444;
  font-family: Space Grotesk,serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
`;

const HomeDropdownHighlight = styled.span`
  color: #005899;
`;

const HomeDropdownEmpty = styled.div`
  padding: 0.75rem 0 0.25rem;
  color: #444444;
  font-family: Space Grotesk,serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
`;

export const AreaSelectionDropdowns = ({ showSelectedAreas = true, onChange, size, variant = 'default' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const largeScreen = useMediaQuery('(min-width: 600px)');
  const mapParams = useSelector(selectMapParams);

  // Keep track of our anchor element
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;
  const [type, setType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selections, setSelections] = useSelectorAsState(selectSelectedAreas, setSelectedAreas, dispatch);

  const locations = useSelector(selectSensorLocations);

  // Handle user opening or closing the dropdown
  const handleOpen = (e, key) => {
    setAnchorEl(e?.currentTarget);
    setType(key);
    setSearchTerm('');
  }
  const handleClose = () => {
    setAnchorEl(null);
    setType(null);
    setSearchTerm('');
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
  const isHomeVariant = variant === 'home';

  const prettyTypeName = useCallback((t) => t === 'zip' ? isHomeVariant ? 'Zip code' : 'Zip' : t === 'community' ? 'Community' : 'Ward', [isHomeVariant]);

  const options = useMemo(() => {
    return [...new Set(locations?.filter(l => !!l[type])?.map(l => l[type]))];
  }, [type, locations]);

  // When displaying, we need to transform / pretty print our possible values
  const format = (value, type) => {
    if (type === 'ward') {
      return `Ward ${value}`;
    } else if (type === 'community') {
      // capitalize each word
      const words = value?.split(' ');
      return words?.map(word => {
        return word[0]?.toUpperCase() + word.substring(1)?.toLowerCase();
      })?.join(' ');
    }
    return value;
  }

  // When user selects an option, we need to undo the transformation above to select their choice
  const unformat = (value, type) => {
    if (type === 'ward') {
      return value.split(' ')?.[1];
    } else if (type === 'community') {
      return value?.toUpperCase()
    }
    return value;
  }

  const filteredOptions = useMemo(() => {
    const ops = options.map(o => o.split(' ').map(o => format(o, type)).join(' '));

    if (!searchTerm) {
      return type !== 'ward' ? ops.sort() : ops.sort((a, b) => {
        return Number(a?.split(' ')[1]) - Number(b?.split(' ')[1])
      });
    }

    const normalizedSearch = searchTerm.toLowerCase();
    return (type !== 'ward' ? ops.sort() : ops.sort((a, b) => {
      return Number(a?.split(' ')[1]) - Number(b?.split(' ')[1])
    })).filter((option) => option?.toLowerCase().includes(normalizedSearch));
  }, [options, searchTerm, type]);

  return(
    <>
      {(noSelection || !showSelectedAreas) && <Grid container fullWidth justifyContent={'center'} alignItems={'center'} columnGap={isHomeVariant ? 2 : 0} rowGap={isHomeVariant ? 1 : 0} direction={isHomeVariant ? 'column' : 'row'}>
        {[ 'community', 'zip', 'ward' ]?.map((key) => <Grid size key={key} textAlign={'center'}>
          <LButton
            id={`basic-button-${key}`}
            size={'small'}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(e) => handleOpen(e, key)}
            style={isHomeVariant ? {
              color: '#005899',
              fontFamily: 'Lexend,sans-serif',
              fontSize: '1.5rem',
              fontWeight: 500,
              lineHeight: 'normal',
              textTransform: 'none',
              padding: '0.25rem 0.5rem'
            } : undefined}
          >
            {prettyTypeName(key)} <FaCaretDown style={{ marginLeft: '2px' }} />
          </LButton>

          {type === key && <>
            <ClickAwayListener onClickAway={handleClose}>
              <HomeDropdownCard $largeScreen={largeScreen}>
                <HomeDropdownSearchRow>
                  <FaSearch style={{ color: '#005899', fontSize: '0.75rem' }} />
                  <HomeDropdownSearchInput
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search`}
                  />
                  <LButton variant={'text'} size={'small'} onClick={handleClose} style={{ minWidth: 0, padding: 0 }}>
                    <FaTimes style={{ color: '#005899', fontSize: '0.75rem' }} />
                  </LButton>
                </HomeDropdownSearchRow>
                <HomeDropdownDivider />
                <HomeDropdownOptions>
                  {filteredOptions.length > 0 ? filteredOptions.map((option) => {
                    const matches = match(option, searchTerm, { insideWords: true });
                    const parts = parse(option, matches);

                    return (
                      <HomeDropdownOption key={option} type="button" onClick={() => handleChange(unformat(option, type), type)}>
                        {parts.map((part, index) => (part.highlight ? (
                          <HomeDropdownHighlight key={index}>{part.text}</HomeDropdownHighlight>
                        ) : (
                          <span>{part.text}</span>
                        )))}
                      </HomeDropdownOption>
                    );
                  }) : <HomeDropdownEmpty>No options</HomeDropdownEmpty>}
                </HomeDropdownOptions>
              </HomeDropdownCard>
            </ClickAwayListener>
          </>}
        </Grid>)}
      </Grid>}

      {showSelectedAreas && (!noSelection || hasSelection) && <Grid container width={'100%'} spacing={0} margin={'0.3rem'} alignItems={'center'} display={'flex'} flexDirection={"row"} justifyContent={'space-between'} fontFamily={'Lexend'}>
        <Grid size>
          {selections?.community?.length > 0 && <span><LLabel>Community:</LLabel> {format(selections?.community?.[0], 'community')}</span>}
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
