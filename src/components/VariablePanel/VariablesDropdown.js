import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {variablePresets} from "../../config";
import {changeVariable, selectMapParams} from "../../store/slices/legacyStoreSlice";
import {useDispatch, useSelector} from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import {useTranslation} from "react-i18next";
import useConfigText from "../../i18n/useConfigText";

const VariablesDropdown = () => {
  const mapParams = useSelector(selectMapParams);
  const dispatch = useDispatch();
  const { t } = useTranslation('panel');
  const tc = useConfigText();

  const handleVariable = (e) => {
    // Enable some additional overlays based on the value
    // TODO: may not needed for this dashboard
    //setVariableChanged(true);

    if (!e?.target?.value) {
      // "None" was selected, de-select current choice
      dispatch(changeVariable());
    } else {
      // New item chosen, select it
      dispatch(changeVariable({
        params: variablePresets[e.target.value]
      }));
    }
  }

  return (
    <>
      <FormControl id="newVariableSelect" variant="outlined" fullWidth>
        {/*<InputLabel htmlFor="newVariableSelect">Variable</InputLabel>*/}
        <Select
          variant={"filled"}
          value={mapParams.variableName || ''}
          onChange={handleVariable}
          MenuProps={{ id: "variableMenu" }}
        >
          <MenuItem value="">{t('variables.none')}</MenuItem>
          {Object.keys(variablePresets).map((variable,i) => (
            variable.includes("HEADER::")
              ? <div key={`list-header-${i}`}>{/*<ListSubheader key={`list-header-${i}`}>{variable.split("HEADER::")[1]}</ListSubheader>*/}</div>
              // Value stays the English variable name (used as an id); only the label is translated
              : <MenuItem value={variable} key={`variable-menu-item-${i}`}>
                {tc('variables', variablePresets[variable]?.Column, 'Variable Name', variable)}
              </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default VariablesDropdown;
