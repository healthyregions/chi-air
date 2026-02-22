import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import {useState} from "react";
import {FaCaretDown} from "@react-icons/all-files/fa/FaCaretDown";


export const DropdownButton = ({ buttonProps = {}, width, menuStyle, style, onChange = () => {}, options, label, ButtonComponent, unique = true, sortOptions = true }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (e) => {
    const selection = e.target.textContent;
    onChange(selection);
    handleClose();
  };
  const ITEM_HEIGHT = 48;

  const Btn = ButtonComponent || Button;

  const listItems = unique ? [...new Set(options)] : options;
  const displayOps = sortOptions ? listItems.sort() : listItems;

  return (
    <>
      <Btn
        id="basic-button"
        size={'small'}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
        width={width}
        style={style}
        {...buttonProps}
      >
        {label} <FaCaretDown style={{ marginLeft: '10px' }} />
      </Btn>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        style={menuStyle}
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
        {displayOps?.map((op, index) => <MenuItem key={`dropdown-button-${op}-${index}`} onClick={handleChange} value={op}>{op}</MenuItem>)}
      </Menu>
    </>
  );

}
