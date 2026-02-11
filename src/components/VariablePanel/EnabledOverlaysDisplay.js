import { colors, parsedOverlays } from "../../config";
import {useSelector} from "react-redux";
import {selectMapParams} from "../../store/slices/legacyStoreSlice";

const EnabledOverlayDisplay = ({}) => {
  const mapParams = useSelector(selectMapParams);

  return (
    <>
      <div style={{ margin: '1rem 0 0.5rem' }}>
        <span style={{ color: colors.pink }}>Overlays:</span> {mapParams.overlays?.map((selectedOverlay, index) => <span key={`overlays-section-${index}`}>
        {parsedOverlays.map((parsedOverlay, i) => <span key={`overlays-enabled-list-${i}`}>
          { selectedOverlay === parsedOverlay?.id && <span style={{ color: colors.darkgray }} key={`overlay-description-${selectedOverlay}`}>
            <span style={{ display: index === 0 ? 'none' : 'inline' }}>, </span>{parsedOverlay?.displayName}</span> }
          </span>)}
        </span>)}
      </div>
    </>
  )
}

export default EnabledOverlayDisplay;
