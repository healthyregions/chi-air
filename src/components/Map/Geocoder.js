import Grid from "@mui/material/Grid";
import {useCallback, useMemo, useState} from "react";
import {createSearchParams, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {colors} from "../../config";
import TextField from "@mui/material/TextField";
import {FaSearch} from "react-icons/fa";
import Autocomplete from "@mui/material/Autocomplete";
import {debounce} from "@mui/material/utils";
import {AreaSelectionDropdowns} from "../VariablePanel/Panels/AreaSelectionDropdowns";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const GeocoderContainer = styled.div`
    flex:auto;
    width:100%;
    .MuiFormControl-root {
        margin:0;
        background: rgba( 255, 255, 255, 0.85 );
        backdrop-filter: blur( 20px );
        -webkit-backdrop-filter: blur( 20px );
    }

    .MuiAutocomplete-inputRoot {
        background:white;
        height:${({height}) => height||36}px;
        padding:0;
        border-radius: 100px;
    }
    .MuiAutocomplete-inputRoot[class*="MuiInput-root"] .MuiAutocomplete-input:first-child {
        padding:0;
        color:${colors.black};
    }
    .MuiFormControl-root .MuiInputBase-adornedEnd:before {
        display: block;
        content: ' ';
        background-image: url("${process.env.PUBLIC_URL}/assets/img/search.svg");
        background-size: 20px 20px;
        height: 20px;
        width: 20px;
        transform:translate(8px, -9px);
        border-bottom:none !important;
        border:1px solid ${colors.forest};
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

  const onChange = useCallback((location) => {
    if (location?.center !== undefined) {
      navigate({
        pathname: "/map",
        search: createSearchParams(
          ['lon', 'lat'].reduce((obj, k, i) =>
            ({...obj, [k]: location?.center?.[i]}), {})
        ).toString()
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

  const url = useMemo(
    () => `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchState.value}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=US&autocomplete=true&types=region%2Cdistrict%2Cpostcode%2Clocality%2Cplace%2Caddress&bbox=-88.28487843194713%2C41.54199009379835%2C-87.52216519803295%2C42.16483530634653`,
    [searchState.value]
  );
  const queryMapbox = useMemo(
    () =>
      debounce((text, callback) => {
        (async (text, callback) => fetch(url).then(r => r.json()).then(r => {
          console.log("result:", r);
          callback(r.features);
        }))(text, callback)
      }, 200),
    // eslint-disable-next-line
    [url],
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
      <Grid container spacing={0} alignItems="center">
        <Autocomplete
          id="geocoder-search"
          style={{ width: '100%', borderRadius: '100px' }}
          freeSolo
          disableClearable
          filterOptions={(x) => x}
          autoComplete
          clearOnEscape
          inputValue={searchState.value}
          options={searchState.results}
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

          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
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
      <Grid container justifyContent={'space-between'}>
        <AreaSelectionDropdowns showSelectedAreas={showSelectedAreas} onChange={onDropdownChange} size={size} pop={pop} />
      </Grid>
    </GeocoderContainer>
  );
}
