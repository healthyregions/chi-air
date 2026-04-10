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
// import {DropdownButton} from "../VariablePanel/DropdownButton";
import {FaHome} from "react-icons/fa";
import useMediaQuery from "@mui/material/useMediaQuery";

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
  padding: 4rem 6rem 0 6rem;
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
    padding: 0 2rem;   /* Prevents text from touching edges */
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
  const panelState = useSelector(selectPanelState);
  const handleOpenClose = (panel) => dispatch(setPanelState({ [panel]: !panelState[panel] }))

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const loc = useLocation();
  const navigate = useNavigate();

  //const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const largeScreen = useMediaQuery('(min-width: 600px)');
  // const logoClicked = () => {
  //   if (largeScreen) { return; }
  //   setMobileNavOpen(!mobileNavOpen)
  // };

  return (
    <>
      <NavContainer style={style}>
        <ContentContainer>
          <Grid container justifyContent={largeScreen ? 'space-between' : 'center'} alignItems={'center'} flexDirection={largeScreen ? 'row' : 'column-reverse'}>
            <Grid size={5}>
              {(largeScreen /*|| mobileNavOpen*/) && <Grid container justifyContent={'space-between'} alignItems={'center'} marginBottom={'2rem'}>
                {/* <DropdownButton style={{ fontSize: largeScreen ? '24px' : '16px' }} ButtonComponent={LButton} label={'Eng'} options={['English', 'Español']} /> */}
                <LButton style={{ fontSize: largeScreen ? '24px' : '16px' }} onClick={() => navigate('/')}><FaHome /></LButton>
                {/*<DropdownButton buttonProps={{size:'large'}} ButtonComponent={LButton}  label={'Maps'} />
                <DropdownButton buttonProps={{size:'large'}} ButtonComponent={LButton}  label={'About'} />*/}
                <LButton style={{ fontSize: largeScreen ? '24px' : '16px' }} onClick={() => navigate('/map')}>Maps</LButton>
                <LButton style={{ fontSize: largeScreen ? '24px' : '16px' }} onClick={() => navigate('/team')}>Team</LButton>
                <LButton style={{ fontSize: largeScreen ? '24px' : '16px' }} onClick={() => navigate('/about')}>About</LButton>
              </Grid>}
            </Grid>
            {/* <Grid as={LButton} alignItems={'end'} justifyContent={'right'} onClick={logoClicked} style={{ cursor: largeScreen ? '' : 'pointer' }}> */}
              <img width={largeScreen ? 477 : '100%'} src={'/icons/chiair-logo.svg'} alt={'Chicago Air Quality'} />
            {/* </Grid> */}
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
