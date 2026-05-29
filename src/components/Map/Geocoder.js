import Grid from "@mui/material/Grid";
import {useCallback, useMemo, useState} from "react";
import {createSearchParams, useNavigate} from "react-router-dom";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import {FaSearch, FaTimes} from "react-icons/fa";
import Autocomplete from "@mui/material/Autocomplete";
import {debounce} from "@mui/material/utils";
import {AreaSelectionDropdowns} from "../VariablePanel/Panels/AreaSelectionDropdowns";

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const GeocoderContainer = styled(Grid)`
    width: 100%;
    .MuiAutocomplete-inputRoot {
        background:white;
        height:${({height, $variant}) => $variant === 'home' ? 48 : height||36}px;
        padding:0;
        border-radius: ${({$variant}) => $variant === 'home' ? '100px' : '5px'};
        font-family: Space Grotesk,serif;
    }
    .MuiOutlinedInput-root {
        border-radius: ${({$variant}) => $variant === 'home' ? '100px' : '5px'};
    }
    .MuiOutlinedInput-root fieldset {
        border-color: rgba(0, 88, 153, 1);
    }
`;
const GeocoderHeader = styled.span`
    margin-left: ${({ $variant }) => $variant === 'home' ? 0 : '.85rem'};
    font-size: ${({ size, $variant }) => $variant === 'home' ? '2rem' : (size === 'small' ? '14px' : '18px')};
    font-weight: ${({ $variant }) => $variant === 'home' ? 400 : 200};
    flex-direction: column;
    align-content: center;
    font-family: Space Grotesk,serif;
    color: ${({ $variant }) => $variant === 'home' ? '#444444' : 'inherit'};
    text-align: ${({ $variant }) => $variant === 'home' ? 'center' : 'left'};

    strong { font-weight: ${({ $variant }) => $variant === 'home' ? 700 : 600}; }
`;

export const Geocoder = ({ showSelectedAreas = true, onDropdownChange, placeholder, pop = () => {}, style, size = 'small', variant = 'default' }) => {
  const navigate = useNavigate();

  const onChange = useCallback((location) => {
    if (location?.center !== undefined) {
      navigate({
        pathname: "/map",
        search: createSearchParams({
          lon: location?.center?.[0],
          lat: location?.center?.[1],
          z: 13
        }).toString()
      });
    }
  }, [navigate]);

  const [searchState, setSearchState] = useState({ results: [], value: '' })
  const isHomeVariant = variant === 'home';

  const loadResults = (results) => {
    setSearchState(prev => ({ ...prev, results }));
  }

  const clearInput = () => {
    setSearchState({ results: [], value: '' });
  }

  const queryMapbox = useMemo(
    () =>
      debounce((text, callback) => {
        text && ((text, callback) =>
          fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=US&autocomplete=true&types=region%2Cdistrict%2Cpostcode%2Clocality%2Cplace%2Caddress&bbox=-88.28487843194713%2C41.54199009379835%2C-87.52216519803295%2C42.16483530634653`
          ).then(r => r.json()).then(r => {
            callback(r.features);
          }))(text, callback)
      }, 200),
    [],
  );

  const onInputChange = async (e) => {
    if (e.target.value.length > 3) {
      queryMapbox(e.target.value, (r) => loadResults(r))
    }
  }

  return(
    <GeocoderContainer style={style} $variant={variant}>
      <Grid container spacing={0} alignItems={'center'} justifyContent={isHomeVariant ? 'center' : 'space-between'}>
        <Grid size={12} style={isHomeVariant ? { textAlign: 'center' } : undefined}>
          <GeocoderHeader size={size} $variant={variant}>
            <><strong>Search</strong> any Chicago Address</>
          </GeocoderHeader>
        </Grid>
      </Grid>
      <Grid container spacing={0} alignItems="center" marginTop={isHomeVariant ? '1.5rem' : 0} justifyContent={isHomeVariant ? 'center' : 'flex-start'}>
        <Grid size={isHomeVariant ? { xs: 12, md: 8 } : { xs: 12 }}>
          <Autocomplete
            id="geocoder-search"
            style={{ width: '100%', borderRadius: isHomeVariant ? '100px' : '5px' }}
            freeSolo
            disableClearable
            filterOptions={(x) => x}
            autoComplete
            clearOnEscape
            clearIcon={<div style={{ display:'none', cursor: 'initial' }}></div>}
            inputValue={searchState.value}
            options={searchState.results || []}
            getOptionLabel={option => option.place_name}
            onChange={(source, selectedOption) => {
              clearInput();
              onChange(selectedOption);
            }}
            // renderOption={(option, idx) => <React.Fragment>
            //     <StyledOption id={idx}>
            //         <span>{!!option.key && option.key.split(',')[0]}</span>
            //         <span>{!!option.key && option.key.split(',').slice(1,).join(', ')}</span>
            //     </StyledOption>
            // </React.Fragment>
            // }
            renderOption={(props, option, { inputValue }) => {
              const matches = match(option.place_name, inputValue);
              const parts = parse(option.place_name, matches);

              return (
                <li {...props} key={props.key}>
                  <div style={{ paddingLeft: '1rem' }}>
                    {parts?.map((part, index) => (
                      <span
                        key={index}
                        style={{
                          color: part.highlight ? '#444444' : '#005899',
                          fontWeight: part.highlight ? 700 : 400,
                        }}
                      >
                {part.text}
              </span>
                    ))}
                  </div>
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin={isHomeVariant ? "none" : "dense"}
                style={{ borderRadius: isHomeVariant ? '100px' : '5px', border: '1px solid rgba(0, 88, 153, 1)' }}
                placeholder={placeholder}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment:
                      <FaSearch style={{color: 'rgba(0, 88, 153, 1)', marginLeft:'1.25rem', marginRight: '0.5rem' }}></FaSearch>,
                    endAdornment:
                      searchState?.value && <FaTimes style={{ color: 'rgba(0, 88, 153, 1)', cursor: 'pointer', marginLeft: '8px', marginRight: '20px' }}
                                                     onClick={() => setSearchState({ value: '' })} />

                  },
                }}
                onChange={(e) => {
                  setSearchState(prev => ({
                    ...prev,
                    value: e.target.value,
                  }));
                  onInputChange(e)}
                }
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent={isHomeVariant ? 'center' : 'space-between'} marginTop={isHomeVariant ? '0.75rem' : 0}>
        <AreaSelectionDropdowns showSelectedAreas={showSelectedAreas} onChange={onDropdownChange} size={size} pop={pop} variant={variant} />
      </Grid>
    </GeocoderContainer>
  );
}
