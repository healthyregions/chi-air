import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import { colors } from '../../config';
import Box from '@mui/material/Box';
import {selectPanelState, setPanelState} from '../../store/slices/legacyStoreSlice';
import * as SVG from '../../config/svg';
import Grid from "@mui/material/Grid";
import {DropdownButton} from "../VariablePanel/DropdownButton";
import {FaHome} from "react-icons/fa";
import useMediaQuery from "@mui/material/useMediaQuery";
import {setLocale} from "../../store/slices/sensorDataSlice";
import {useCookies} from "react-cookie";
import {NavDropdown} from "./NavDropdown";
import MenuItem from "@mui/material/MenuItem";

const NavItems = styled.ul`
  margin-top:.25em;
  margin-bottom:2em;
  background:none;
  list-style:none;
  line-height:2;
  font-size:1rem;
  transition: 250ms all;
  li a, button {
    &.active {
      color: ${colors.chicagoDarkBlue};
    }
    text-decoration:none;
    font-family:"Roboto", sans-serif;
    color: ${colors.chicagoBlue};
    transition:250ms all;
    cursor: pointer;
    text-transform:none;
    padding:0.5em 0;
    svg { 
      width:1em;
      height:1em;
      margin:0 .5em 0 0;
      @media (max-width:600px){
        width:20px;
        height:20px;
        margin:5px;
      }
      fill:${colors.chicagoBlue};
      transform:rotate(0deg);
      transition:500ms all;
      .cls-1 {
        fill:none;
        stroke-width:6px;
        stroke:${colors.chicagoBlue};
      }
    }
    &:hover {
      color: ${colors.chicagoBlue};
        svg {
          fill: ${colors.chicagoBlue};
        .cls-1 {
          stroke:${colors.chicagoBlue};
        }
      }
    }
  }
`;
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
const NavInner = styled(Box)`
  padding:1em;
  min-width: 11.5em;

`;
const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: none;
    color: #005899;
`;

const ContentContainer = styled.div`
    max-width: 1200px; /* Standard container width */
    margin: 0 auto;    /* Centering the container */
    padding: ${({ $largeScreen }) => $largeScreen ? '0 2rem' : '0'}; /* Prevents text from touching edges on larger screens */
    width: 100%;
    box-sizing: border-box;
`;

export default function Nav({
  showMapControls = false,
  style,
  bounds,
  setViewState
}) {

  const dispatch = useDispatch();
  const [cookies] = useCookies(['googtrans']);

  const panelState = useSelector(selectPanelState);
  const handleOpenClose = (panel) => dispatch(setPanelState({ [panel]: !panelState[panel] }))

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const loc = useLocation();
  const navigate = useNavigate();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const largeScreen = useMediaQuery('(min-width: 600px)');
  const logoClicked = () => {
    if (largeScreen) { return; }
    setMobileNavOpen(!mobileNavOpen)
  };

  const onLocaleChange = (locale) => {
    dispatch(setLocale(locale));
  }

  const lgScreenFontSize = '20px';
  const xsScreenFontSize = '16px'
  const fontSize = largeScreen ? lgScreenFontSize : xsScreenFontSize;

  return (
    <>
      <NavContainer style={style} $largeScreen={largeScreen}>
        <ContentContainer $largeScreen={largeScreen}>
          <Grid container justifyContent={largeScreen ? 'space-between' : 'center'} alignItems={'center'} flexDirection={largeScreen ? 'row' : 'column-reverse'}>
            <Grid size='grow'>
              {(largeScreen || mobileNavOpen) && <Grid spacing={2} container justifyContent={largeScreen ? 'initial' : 'center'} alignItems={'center'}>
                <DropdownButton style={{ fontSize }} ButtonComponent={LButton} label={cookies['googtrans'] === '/auto/es' ? 'Español' : 'English'} options={[{label:'English', value:'en'}, {label:'Español',value:'es'}]} onChange={onLocaleChange} />
                <LButton style={{ fontSize }} onClick={() => navigate('/')}><FaHome /></LButton>
                <NavDropdown key={'about'} label={'Maps & more'} style={{ fontSize }}>
                  <MenuItem as={LButton} onClick={() => navigate('/map')}>Our Air Map</MenuItem>
                  <MenuItem as={LButton} onClick={() => navigate('/resources')}>All Resources</MenuItem>
                </NavDropdown>
                <NavDropdown key={'about'} label={'About'} style={{ fontSize }}>
                  <MenuItem as={LButton} onClick={() => navigate('/team')}>Team</MenuItem>
                  <MenuItem as={LButton} onClick={() => navigate('/about')}>Network</MenuItem>
                </NavDropdown>
              </Grid>}
            </Grid>
            <Grid alignItems={'end'} justifyContent={'right'} onClick={logoClicked} style={{ cursor: largeScreen ? '' : 'pointer', padding: largeScreen ? '' : '2rem 4rem' }}>
              <img width={largeScreen ? 477 : '100%'} style={{ minWidth: largeScreen ? '' : '8rem' }} src={'/icons/chiair-logo.svg'} alt={'Chicago Air Quality'} />
            </Grid>
          </Grid>

          {/*<LogoButtonContainer aria-describedby={id} variant="outlined" onClick={handleClick} title={id} color="success">
            <Typography><span style={{fontWeight:"bold", color:colors.chicagoDarkBlue}} translate="no">Chi Air</span></Typography>
            {SVG.hamburger}
          </LogoButtonContainer>*/}
          <Popover
            id="nav-container"
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            className="menu-popover"
            style={{
              border: `1px solid ${colors.chicagoBlue}`,
            }}
          >
            <NavInner>
              {!!showMapControls && <>
                <Typography>Map Controls</Typography>
                <NavItems>
                  <li><Button href="#" onClick={() => handleOpenClose('variables')}>{SVG.settings} Variables Panel</Button></li>
                  <li><Button href="#" onClick={() => handleOpenClose('info')}>{SVG.report}Data View</Button></li>
                </NavItems>
              </>}
              <NavItems>
                <li><Link to="/" className={loc.pathname === '/' ? 'active' : 'inactive'}>Home</Link></li>
                <li><NavLink to="/map">Map</NavLink></li>
                <li><NavLink to="/team">Team</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
              </NavItems>
            </NavInner>
          </Popover>
        </ContentContainer>
      </NavContainer>
    </>
  );
}
