import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import {useState} from "react";
import {FaCaretDown} from "@react-icons/all-files/fa/FaCaretDown";

const ITEM_HEIGHT = 48;

export const DropdownButton = ({ buttonProps = {}, width, menuStyle, style, onChange = () => {}, options, label, ButtonComponent, unique = true, sortOptions = true }) => {
  // Keep track of our anchor element
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;

  // Handle user opening or closing the menu
  const handleOpen = (e) => setAnchorEl(e?.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Handle user selecting an option from the list: close the menu and call the handler
  const handleChange = (e) => {
    onChange(e?.target?.textContent);
    handleClose();
  };

  // Allow user to provide custom Button component
  const Btn = ButtonComponent || Button;

  // If unique, convert to a set and back to array
  // This will filter out duplicates and show only unique values
  const listItems = unique ? [...new Set(options)] : options;

  // If sorted, sort before displaying (assumes a list of string values)
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
