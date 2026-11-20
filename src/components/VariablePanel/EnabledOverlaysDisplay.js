import { colors, parsedOverlays } from "../../config";
import {useSelector} from "react-redux";
import {selectMapParams} from "../../store/slices/legacyStoreSlice";
import {useTranslation} from "react-i18next";
import useConfigText from "../../i18n/useConfigText";

const EnabledOverlayDisplay = () => {
  const mapParams = useSelector(selectMapParams);
  const { t } = useTranslation('panel');
  const tc = useConfigText();

  return (
    <>
      <div style={{ margin: '1rem 0 0.5rem' }}>
        <span style={{ color: colors.pink }}>{t('overlays.enabledLabel')}</span> {mapParams.overlays?.map((selectedOverlay, index) => <span key={`overlays-section-${index}`}>
        {parsedOverlays.map((parsedOverlay, i) => <span key={`overlays-enabled-list-${i}`}>
          { selectedOverlay === parsedOverlay?.id && <span style={{ color: colors.darkgray }} key={`overlay-description-${selectedOverlay}`}>
            <span style={{ display: index === 0 ? 'none' : 'inline' }}>, </span>{tc('overlays', parsedOverlay?.id, 'displayName', parsedOverlay?.displayName)}</span> }
          </span>)}
        </span>)}
      </div>
    </>
  )
}

export default EnabledOverlayDisplay;
