import {useTranslation} from "react-i18next";
import useConfigText from "../../i18n/useConfigText";

// This component handles and formats the map tooltip info regarding the clicked Overlay point.
// The props passed to this component should contain an object of the hovered object (from deck, info.object by default),
// as well as a reference to the overlay that was clicked
const MapOverlayTooltipContent = ({content, overlay}) => {
    const { t } = useTranslation('map');
    const tc = useConfigText();

    const interpolatePopupTitle = (content, overlay) => {
        const template = tc('overlays', overlay?.id, 'popupTitle', overlay?.popupTitle);
        let result = template;
        (template?.match(/({[a-zA-Z_-]*})/g) || []).forEach(match => {
            const keyName = match.replace('{', '').replace('}', '');
            result = result.replace(match, content[keyName]);
        });

        return result;
    };

    // popupContent maps data field keys -> English display labels, e.g. { "address": "Address" }
    // The field key is used to look up a translated label; the English label is the fallback.
    const popupFields = JSON.parse(overlay?.popupContent);
    const fieldLabel = (fieldKey, englishLabel) => fieldKey
        ? t(`overlayPopup.fields.${fieldKey}`, { defaultValue: englishLabel })
        : englishLabel;
    const printContents = (popupFields, content, fieldKey) => {
      return (
        <>
          {typeof content === 'boolean' && <>{printContents(popupFields, content ? t('overlayPopup.yes') : t('overlayPopup.no'), fieldKey)}</>}
          {typeof content === 'string' && <tr key={'popup-content-' + popupFields}><td>{fieldLabel(fieldKey, popupFields)}</td><td>{content}</td></tr>}
          {typeof content === 'object' && content.sort && printContents(popupFields, content.join(' & '), fieldKey)}
          {typeof content === 'object' && !content.sort && Object.keys(popupFields)?.map((keyName) =>
            printContents(popupFields[keyName], content[keyName], keyName)
          )}
        </>
      )
    };

    return (
        <>
            <h2>{interpolatePopupTitle(content, overlay)}</h2>
            {content && <div style={{overflowY:'scroll', height:'150px'}}><span><table>
                <tbody>
                    {printContents(popupFields, content)}
                </tbody>
            </table>

            </span></div>}
        </>
    )
}

export default MapOverlayTooltipContent;
