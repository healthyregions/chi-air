import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ListSubheader from '@mui/material/ListSubheader';

import styled from "styled-components";

// import Tooltip from './tooltip';
import { Gutter } from "../../styled_components";
import { changeVariable, setMapParams, setPanelState} from "../../actions";
import {colors, variablePresets, dataDescriptions, parsedOverlays, pm2_5ColorMap} from "../../config";
import * as SVG from "../../config/svg";
import {FormControl} from "@mui/material";

const VariablePanelContainer = styled.div`
  position: fixed;
  left: 10px;
  top: 60px;
  height: auto;
  min-width: 200px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 2px 0px 5px ${colors.gray}44;
  border: 1px solid ${colors.chicagoBlue};
  padding: 0;
  box-sizing: border-box;
  transition: 250ms all;
  font-fmaily: "Roboto", sans-serif;
  color: ${colors.black};
  z-index: 50;
  // border-radius:20px;
  &.hidden {
    transform: translateX(calc(-100% - 20px));
    @media (max-width: 600px) {
      transform: translateX(calc(-100% - 30px));
    }
  }
  h1,
  h2,
  h3,
  h4 {
    font-family: "Roboto", sans-serif;
    margin: 0 0 10px 0;
  }
  p {
    font-family: "Lora", serif;
    margin: 10px 0;
  }
  @media (max-width: 1024px) {
    min-width: 50vw;
  }
  @media (max-width: 600px) {
    width: calc(100% - 1em);
    top: calc(1em + 45px);
    height: calc(100% - 6em);
    left: 0.5em;
    display: ${(props) => (props.otherPanels ? "none" : "initial")};
    padding-top: 2em;
  }
  button#showHideLeft {
    position: absolute;
    left: 95%;
    top: 20px;
    width: 40px;
    height: 40px;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    background-color: ${colors.white};
    box-shadow: 2px 0px 5px ${colors.gray}88;
    outline: none;
    border: 1px solid ${colors.chicagoBlue};
    // border-radius:20px;
    cursor: pointer;
    transition: 500ms all;
    svg {
      width: 20px;
      height: 20px;
      margin: 10px 0 0 0;
      @media (max-width: 600px) {
        margin: 5px;
      }
      fill: ${colors.gray};
      transform: rotate(0deg);
      transition: 500ms all;
      .cls-1 {
        fill: none;
        stroke-width: 6px;
        stroke: ${colors.gray};
      }
    }
    :after {
      opacity: 0;
      font-weight: bold;
      content: "Variables";
      color: ${colors.gray};
      position: relative;
      right: -50px;
      top: -22px;
      transition: 500ms all;
      z-index: 4;
    }
    @media (max-width: 768px) {
      top: 120px;
    }
    @media (max-width: 600px) {
      left: calc(100% - 3em);
      width: 3em;
      height: 3em;
      top: 0;
      :after {
        display: none;
      }
    }
  }
  button#showHideLeft.hidden {
    left: calc(100% + 20px);
    @media (max-width: 600px) {
      left: calc(100% + 2.5em);
    }
    svg {
      transform: rotate(90deg);
    }
    :after {
      opacity: 1;
    }
  }
//   user-select: none;
`;

const ControlsContainer = styled.div`
  max-height: 80vh;
  max-width: 25rem;
  overflow-y: scroll;
  padding: 20px;

  @media (max-height: 899px) {
    padding: 20px 20px 10vh 20px;
  }

  @media (max-width: 600px) {
    width: 100%;
    max-height: 100%;
    padding: 0 10px 25vh 10px;
  }
  p.data-description {
    max-width: 40ch;
    line-height: 1.3;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${colors.white};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: url("${process.env.PUBLIC_URL}/icons/grip.png"),
      ${colors.gray}55;
    background-position: center center;
    background-repeat: no-repeat, no-repeat;
    background-size: 50%, 100%;
    transition: 125ms all;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: url("${process.env.PUBLIC_URL}/icons/grip.png"),
      ${colors.darkgray}99;
    background-position: center center;
    background-repeat: no-repeat, no-repeat;
    background-size: 50%, 100%;
  }
`

