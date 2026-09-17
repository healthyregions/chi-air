import {useSelector} from "react-redux";
import {selectMapParams} from "../../store/slices/legacyStoreSlice";
import {parsedOverlays} from "../../config";

const OverlaysDescriptionDisplay = ({ style }) => {
  const mapParams = useSelector(selectMapParams);

  console.log(parsedOverlays);
  return (
    <>
        <div className="data-description" style={{ fontWeight: 300, ...style }}>
          {mapParams.overlays?.map(overlayId => {
            const overlay = parsedOverlays?.find(o => o.id === overlayId);

            return (<div>

              <h3 style={{ margin: '1rem 0 0.5rem'}}>{overlay?.displayName}</h3>
              {overlay?.descriptionDetail && <>{overlay?.descriptionDetail}</>}
              <br/>
              <br/>
              {overlay?.descriptionSource && <><strong>Data Source</strong>: {overlay?.descriptionSource}</>}
              <br/>
              {overlay?.descriptionYear && <><strong>Data Year</strong>: {overlay?.descriptionYear}</>}
            </div>)
          })}
        </div>
    </>
  )
}

export default OverlaysDescriptionDisplay;
