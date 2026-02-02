import { WebMercatorViewport } from "@deck.gl/core";
import { wrap } from "comlink";
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectionData } from "../store/slices/legacyStoreSlice";
import { useChivesData } from "./useChivesData";

const queryWorker = wrap(
  new Worker(new URL("../workers/queryFeatures", import.meta.url))
);

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const GLOBE_VIEWPORT = {
  "width": 1121,
  "height": 796,
  "latitude": 0,
  "longitude": 0,
  "zoom": 0,
  "bearing": 0,
  "pitch": 0,
  "altitude": 1.5,
  "maxZoom": 20,
  "minZoom": 0,
  "maxPitch": 60,
  "minPitch": 0,
  "normalize": true,
  "position": [
      0,
      0,
      0
  ]
}

export const useChivesWorkerQuery = (deckRef) => {
  const { storedGeojson } = useChivesData();

  const centroids = useSelector((state) => state.legacy.centroids);
  const columnNames = useSelector((state) => state.legacy.columnNames);
  const ranges = useSelector((state) => state.legacy.ranges);
  const filterValues = useSelector((state) => state.legacy.filterValues);
  const selectionData = useSelector((state) => state.legacy.selectionData);

  const dispatch = useDispatch();
  const [dataIsCached, setDataIsCached] = useState(false);

  const queryViewport = debounce(async (viewState=deckRef?.current?.viewports?.[0]) => {
    if (!viewState) return;
    if (!centroids || !centroids?.length) return;
    const viewport = new WebMercatorViewport(viewState);
    const extent = [
      ...viewport.unproject([0, 0]),
      ...viewport.unproject([viewport.width, viewport.height]),
    ];

    const data = await queryWorker.generateFilteredData({
      storedGeojson: dataIsCached ? null : storedGeojson,
      centroids: dataIsCached ? null : centroids,
      columns: columnNames,
      filters: filterValues,
      extent,
      ranges,
    });

    console.log('selectionData (hook):', data);
    if (data) {
      dispatch(setSelectionData(data));
      if (data.dataIsCached) {
        setDataIsCached(true);
      }
    }
  }, 250);

  useEffect(() => {
    queryViewport(deckRef?.current?.viewports?.[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues]);

  useLayoutEffect(() => {
    if (!Object.keys(selectionData).length) {
      queryViewport(GLOBE_VIEWPORT);
    }
    // eslint-disable-next-line
  }, [
      centroids?.length,
      storedGeojson?.features?.length,
      columnNames?.length,
      ranges,
      selectionData?.totalPop,
      filterValues,
  ]);

  return {
    queryViewport,
  };
};
