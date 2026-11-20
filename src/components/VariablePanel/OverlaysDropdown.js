import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { parsedOverlays } from "../../config";
import {selectMapParams, setMapParams} from "../../store/slices/legacyStoreSlice";
import {useDispatch, useSelector} from "react-redux";
import {ListSubheader} from "@mui/material";
import {useTranslation} from "react-i18next";
import useConfigText from "../../i18n/useConfigText";


const OverlaysDropdown = () => {
  const mapParams = useSelector(selectMapParams);
  const dispatch = useDispatch();
  const { t } = useTranslation('panel');
  const tc = useConfigText();

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
          <ListSubheader>{t('overlays.categories.communityBoundaries')}</ListSubheader>
          {
            parsedOverlays?.filter(o => o?.categoryType === 'Community Boundary')?.map((overlay) =>
              <MenuItem value={overlay.id} key={overlay.id}>
                {tc('overlays', overlay.id, 'displayName', overlay.displayName)}
              </MenuItem>
            )
          }
          <ListSubheader>{t('overlays.categories.communityResources')}</ListSubheader>
          {
            parsedOverlays?.filter(o => o?.categoryType === 'Community Resource')?.map((overlay) =>
              <MenuItem value={overlay.id} key={overlay.id}>
                {tc('overlays', overlay.id, 'displayName', overlay.displayName)}
              </MenuItem>
            )
          }
          <ListSubheader>{t('overlays.categories.builtInfrastructure')}</ListSubheader>
          {
            parsedOverlays?.filter(o => o?.categoryType === 'Built Infrastructure')?.map((overlay) =>
              <MenuItem value={overlay.id} key={overlay.id}>
                {tc('overlays', overlay.id, 'displayName', overlay.displayName)}
              </MenuItem>
            )
          }
        </Select>
      </FormControl>
    </>
  )
}

export default OverlaysDropdown;

