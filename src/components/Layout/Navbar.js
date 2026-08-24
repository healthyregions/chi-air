import {useState} from 'react';
import { useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../../config';
import Grid from "@mui/material/Grid";
import {DropdownButton} from "../VariablePanel/DropdownButton";
import {MdHomeFilled, MdOutlineTranslate} from "react-icons/md";
import useMediaQuery from "@mui/material/useMediaQuery";
import {setLocale} from "../../store/slices/sensorDataSlice";
import {useCookies} from "react-cookie";
import {NavDropdown} from "./NavDropdown";
import MenuItem from "@mui/material/MenuItem";
import {getLocaleLabel, LButton, locales, productName} from "../VariablePanel/common";

const NavContainer = styled.div`
  padding: ${({ $largeScreen }) => $largeScreen ? '4rem 6rem 0 6rem' : '6rem 0 0 0'};
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
  style
}) {

  const dispatch = useDispatch();
  const [cookies] = useCookies(['googtrans']);

  const navigate = useNavigate();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const largeScreen = useMediaQuery('(min-width: 600px)');
  const logoClicked = () => {
    if (largeScreen) { return; }
    setMobileNavOpen(!mobileNavOpen)
  };

  const onLocaleChange = (locale) => {
    dispatch(setLocale(locale));
  };

  const lgScreenFontSize = '24px';
  const xsScreenFontSize = '16px'
  const fontSize = largeScreen ? lgScreenFontSize : xsScreenFontSize;

  return (
    <>
      <NavContainer style={style} $largeScreen={largeScreen}>
        <ContentContainer $largeScreen={largeScreen}>
          <Grid container justifyContent={largeScreen ? 'space-between' : 'center'} alignItems={'center'} flexDirection={largeScreen ? 'row' : 'column-reverse'}>
            <Grid size='grow'>
              {(largeScreen || mobileNavOpen) && <Grid spacing={2} container justifyContent={largeScreen ? 'initial' : 'center'} alignItems={'center'}>
                <DropdownButton style={{ fontSize }} ButtonComponent={LButton} icon={<MdOutlineTranslate />} label={getLocaleLabel(cookies['googtrans'])} options={locales} onChange={onLocaleChange} />
                <LButton style={{ fontSize }} onClick={() => navigate('/')}><MdHomeFilled /></LButton>
                <NavDropdown keyName={'maps'} label={'Maps & more'} style={{ fontSize }}>
                  <MenuItem as={LButton} onClick={() => navigate('/map')}><span className={'notranslate'}>{productName}</span>&nbsp;Map</MenuItem>
                  <MenuItem as={LButton} onClick={() => navigate('/resources')}>All Resources</MenuItem>
                </NavDropdown>
                <NavDropdown keyName={'about'} label={'About'} style={{ fontSize }}>
                  <MenuItem as={LButton} onClick={() => navigate('/team')}>Team</MenuItem>
                  <MenuItem as={LButton} onClick={() => navigate('/about')}>Info & FAQ</MenuItem>
                  <MenuItem as={LButton} onClick={() => navigate('/contact')}>Contact Us</MenuItem>
                </NavDropdown>
              </Grid>}
            </Grid>
            <Grid alignItems={'end'} justifyContent={'right'} onClick={logoClicked} style={{ cursor: largeScreen ? '' : 'pointer', padding: largeScreen ? '' : '2rem 4rem' }}>
              <img width={largeScreen ? 477 : '100%'} style={{ minWidth: largeScreen ? '' : '8rem' }} src={'/icons/chiair-logo.svg'} alt={'Chicago Air Quality'} />
            </Grid>
          </Grid>

        </ContentContainer>
      </NavContainer>
    </>
  );
}