const VariablePanel = (props) => {
  const dispatch = useDispatch();

  const mapParams = useSelector((state) => state.mapParams);
  const panelState = useSelector((state) => state.panelState);

  const [lastUpdated, setLastUpdated] = useState(null)

  // Only update overlays when variable first changes
  // This allows the user to disable the default overlays, if they desire
  const [variableChanged, setVariableChanged] = useState(true);

  useEffect(() => {
    setVariableChanged(false);
    // If user selects Displacement Pressure, automatically apply the Non-residential Overlay
    if (variableChanged && (mapParams.variableName?.toLowerCase().includes('temperature') || mapParams.variableName?.toLowerCase().includes('heat index'))) {
      if (!mapParams.overlays?.includes('cooling-centers')) {
        dispatch(setMapParams({ overlays: [ ...mapParams.overlays, 'cooling-centers' ]}));
      }
    }
    // If user selects one of the Heat Indicator variables, automatically apply the Cooling Centers Overlay
    if (variableChanged && mapParams.variableName === 'Displacement Pressure') {
      if (!mapParams.overlays?.includes('non-res')) {
        dispatch(setMapParams({ overlays: [ ...mapParams.overlays, 'non-res' ]}));
      }
    }
  }, [mapParams, dispatch, variableChanged]);

  fetch("https://chicago-aq.s3.us-east-2.amazonaws.com/latest.geojson")
    .then((response) => response.json())
    .then((data) => {
      const date = new Date(data.timestamp)
      setLastUpdated(date)
  })

  const handleMapOverlay = (overlays) => {
    let prevOverlays = mapParams.overlays;

    // If "None" is clicked, remove all other overlays
    if ((!prevOverlays.includes('None') && overlays.includes('None')) || !overlays.length) {
      overlays = ['None'];
    }

    // If "None" was previously selected and something else is chosen, then de-select "None"
    if (prevOverlays.includes('None') && overlays.find((o) => o !== 'None')) {
      overlays.splice(overlays.indexOf('None'), 1);
    }

    dispatch(
      setMapParams({
        overlays: overlays,
      })
    );
  };

  const handleOpenClose = () => {
    if (panelState.variables) {
      dispatch(setPanelState({ variables: false }));
    } else {
      dispatch(setPanelState({ variables: true }));
    }
  };

  const handleVariable = (e) => {
    setVariableChanged(true);
    dispatch(changeVariable(variablePresets[e.target.value]));
  }

  return (
    <VariablePanelContainer
      className={panelState.variables ? "" : "hidden"}
      otherPanels={panelState.info}
      id="variablePanel"
    >
      <ControlsContainer>
        <h2>Air Quality</h2>
        <p className="data-description">
          Points on the map show PM 2.5 NowCast <strong>Mass Concentration</strong> values from our sensor network.
        </p>
        { Object.entries(pm2_5ColorMap).map(([key, color]) => (
          <div style={{ display: "flex", margin:'.25em 0' }}>
            <span
                key={`overlay-key-${key}-${color}`}
                style={{
                  backgroundColor: `rgb(${color.join(",")})`,
                  width: 16,
                  height: 16,
                }}
            ></span>
              <p style={{padding:0, margin:'0 0 0 .25em'}}>{key}</p>
            </div>
        ))}
        <p className="data-description">
          {lastUpdated ? `last updated: ${lastUpdated}` : "loading data..."}
        </p>
        <h2>Comparison Variables</h2>
        <FormControl id="newVariableSelect" variant="filled">
          <InputLabel htmlFor="newVariableSelect">Variable</InputLabel>
          <Select
            value={mapParams.variableName}
            onChange={handleVariable}
            MenuProps={{ id: "variableMenu" }}
          >
            {Object.keys(variablePresets).map((variable,i) => (
              variable.includes("HEADER::")
               ? <ListSubheader key={`list-header-${i}`}>{variable.split("HEADER::")[1]}</ListSubheader>
               : <MenuItem value={variable} key={`variable-menu-item-${i}`}>
                {variable}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <p className="data-description">
          {dataDescriptions[mapParams.variableName]}
        </p>
        <div style={{ margin: '1rem 0 0.5rem' }}>
            <span style={{ color: colors.pink }}>Overlays:</span> {mapParams.overlays?.map((selectedOverlay, index) => <>
              {parsedOverlays.map((parsedOverlay, i) => <div key={`overlays-enabled-list-${i}`}>
                { selectedOverlay === parsedOverlay?.id && <span style={{ color: colors.darkgray }} key={`overlay-description-${selectedOverlay}`}>
                  <span style={{ display: index === 0 ? 'none' : 'inline' }}>, </span>{parsedOverlay?.displayName}</span> }
              </div>)}
            </>)}
          </div>

        <Gutter h={20} />

        <h2>Data Overlay</h2>
        <FormControl variant="filled">
          <InputLabel htmlFor="overlay-select">Overlay</InputLabel>
          <Select
            id="overlay-select"
            value={mapParams.overlays}
            onChange={(e) => handleMapOverlay(e.target.value)}
            multiple={true}
            style={{ minWidth: '200px' }}
          >
            <MenuItem value="None" key={"None"}>
              None
            </MenuItem>
            {
              parsedOverlays?.map((overlay) =>
                  <MenuItem value={overlay.id} key={overlay.id}>
                    {overlay.displayName}
                  </MenuItem>
              )
            }
          </Select>
        </FormControl>
        {mapParams.overlays.map((selectedOverlay, index) => <div key={`overlay-legend-container-${index}`}>
          {parsedOverlays.map((parsedOverlay, subindex) => {
            const fillColor = JSON.parse(parsedOverlay?.fillColor);
            return (<>
            { selectedOverlay === parsedOverlay?.id && parsedOverlay?.fillColor && <div key={`overlay-legend-${selectedOverlay}-${index}-${subindex}`} style={{ display: "flex", flexDirection: "column", marginTop:'1em' }}>
              <h3>{parsedOverlay?.description}</h3>
            {parsedOverlay?.fillColor && !Array.isArray(fillColor) && Object.entries(fillColor).map(([key, color]) => (
                <div key={`overlay-legend-${selectedOverlay}-${index}-${subindex}`} style={{ display: "flex", margin:'.25em 0' }}>
                <span
                    key={`overlay-key-${key}-${index}-${subindex}`}
                    style={{
                      backgroundColor: `rgb(${color.join(",")})`,
                      width: 16,
                      height: 16,
                    }}
                ></span>
                  <p style={{padding:0, margin:'0 0 0 .25em'}}>{key}</p>
                </div>
            ))}
              {parsedOverlay?.fillColor && Array.isArray(fillColor) && <div key={`overlay-legend-${selectedOverlay}`} style={{ display: "flex", margin:'.25em 0' }}>
                 <span
                     style={{
                       backgroundColor: `rgb(${JSON.parse(parsedOverlay.fillColor)})`,
                       width: 16,
                       height: 16,
                     }}
                 ></span>
                  <p style={{padding:0, margin:'0 0 0 .25em'}}>{parsedOverlay?.description}</p>
              </div>}
            </div>}
          </>)})}
        </div>)}
      </ControlsContainer>
      <button
        onClick={handleOpenClose}
        id="showHideLeft"
        className={panelState.variables ? "active" : "hidden"}
      >
        {SVG.settings}
      </button>
    </VariablePanelContainer>
  );
};

export default VariablePanel;
