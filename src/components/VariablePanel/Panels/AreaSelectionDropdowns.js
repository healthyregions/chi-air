import Grid from "@mui/material/Grid";
import {FaCaretDown, FaSearch, FaTimes} from "react-icons/fa";
import styled from "styled-components";
import {
  selectSelectedAreas,
  selectSensorLocations,
  setSelectedAreas
} from "../../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {flyToCenter, getBoundaries, LButton, LLabel, SGBody, useSelectorAsState} from "../common";
import {useNavigate} from "react-router-dom";
import {useCallback, useMemo, useState} from "react";
import {selectMapParams, setMapParams} from "../../../store/slices/legacyStoreSlice";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import useMediaQuery from "@mui/material/useMediaQuery";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import {Trans, useTranslation} from "react-i18next";

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
  left: ${({ $isHomeVariant, $largeScreen, $type }) => {
      if (!$isHomeVariant || !$largeScreen) return 0;
      if ($type === 'community') return 0;
      if ($type === 'ward') return '15rem';
      if ($type === 'zip') return '12rem';
      return 0;
  }};
  right: ${({ $isHomeVariant, $largeScreen, $type }) => {
      if (!$isHomeVariant || !$largeScreen) return 0;
      if ($type === 'community') return '15rem';
      if ($type === 'ward') return 0;
      if ($type === 'zip') return '8rem';
      return 0;
  }};
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

const ASDHeader = styled(SGBody)`
    padding: .4rem 0 0 .4rem;
    font-size: 12px;
    font-weight: ${({ $variant }) => $variant === 'home' ? 400 : 200};
    font-family: Space Grotesk,serif;
    color: ${({ $variant }) => $variant === 'home' ? '#444444' : 'inherit'};
    text-align: ${({ $variant }) => $variant === 'home' ? 'center' : 'left'};

    strong { font-weight: ${({ $variant }) => $variant === 'home' ? 700 : 600}; }
`;

