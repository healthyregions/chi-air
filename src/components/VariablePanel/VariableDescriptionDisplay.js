import { variablePresets } from "../../config";
import {useSelector} from "react-redux";
import {selectMapParams} from "../../store/slices/legacyStoreSlice";
import {useTranslation} from "react-i18next";
import useConfigText from "../../i18n/useConfigText";

const VariableDescriptionDisplay = ({ style }) => {
  const mapParams = useSelector(selectMapParams);
  const { t } = useTranslation('panel');
  const tc = useConfigText();

  const variable = mapParams.variableName ? variablePresets[mapParams.variableName] : undefined;
  const id = variable?.Column;

  return (
    <>
        <div className="data-description" style={{ fontWeight: 300, ...style }}>
          {/* Keyed by variable so the whole block is rebuilt whenever the indicator changes */}
          {variable && <div key={`variable-description-${id}`}>
            <span dangerouslySetInnerHTML={{ __html: tc('variables', id, 'Description', variable.Description) }}></span>
            <br /><br />
            <b>{t('description.dataSource')}</b>:{"  "}<span dangerouslySetInnerHTML={{ __html: tc('variables', id, 'Data Source(s)', variable['Data Source(s)']) }}/>
            <br/>
            <b>{t('description.dataYear')}</b>:{" "}{variable['Data Year']}
          </div>}
          {/*!mapParams.variableName && 'Select a variable for comparison'*/}
        </div>
    </>
  )
}

export default VariableDescriptionDisplay;
