import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadDataAndBins } from "../store/slices/legacyStoreSlice";
import { loadData } from "../utils/handleData";

export const useChivesData = () => {
  // state mgmt
  const storedGeojson = useSelector((state) => state.legacy.storedGeojson);
  const features = storedGeojson?.features || [];
  const dispatch = useDispatch();

  // data loading
  const handleData = async () => {
    if (features.length === 0) {
      console.log('Fetching data...');
      const geojsonData = await loadData();
      console.log('Fetched data:', geojsonData);

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
