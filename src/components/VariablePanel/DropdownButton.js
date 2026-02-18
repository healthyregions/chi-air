import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import {useState} from "react";
import {FaCaretDown} from "@react-icons/all-files/fa/FaCaretDown";


export const DropdownButton = ({ options, label, ButtonComponent, unique = true }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;

  const Btn = ButtonComponent || Button;

  return (
    <div>
      <Btn
        id="basic-button"
        size={'small'}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
      >
        {label} <FaCaretDown style={{ marginLeft: '10px' }}/>
      </Btn>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '18rem',
            },
          },
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        {(unique ? [...new Set(options)] : options).sort()?.map((op) => <MenuItem onClick={handleClose} value={op}>{op}</MenuItem>)}
      </Menu>
    </div>
  );

}
