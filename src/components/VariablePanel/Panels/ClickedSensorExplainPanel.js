import {LHeader, LinkText, SGBody} from "../common";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {selectBreadcrumbs} from "../../../store/slices/sensorDataSlice";
import {useTranslation} from "react-i18next";


const SGHeader = styled.div`
    font-family: Space Grotesk;
    font-weight: 500;
`;

export const ClickedSensorExplain = ({ pop }) => {
  const breadcrumbs = useSelector(selectBreadcrumbs);
  const { t } = useTranslation('panel');
  return(
    <Grid size={11}>
      <LHeader>
        <LinkText onClick={() => pop('root')}>...</LinkText>{breadcrumbs?.includes('Details') ? <> / <LinkText onClick={() => pop('Details')}>{t('breadcrumbs.details')}</LinkText></> : <></>} / {t('breadcrumbs.explain')}
      </LHeader>

      <Grid container spacing={2} marginTop={'1.5rem'}>
        <Grid size={12}>
          <SGHeader>{t('explain.aqi.title')}</SGHeader>
          <SGBody>{t('explain.aqi.body')}</SGBody>
        </Grid>
        <Grid size={12}>
          <SGHeader>{t('explain.pm25.title')}</SGHeader>
          <SGBody>{t('explain.pm25.body')}</SGBody>
        </Grid>
        <Grid size={12}>
          <SGHeader>{t('explain.no2.title')}</SGHeader>
          <SGBody>{t('explain.no2.body')}</SGBody>
        </Grid>
        {/*<Grid size={12}>
          <SGHeader>BC - Black Carbon</SGHeader>
          <SGBody>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</SGBody>
        </Grid>*/}
      </Grid>
    </Grid>
  );
};
