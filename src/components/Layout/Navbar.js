import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../../config';
import Grid from "@mui/material/Grid";
import {DropdownButton} from "../VariablePanel/DropdownButton";
import {MdHomeFilled, MdOutlineTranslate} from "react-icons/md";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTranslation} from "react-i18next";
import {NavDropdown} from "./NavDropdown";
import MenuItem from "@mui/material/MenuItem";
import {getLocaleLabel, LButton, locales, productName} from "../VariablePanel/common";

const NavContainer = styled.div`
  padding: ${({ $largeScreen }) => $largeScreen ? '4rem 6rem 0 6rem' : '0'};
  top:.5em;
  left:.5em;
  z-index:500;
  button {
    padding-top: 5px;
    padding-right: 15px;
    padding-bottom: 5px;
    padding-left: 15px;
    //border: 1px solid ${colors.chicagoBlue};
  }
`;

const ContentContainer = styled.div`
    max-width: 1200px; /* Standard container width */
    margin: 0 auto;    /* Centering the container */
    padding: ${({ $largeScreen }) => $largeScreen ? '0 2rem' : '0'}; /* Prevents text from touching edges on larger screens */
    width: 100%;
    box-sizing: border-box;
`;

export default function Nav({
  style,
  asFooter=false
}) {

  const { t, i18n } = useTranslation('common');

  const navigate = useNavigate();
  const largeScreen = useMediaQuery('(min-width: 600px)');

  const onLocaleChange = (locale) => i18n.changeLanguage(locale);

  const lgScreenFontSize = '24px';
  const xsScreenFontSize = '16px'
  const fontSize = largeScreen ? lgScreenFontSize : xsScreenFontSize;

  return (
    <>
      <NavContainer style={style} $largeScreen={largeScreen}>
        <ContentContainer $largeScreen={largeScreen}>
          <Grid container justifyContent={largeScreen ? 'space-between' : 'center'} alignItems={'center'} flexDirection={asFooter ? 'column' : (largeScreen ? 'row' : 'column-reverse')}>
            <Grid size='grow'>
              <Grid spacing={2} container justifyContent={largeScreen ? 'initial' : 'center'} alignItems={'center'}>
                <DropdownButton style={{ fontSize }} ButtonComponent={LButton} icon={<MdOutlineTranslate />} label={getLocaleLabel(i18n.resolvedLanguage)} options={locales} onChange={onLocaleChange} dropup={asFooter} />
                <LButton style={{ fontSize }} onClick={() => navigate('/')}><MdHomeFilled /></LButton>
                <NavDropdown keyName={'maps'} label={t('nav.mapsAndMore')} style={{ fontSize }} dropup={asFooter}>
                  <MenuItem as={LButton} onClick={() => navigate('/map')}>{t('nav.productMap', { productName })}</MenuItem>
                  <MenuItem as={LButton} onClick={() => navigate('/resources')}>{t('nav.allResources')}</MenuItem>
                </NavDropdown>
                <NavDropdown keyName={'about'} label={t('nav.about')} style={{ fontSize }} dropup={asFooter}>
                  <MenuItem as={LButton} onClick={() => navigate('/team')}>{t('nav.team')}</MenuItem>
                  <MenuItem as={LButton} onClick={() => navigate('/about')}>{t('nav.infoFaq')}</MenuItem>
                  <MenuItem as={LButton} onClick={() => navigate('/contact')}>{t('nav.contactUs')}</MenuItem>
                </NavDropdown>
              </Grid>
            </Grid>
            <Grid alignItems={'end'} justifyContent={'right'} style={{ cursor: largeScreen ? '' : 'pointer', padding: largeScreen ? '' : '2rem 4rem' }}>
              <img width={largeScreen ? 400 : '100%'} style={{ minWidth: largeScreen ? '' : '8rem' }} src={'/icons/chiair-logo.svg'} alt={t('nav.logoAlt')} />
            </Grid>
          </Grid>

        </ContentContainer>
      </NavContainer>
    </>
  );
}
