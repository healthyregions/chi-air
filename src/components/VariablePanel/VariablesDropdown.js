import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {variablePresets} from "../../config";
import {changeVariable, selectMapParams} from "../../store/slices/legacyStoreSlice";
import {useDispatch, useSelector} from "react-redux";
import MenuItem from "@mui/material/MenuItem";

const VariablesDropdown = () => {
  const mapParams = useSelector(selectMapParams);
  const dispatch = useDispatch();

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
          <MenuItem value="">None</MenuItem>
          {Object.keys(variablePresets).map((variable,i) => (
            variable.includes("HEADER::")
              ? <>{/*<ListSubheader key={`list-header-${i}`}>{variable.split("HEADER::")[1]}</ListSubheader>*/}</>
              : <MenuItem value={variable} key={`variable-menu-item-${i}`}>
                {variable}
              </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default VariablesDropdown;
