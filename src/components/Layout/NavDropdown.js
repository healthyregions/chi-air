import Menu from "@mui/material/Menu";
import {LButton} from "../VariablePanel/common";
import {useState} from "react";
import {FaCaretDown} from "react-icons/fa";

export const NavDropdown = ({ key = 'basic', label, style, children = <></> }) => {
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
        id={`${key}-button`}
        aria-controls={open ? `${key}-menu` : undefined}
        aria-haspopup="true"
        style={style}
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {label} <FaCaretDown style={{ marginLeft: '2px' }} />
      </LButton>
      <Menu
        id={`${key}-menu`}
        anchorEl={anchorEl}
        open={open}
        style={style}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': `${key}-button`,
          },
        }}
      >
        {children}
      </Menu>
    </>
  );
}
