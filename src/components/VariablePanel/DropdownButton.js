import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import {FaCaretDown} from "react-icons/fa";
import {LButton} from "./common";
import {FaCaretUp} from "@react-icons/all-files/fa/FaCaretUp";

const ITEM_HEIGHT = 48;

export const DropdownButton = ({ size, icon=undefined, onOpen = () => {}, buttonProps = {}, width, style, onChange, options, label, ButtonComponent, unique=true, sortOptions=true, dropup=false }) => {
  // Keep track of our anchor element
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;

  // Handle user opening or closing the menu
  const handleOpen = (e) => setAnchorEl(e?.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Handle user selecting an option from the list: close the menu and call the handler
  const handleChange = (e) => {
    const found = displayOps?.find(o => o.label === e?.target?.textContent || o === e?.target?.textContent)
    onChange && onChange(found?.value || found);
    handleClose();
  };

  useEffect(() => {
    open && onOpen();
  }, [open, onOpen]);

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
        disableRipple
        // TODO: If we can show menu on hover, remove hover "mask"?
        // sx={{
        //   '&:hover': { backgroundColor: '#00000000' }   // transparent background
        // }}
        id="basic-button"
        size={size || 'small'}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
        width={width}
        style={style}
        {...buttonProps}
      >
        {icon ? <span style={{ marginRight: '1rem' }}>{icon}</span> : <></>} {label} {dropup ? <FaCaretUp style={{ marginLeft: '2px' }} /> : <FaCaretDown style={{ marginLeft: '2px' }} />}
      </Btn>
      <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          anchorOrigin={{
            vertical: dropup ? 'top' : 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: dropup ? 'bottom' : 'top',
            horizontal: 'left',
          }}
          onClose={handleClose}
          slotProps={{
            paper: {
              style: {
                maxHeight: ITEM_HEIGHT * 6.5,
                width: '18rem',
                boxShadow: dropup ? '2px 2px 4px 0px #1E1E1E0D' : '2px 2px 4px 0px #1E1E1E0D',
                borderRadius: '8px',
              },
            },
            list: {
              'aria-labelledby': 'basic-button',
              style: {
                background: dropup ? 'linear-gradient(180deg, rgba(65, 182, 230, 0.25) 0%, rgba(255, 255, 255, 0.25) 100%)' : 'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(65, 182, 230, 0.25) 100%)',
                padding: '16px 0',
              }
            },
            backdrop: {
              style: {
                backgroundColor: 'transparent'
              }
            }
          }}
        >
          {displayOps?.map((op, index) =>
            <MenuItem as={LButton} key={`dropdown-button-${op}-${index}`}
                      onClick={handleChange}
                      className={'notranslate'}
                      style={{
                        padding: '8px 19px',
                        fontSize: '24px',
                        fontFamily: 'Space Grotesk'
                      }}
                      value={op?.value}>
              {op?.label || op}
            </MenuItem>
          )}
        </Menu>
    </>
  );

}
