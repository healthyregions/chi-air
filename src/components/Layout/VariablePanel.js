import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

// import Tooltip from './tooltip';
import {
  selectPanelState,
  setPanelState
} from "../../store/slices/legacyStoreSlice";
import {colors} from "../../config";
import * as SVG from "../../config/svg";
import AQIColorScale from "../VariablePanel/AQIColorScale";
import OverlaysDropdown from "../VariablePanel/OverlaysDropdown";
import OverlaysColorLegend from "../VariablePanel/OverlaysColorLegend";
import EnabledOverlayDisplay from "../VariablePanel/EnabledOverlaysDisplay";
import VariablesDropdown from "../VariablePanel/VariablesDropdown";
import VariableDescriptionDisplay from "../VariablePanel/VariableDescriptionDisplay";

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

  const panelState = useSelector(selectPanelState);

  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    // TODO: read from redux store
    try {
      fetch("https://chicago-aq.s3.us-east-2.amazonaws.com/latest.geojson")
        .then((response) => response.json())
        .then((data) => {
          const date = new Date(data.timestamp)
          setLastUpdated(date)
        })
    } catch (ex) {
      console.error('Failed to fetch "latest.geojson": ' + ex)
    }
  }, []);


  const handleOpenClose = () => {
    if (panelState.variables) {
      dispatch(setPanelState({ variables: false }));
    } else {
      dispatch(setPanelState({ variables: true }));
    }
  };

  return (
    <VariablePanelContainer
      className={panelState.variables ? "" : "hidden"}
      otherPanels={panelState.info}
      id="variablePanel"
    >
      <ControlsContainer>
        <h2>Air Quality</h2>
        <span className="data-description">
          Points on the map show PM 2.5 NowCast <strong>Mass Concentration</strong> values from our sensor network.
        </span>
        <AQIColorScale></AQIColorScale>
        <span className="data-description">
          {lastUpdated ? `last updated: ${lastUpdated.toLocaleDateString('en-US')} ${lastUpdated.toLocaleTimeString('en-US')}` : "loading data..."}
        </span>

        <EnabledOverlayDisplay></EnabledOverlayDisplay>
        <VariableDescriptionDisplay></VariableDescriptionDisplay>

        <VariablesDropdown></VariablesDropdown>
        <OverlaysDropdown></OverlaysDropdown>

        <OverlaysColorLegend></OverlaysColorLegend>
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
