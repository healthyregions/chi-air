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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useDispatch, useSelector} from "react-redux";
import {selectSensorParameter, setSensorParameter} from "../../store/slices/sensorDataSlice";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const GeocoderContainer = styled(Grid)``;

export const Geocoder = ({ variant = 'standard', showSelectedAreas = true, onDropdownChange, placeholder, pop = () => {}, style, size = 'small', extraButton = <></> }) => {
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
      <Grid container spacing={0} alignItems="center" marginTop={0}>
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            id="geocoder-search"
            style={{ borderRadius: variant === 'rounded' ? '100ox' : '5px' }}
            fullWidth
            size={size}
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
                style={{
                  borderRadius: variant === 'rounded' ? '100ox' : '5px',
                  border: '1px solid rgba(0, 88, 153, 0.5)'
                }}
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
      {/*<Grid container justifyContent={'space-between'}>*/}
      {/*  <AreaSelectionDropdowns showSelectedAreas={showSelectedAreas} onChange={onDropdownChange} size={size} pop={pop} />*/}
      {/*</Grid>*/}
    </GeocoderContainer>
  );
}
