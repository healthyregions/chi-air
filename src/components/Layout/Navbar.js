import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, NavLink, useLocation} from 'react-router-dom';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import { colors } from '../../config';
import { Box } from '@mui/system';
import { setPanelState } from '../../actions';
import * as SVG from '../../config/svg';

const NavItems = styled.ul`
  margin-top:.25em;
  margin-bottom:1em;
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
`

const NavContainer = styled.div`
  position:fixed;
  top:.5em;
  left:.5em;
  z-index:500;
  button {
    padding-top: 5px;
    padding-right: 15px;
    padding-bottom: 5px;
    padding-left: 15px;
    border: 1px solid ${colors.chicagoBlue};
  }
`

const NavInner = styled(Box)`
  padding:1em;
  min-width: 11.5em;

`
const LogoButtonContainer = styled.button`
  display: flex;
  cursor: pointer;
  background: rgba( 255, 255, 255, 0.85 );
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.85 );
  backdrop-filter: blur( 20px );
  -webkit-backdrop-filter: blur( 20px );
  box-shadow: 2px 0px 5px ${colors.gray}44;
  border-radius:0;
  border:1px solid ${colors.chicagoBlue};
`

export default function Nav({
  showMapControls = false,
  bounds,
  setViewState
}) {

  const dispatch = useDispatch();
  const panelState = useSelector(state => state.panelState);
  const handleOpenClose = (panel) => dispatch(setPanelState({ [panel]: panelState[panel] ? false : true }))

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'Close Menu' : 'Open Menu';
  const loc = useLocation();

  return (
    <NavContainer>
      <LogoButtonContainer aria-describedby={id} variant="outlined" onClick={handleClick} title={id} color="success">
        <Typography><span style={{fontWeight:"bold", color:colors.chicagoDarkBlue}} translate="no">Chi Air</span></Typography>
        {SVG.hamburger}
      </LogoButtonContainer>
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
            <li><NavLink to="/about">About</NavLink></li>
          </NavItems>
        </NavInner>
      </Popover>
    </NavContainer>
  );
}
