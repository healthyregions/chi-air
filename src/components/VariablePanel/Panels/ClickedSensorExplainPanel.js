import {LHeader, LinkText, SGBody} from "../common";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {selectBreadcrumbs} from "../../../store/slices/sensorDataSlice";


const SGHeader = styled.div`
    font-family: Space Grotesk;
    font-weight: 500;
`;

export const ClickedSensorExplain = ({ pop }) => {
  const breadcrumbs = useSelector(selectBreadcrumbs);
  return(
    <Grid size={11}>
      <LHeader>
        <LinkText onClick={() => pop('root')}>...</LinkText>{breadcrumbs?.includes('Details') ? <> / <LinkText onClick={() => pop('Details')}>Details</LinkText></> : <></>} / Explain
      </LHeader>

      <Grid container spacing={2} marginTop={'1.5rem'}>
        <Grid size={12}>
          <SGHeader>AQI - Air Quality Index</SGHeader>
          <SGBody>The Air Quality Index (AQI) is a color-coded, 0–500 scale used to communicate how polluted the air is and the associated health risks. Higher AQI values indicate higher pollution levels and greater health concerns. An AQI under 100 is generally safe, while values over 100 indicate risks, particularly for sensitive groups.</SGBody>
        </Grid>
        <Grid size={12}>
          <SGHeader>PM 2.5 - Particulate Matter 2.5</SGHeader>
          <SGBody>PM2.5 refers to fine particulate matter—tiny solid particles and liquid droplets in the air that have a diameter of 2.5 micrometers or smaller. To put their size in perspective, a single human hair is about 70 micrometers wide, making the largest PM2.5 particle 30 times smaller than the width of a hair.</SGBody>
        </Grid>
        {/*<Grid size={12}>
          <SGHeader>NO2 - Nitrogen Dioxide</SGHeader>
          <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
        </Grid>*/}
        {/*<Grid size={12}>
          <SGHeader>BC - Black Carbon</SGHeader>
          <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
        </Grid>*/}
      </Grid>
    </Grid>
  );
};
