import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {loadDataAndBins, selectStoredGeojson} from "../store/slices/legacyStoreSlice";
import { loadData } from "../utils/handleData";

export const useChivesData = () => {
  // state mgmt
  const storedGeojson = useSelector(selectStoredGeojson);
  const features = storedGeojson?.features || [];
  const dispatch = useDispatch();

  // data loading
  const handleData = async () => {
    if (features.length === 0) {
      const geojsonData = await loadData();
      dispatch(loadDataAndBins({ geojsonData }));
    }
  };
  useEffect(() => {
    if (!features?.length) {
      handleData();
    }
    // eslint-disable-next-line
  }, []);

  return {
    features,
    storedGeojson,
  };
};
