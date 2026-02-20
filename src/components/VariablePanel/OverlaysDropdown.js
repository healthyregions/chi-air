import { FormControl, MenuItem, Select } from "@mui/material";
import { parsedOverlays } from "../../config";
import {selectMapParams, setMapParams} from "../../store/slices/legacyStoreSlice";
import {useDispatch, useSelector} from "react-redux";


const OverlaysDropdown = () => {
  const mapParams = useSelector(selectMapParams);
  const dispatch = useDispatch();

  const handleMapOverlay = (overlays) => {
    let prevOverlays = mapParams.overlays;

    // If "None" is clicked, remove all other overlays
    if ((!prevOverlays.includes('None') && overlays.includes('None')) || !overlays.length) {
      overlays = ['None'];
    }

    // If "None" was previously selected and something else is chosen, then de-select "None"
    if (prevOverlays.includes('None') && overlays.find((o) => o !== 'None')) {
      overlays.splice(overlays.indexOf('None'), 1);
    }

    dispatch(
      setMapParams({
        overlays: overlays,
      })
    );
  };

  return (
    <>
      <FormControl id="newOverlaySelect" variant="outlined" fullWidth={true}>
        {/*<InputLabel htmlFor="overlay-select">Overlay</InputLabel>*/}
        <Select
          id="overlay-select"
          variant={"filled"}
          value={mapParams.overlays}
          onChange={(e) => handleMapOverlay(e.target.value)}
          multiple={true}
        >
          <MenuItem value="None" key={"None"}>
            None
          </MenuItem>
          {
            parsedOverlays?.map((overlay) =>
              <MenuItem value={overlay.id} key={overlay.id}>
                {overlay.displayName}
              </MenuItem>
            )
          }
        </Select>
      </FormControl>
    </>
  )
}

export default OverlaysDropdown;

