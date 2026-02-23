import {LHeader, LinkText, SGBody} from "../common";
import Grid from "@mui/material/Grid";
import styled from "styled-components";


const SGHeader = styled.div`
    font-family: Space Grotesk;
    font-weight: 500;
`;

export const ClickedSensorExplain = ({ pop }) => {
  return(
    <Grid size={11}>
      <LHeader>
        <LinkText onClick={() => pop('root')}>...</LinkText> / <LinkText onClick={() => pop('Details')}>Details</LinkText> / Explain
      </LHeader>

      <Grid container spacing={2} marginTop={'1.5rem'}>
        <Grid size={12}>
          <SGHeader>AQI - Air Quality Index</SGHeader>
          <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
        </Grid>
        <Grid size={12}>
          <SGHeader>PM 2.5 - Particulate Matter 2.5</SGHeader>
          <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
        </Grid>
        <Grid size={12}>
          <SGHeader>NO2 - Nitrogen Dioxide</SGHeader>
          <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
        </Grid>
        <Grid size={12}>
          <SGHeader>BC - Black Carbon</SGHeader>
          <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
        </Grid>
      </Grid>
    </Grid>
  );
};
