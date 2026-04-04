import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Fetch / cached server data
  locations: [],
  metrics: {
    mean_pm25: {
      index: { hour: -1, day: -1, week: -1, month: -1, season: -1, year: -1 },
      data: []
    },
    nowcast_aqi: {
      index: { hour: -1, day: -1, week: -1, month: -1, season: -1, year: -1 },
      data: []
    },
  },
  geojsonData: {
    type: 'FeatureCollection',
    features: []
  },

  // User selections
  selectedAreas: {
    community: [],
    zip: [],
    ward: [],
  },
  selectedSensors: [],
  selectedParameter: 'nowcast_aqi',
  clickedSensor: undefined,
  averageType: 'hour',
  locale: 'en',
};

export const sensorDataSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    setMetricIndex: (state, action) => ({
      ...state,
      metrics: {
        ...state.metrics,
        [action.payload.parameter]: {
          ...state.metrics[action.payload.parameter],
          index: action.payload.index
        },
      }
    }),
    setMetricData: (state, action) => ({
      ...state,
      metrics: {
        ...state.metrics,
        [action.payload.parameter]: {
          ...state.metrics[action.payload.parameter],
          data: action.payload.data
        },
      }
    }),
    setSensorParameter: (state, action) => ({
      ...state,
      selectedParameter: action.payload,
    }),
    setSelectedAreas: (state, action) => ({
      ...state,
      selectedAreas: {
        ...action.payload,
      }
    }),
    setLocale: (state, action) => {
      console.log('Selected locale:', action.payload);
      return {
        ...state,
        locale: action.payload
      }
    },
    setAverageType: (state, action) => ({
      ...state,
      averageType: action.payload
    }),
    setClickedSensor: (state, action) => ({
      ...state,
      clickedSensor: action.payload
    }),
    setSelectedSensors: (state, action) => ({
      ...state,
      selectedSensors: [
        ...action.payload
      ]
    }),
    addSensorsToSelection: (state, action) => ({
      ...state,
      selectedSensors: [
        ...state.selectedSensors,
        ...action.payload
      ]
    }),
    removeSensorsFromSelection: (state, action) => ({
      ...state,
      selectedSensors: [
        ...state.selectedSensors.filter(s => !action.payload?.includes(s))
      ]
    }),
    setSensorLocations: (state, action) => ({
        ...state,
        locations: action.payload,
    }),
    setSensorValuesMeanPm25: (state, action) => ({
        ...state,
        mean_pm25: action.payload,
    }),
    setSensorGeojsonData: (state, action) => {
      const missingRows = (action.payload?.features || [])?.filter(newFeature =>
        !state.geojsonData.features.find(existingFeature =>
          newFeature?.properties?.datasourceId === existingFeature?.properties?.datasourceId
        )
      );
      const mergedRows = state.geojsonData.features?.map(existingFeature => {
        const newData = action.payload?.features?.find(newFeature =>
          newFeature?.properties?.datasourceId === existingFeature?.properties?.datasourceId
        )
        return {
          ...existingFeature,
          ...newData
        }
      });
      const features = [...mergedRows, ...missingRows];

      return {
        ...state,
        geojsonData: {
          type: "FeatureCollection",
          features
        },
      };
    },
  },
  selectors: {
    selectSensorLocations: state => state.locations,
    selectSensorValuesMeanPm25: state => state.mean_pm25,
    selectSelectedSensors: state => state.selectedSensors,
    selectSensorGeojsonData: state => state.geojsonData,
    selectClickedSensor: state => state.clickedSensor,
    selectAverageType: state => state.averageType,
    selectLocale: state=> state.locale,
    selectSelectedAreas: state => state.selectedAreas,
    selectSensorParameter: state => state.selectedParameter,
    selectMetricIndex: state => state.metrics?.[state.selectedParameter]?.index,
    selectMetricData: state => state.metrics?.[state.selectedParameter]?.data,
    selectMetrics: state => state.metrics,
  }
});

// useDispatch + an action to update the state
export const {
  setSensorLocations,
  //setSensorValuesMeanPm25,
  addSensorsToSelection,
  removeSensorsFromSelection,
  setSensorGeojsonData,
  setSelectedSensors,
  setClickedSensor,
  setAverageType,
  setLocale,
  setSelectedAreas,
  setSensorParameter,
  setMetricIndex,
  setMetricData,
} = sensorDataSlice.actions;

// useSelector + a selector to read the state
export const {
  selectSensorLocations,
  //selectSensorValuesMeanPm25,
  selectSelectedSensors,
  selectSensorGeojsonData,
  selectClickedSensor,
  selectAverageType,
  selectLocale,
  selectSelectedAreas,
  selectSensorParameter,
  selectMetricIndex,
  selectMetricData,
  selectMetrics,
} = sensorDataSlice.selectors

