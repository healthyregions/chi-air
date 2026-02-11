import { dataDescriptions } from "../../config";
import {useSelector} from "react-redux";
import {selectMapParams} from "../../store/slices/legacyStoreSlice";

const VariableDescriptionDisplay = () => {
  const mapParams = useSelector(selectMapParams);

  return (
    <>
        <div className="data-description">
          {mapParams.variableName && mapParams.variableName in dataDescriptions && dataDescriptions[mapParams.variableName]}
          {!mapParams.variableName && 'Select a variable for comparison'}
        </div>
    </>
  )
}

export default VariableDescriptionDisplay;
