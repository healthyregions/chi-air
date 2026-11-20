import {useSelector} from "react-redux";
import {selectMapParams} from "../../store/slices/legacyStoreSlice";
import {parsedOverlays} from "../../config";
import {useTranslation} from "react-i18next";
import useConfigText from "../../i18n/useConfigText";

const OverlaysDescriptionDisplay = ({ style }) => {
  const mapParams = useSelector(selectMapParams);
  const { t } = useTranslation('panel');
  const tc = useConfigText();

  return (
    <>
        <div className="data-description" style={{ fontWeight: 300, ...style }}>
          {mapParams.overlays?.map(overlayId => {
            const overlay = parsedOverlays?.find(o => o.id === overlayId);
            if (!overlay) { return null; }

            return (<div key={`overlay-description-${overlay.id}`}>
              <h3 style={{ margin: '1rem 0 0.5rem'}}>{tc('overlays', overlay.id, 'displayName', overlay.displayName)}</h3>
              {overlay.descriptionDetail && <>{tc('overlays', overlay.id, 'descriptionDetail', overlay.descriptionDetail)}</>}
              <br/>
              <br/>
              {overlay.descriptionSource && <><strong>{t('description.dataSource')}</strong>: {tc('overlays', overlay.id, 'descriptionSource', overlay.descriptionSource)}</>}
              <br/>
              {overlay.descriptionYear && <><strong>{t('description.dataYear')}</strong>: {overlay.descriptionYear}</>}
            </div>)
          })}
        </div>
    </>
  )
}

export default OverlaysDescriptionDisplay;
