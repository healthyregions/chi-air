import Menu from "@mui/material/Menu";
import {LButton} from "../VariablePanel/common";
import {useRef, useState} from "react";
import {FaCaretDown} from "react-icons/fa";
import {FaCaretUp} from "@react-icons/all-files/fa/FaCaretUp";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export const NavDropdown = ({ keyName = 'basic', label, style, children = <></>, dropup=false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const menuRef = useRef();

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div onMouseLeave={() => {
        handleClose();
      }}>
        <LButton
          disableRipple
          // TODO: If we can show menu on hover, remove hover "mask"?
          // sx={{
          //   '&:hover': { backgroundColor: '#00000000' }   // transparent background
          // }}
          id={`${keyName}-button`}
          aria-controls={open ? `${keyName}-menu` : undefined}
          aria-haspopup="true"
          style={style}
          hidden={!open}
          onMouseEnter={handleClick}
          onMouseLeave={handleClose}
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {label} {dropup ? <FaCaretUp style={{ marginLeft: '2px' }} /> : <FaCaretDown style={{ marginLeft: '2px' }} />}
        </LButton>
        <Menu
          rel={menuRef}
          id={`${keyName}-menu`}
          disableAutoFocus
          disableAutoFocusItem
          anchorEl={anchorEl}
          hidden
          anchorOrigin={{
            vertical: dropup ? 'top' : 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: dropup ? 'bottom' : 'top',
            horizontal: 'left',
          }}
          onMouseEnter={handleClick}
          onMouseLeave={handleClose}
          hideBackdrop={true}
          anchorReference={`${keyName}-button`}
          open={open}
          style={{...style, display: open ? 'inherit' : 'none'}}
          onClose={handleClose}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: 'transparent', // Removes the dark shading
                pointerEvents: 'none' // Allows clicking elements behind it
              },
            },
            list: {
              'aria-labelledby': `${keyName}-button`,
            },
          }}
        >
          {children}
        </Menu>
      </div>
    </ClickAwayListener>
  );
}