export const AreaSelectionDropdowns = ({ showSelectedAreas = true, onChange, size, variant = 'default' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const largeScreen = useMediaQuery('(min-width: 600px)');
  const mapParams = useSelector(selectMapParams);
  const { t } = useTranslation('panel');

  // Keep track of our anchor element
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;
  const [type, setType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selections, setSelections] = useSelectorAsState(selectSelectedAreas, setSelectedAreas, dispatch);

  const locations = useSelector(selectSensorLocations);

  // Build a map of community name => comarea id
  const comareaIdMap = {};
  locations?.forEach(l => {
    // Ignore null/invalid comarea ids
    l?.comarea && (comareaIdMap[l?.community] = l?.comarea);
  });

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

  const prettyTypeName = useCallback((key) => key === 'zip'
    ? (isHomeVariant ? t('areaSelection.tabs.zipCode') : t('areaSelection.tabs.zip'))
    : key === 'community' ? t('areaSelection.tabs.community') : t('areaSelection.tabs.ward'), [isHomeVariant, t]);

  const options = useMemo(() => {
    return [...new Set(locations?.filter(l => !!l[type])?.map(l => l[type]))];
  }, [type, locations]);

  // When displaying, we need to transform / pretty print our possible values
  // (display only - selection always uses the raw value, see filteredOptions)
  const format = useCallback((value, type) => {
    if (type === 'ward') {
      return t('areaSelection.wardOption', { number: value });
    } else if (type === 'community') {
      // capitalize each word
      const words = value?.split(' ');
      return words?.map(word => {
        return word[0]?.toUpperCase() + word.substring(1)?.toLowerCase();
      })?.join(' ');
    }
    return value;
  }, [t]);

  // Each option keeps its raw value (used for selection / lookups) next to its display label,
  // so translated labels (e.g. "Distrito electoral 12") never need to be parsed back.
  const filteredOptions = useMemo(() => {
    const ops = options.map(raw => ({ raw, label: format(raw, type) }));
    const sorted = type !== 'ward'
      ? ops.sort((a, b) => a.label < b.label ? -1 : a.label > b.label ? 1 : 0)
      : ops.sort((a, b) => Number(a.raw) - Number(b.raw));

    if (!searchTerm) {
      return sorted;
    }

    const normalizedSearch = searchTerm.toLowerCase();
    return sorted.filter((option) => option?.label?.toLowerCase().includes(normalizedSearch));
  }, [options, searchTerm, type, format]);

  return(
    <>
      {
        !isHomeVariant && <Grid container fullWidth>
          <Grid size>
            <ASDHeader $variant={variant}><Trans t={t} i18nKey="areaSelection.findHeader" components={{ strong: <strong /> }} /></ASDHeader>
          </Grid>
        </Grid>
      }

      {(noSelection || !showSelectedAreas) && <Grid container fullWidth justifyContent={'center'} alignItems={'center'} columnGap={isHomeVariant ? 2 : 0} rowGap={isHomeVariant ? 1 : 0} direction={isHomeVariant ? (largeScreen ? 'row' : 'column') : 'row'}>
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
              textDecoration: type===key ? 'underline' : 'none',
              borderRadius: '0.75rem',
              lineHeight: 'normal',
              textTransform: 'none',
              padding: '0.25rem 0.5rem'
            } : undefined}
          >
            {prettyTypeName(key)} <FaCaretDown style={{ marginLeft: '2px' }} />
          </LButton>

          {type === key && <>
            <ClickAwayListener onClickAway={handleClose}>
              <HomeDropdownCard $type={type} $isHomeVariant={isHomeVariant} $largeScreen={largeScreen}>
                <HomeDropdownSearchRow>
                  <FaSearch style={{ color: '#005899', fontSize: '0.75rem' }} />
                  <HomeDropdownSearchInput
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('areaSelection.search')}
                  />
                  <LButton variant={'text'} size={'small'} onClick={handleClose} style={{ minWidth: 0, padding: 0 }} aria-label={t('areaSelection.close')}>
                    <FaTimes style={{ color: '#005899', fontSize: '0.75rem' }} />
                  </LButton>
                </HomeDropdownSearchRow>
                <HomeDropdownDivider />
                <HomeDropdownOptions>
                  {filteredOptions.length > 0 ? filteredOptions.map(({ raw, label }) => {
                    const matches = match(label, searchTerm, { insideWords: true });
                    const parts = parse(label, matches);

                    return (
                      <HomeDropdownOption key={raw} type="button" onClick={() => handleChange(raw, type)}>
                        <Grid container justifyContent={'space-between'} flexWrap={'nowrap'}>
                          <Grid size>
                            {parts.map((part, index) => (part.highlight ? (
                              <HomeDropdownHighlight key={index}>{part.text}</HomeDropdownHighlight>
                            ) : (
                              <span key={index}>{part.text}</span>
                            )))}
                          </Grid>
                          <Grid size={1}>{comareaIdMap[raw]}</Grid>
                        </Grid>
                      </HomeDropdownOption>
                    );
                  }) : <HomeDropdownEmpty>{t('areaSelection.noOptions')}</HomeDropdownEmpty>}
                </HomeDropdownOptions>
              </HomeDropdownCard>
            </ClickAwayListener>
          </>}
        </Grid>)}
      </Grid>}

      {showSelectedAreas && (!noSelection || hasSelection) && <Grid container width={'100%'} spacing={0} margin={'0.3rem'} alignItems={'center'} display={'flex'} flexDirection={"row"} justifyContent={'space-between'} fontFamily={'Lexend'}>
        <Grid size>
          {selections?.community?.length > 0 && <span><LLabel>{t('areaSelection.labels.community')}</LLabel> {format(selections?.community?.[0], 'community')} ({comareaIdMap[selections?.community?.[0]]})</span>}
          {selections?.zip?.length > 0 && <span><LLabel>{t('areaSelection.labels.zipCode')}</LLabel> {selections?.zip?.[0]}</span>}
          {selections?.ward?.length > 0 && <span><LLabel>{t('areaSelection.labels.ward')}</LLabel> {selections?.ward?.[0]}</span>}
        </Grid>
        <Grid size={2}>
          <LButton variant={'text'} size={'small'} onClick={clearSelection} aria-label={t('areaSelection.clear')}><FaTimes /></LButton>
        </Grid>
      </Grid>}
    </>
  );
}
