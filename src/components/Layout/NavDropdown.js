import Menu from "@mui/material/Menu";
import {LButton} from "../VariablePanel/common";
import {useState} from "react";
import {FaCaretDown} from "react-icons/fa";
import {FaCaretUp} from "@react-icons/all-files/fa/FaCaretUp";

export const NavDropdown = ({ keyName = 'basic', label, style, children = <></>, dropup=false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <LButton
        id={`${keyName}-button`}
        aria-controls={open ? `${keyName}-menu` : undefined}
        aria-haspopup="true"
        style={style}
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {label} {dropup ? <FaCaretUp style={{ marginLeft: '2px' }} /> : <FaCaretDown style={{ marginLeft: '2px' }} />}
      </LButton>
      <Menu
        id={`${keyName}-menu`}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: dropup ? 'top' : 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: dropup ? 'bottom' : 'top',
          horizontal: 'left',
        }}
        open={open}
        style={style}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': `${keyName}-button`,
          },
        }}
      >
        {children}
      </Menu>
    </>
  );
}
