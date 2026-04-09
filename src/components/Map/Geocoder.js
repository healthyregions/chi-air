import Grid from "@mui/material/Grid";
import {useCallback, useMemo, useState} from "react";
import {createSearchParams, useNavigate} from "react-router-dom";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import {FaSearch} from "react-icons/fa";
import Autocomplete from "@mui/material/Autocomplete";
import {debounce} from "@mui/material/utils";
import {AreaSelectionDropdowns} from "../VariablePanel/Panels/AreaSelectionDropdowns";

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {useDispatch, useSelector} from "react-redux";
import {selectSensorParameter, setSensorParameter} from "../../store/slices/sensorDataSlice";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const GeocoderContainer = styled(Grid)`
    .MuiAutocomplete-inputRoot {
        background:white;
        height:${({height}) => height||36}px;
        padding:0;
        border-radius: 100px;
    }
`;
const GeocoderHeader = styled.span`
    margin-left: .85rem;
    font-size: ${({ size }) => size === 'small' ? '14px' : '18px'};
    font-weight: 200;
    flex-direction: column;
    align-content: center;
    font-family: Space Grotesk;

    strong { font-weight: 600; }
`;

export const Geocoder = ({ showSelectedAreas = true, onDropdownChange, placeholder, pop = () => {}, style, size = 'small', extraButton = <></> }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const selectedParameter = useSelector(selectSensorParameter);
  const setSelectedParameter = (payload) => dispatch(setSensorParameter(payload));

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
    <GeocoderContainer style={style}>
      <Grid container spacing={0} alignItems={'center'} justifyContent={'space-between'}>
        <Grid size={8}>
          <GeocoderHeader size={size}><strong>Search</strong> any Chicago Address</GeocoderHeader>
        </Grid>
        {extraButton}
      </Grid>
      <Grid container spacing={0} alignItems="center" marginTop={0}>
        <Grid size={{ xs: 3 }}>
          <FormControl id="paramSelect" variant="outlined" fullWidth>
            <InputLabel htmlFor="paramSelect">Indicator</InputLabel>
            <Select
              variant={"outlined"}
              size={'small'}
              value={selectedParameter}
              onChange={(e) => setSelectedParameter(e.target.value)}
            >
              <MenuItem value="nowcast_aqi">AQI</MenuItem>
              <MenuItem value="mean_pm25">PM 2.5</MenuItem>
              {/*<MenuItem value="mean_no2">NO₂</MenuItem>*/}
              {/*<MenuItem value="mean_bc">BC</MenuItem>*/}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Autocomplete
            id="geocoder-search"
            style={{ width: '100%', borderRadius: '100px'}}
            freeSolo
            disableClearable
            filterOptions={(x) => x}
            autoComplete
            clearOnEscape
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
                margin="dense"
                style={{ borderRadius: '100px', border: '1px solid rgba(0, 88, 153, 1)' }}
                placeholder={placeholder}
                slotProps={{
                  input: { ...params.InputProps, type: 'search', startAdornment:
                      <FaSearch style={{color: 'rgba(0, 88, 153, 1)', marginLeft:'10px'}}></FaSearch>
                  }
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
      <Grid container justifyContent={'space-between'}>
        <AreaSelectionDropdowns showSelectedAreas={showSelectedAreas} onChange={onDropdownChange} size={size} pop={pop} />
      </Grid>
    </GeocoderContainer>
  );
}
