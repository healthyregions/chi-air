import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAreas: {
    community: [],
    zip: [],
    ward: [],
  },
  selectedSensors: [],
  locations: [],
  mean_pm25: [],
  geojsonData: {},
  clickedSensor: undefined,
  averageType: 'hour',
  locale: 'en',
};

export const sensorDataSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    setSelectedAreas: (state, action) => ({
      ...state,
      selectedAreas: {
        ...state.selectedAreas,
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
    setSensorGeojsonData: (state, action) => ({
      ...state,
      geojsonData: action.payload,
    }),
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
  }
});

// useDispatch + an action to update the state
export const {
  setSensorLocations,
  setSensorValuesMeanPm25,
  addSensorsToSelection,
  removeSensorsFromSelection,
  setSensorGeojsonData,
  setSelectedSensors,
  setClickedSensor,
  setAverageType,
  setLocale,
  setSelectedAreas,
} = sensorDataSlice.actions;

// useSelector + a selector to read the state
export const {
  selectSensorLocations,
  selectSensorValuesMeanPm25,
  selectSelectedSensors,
  selectSensorGeojsonData,
  selectClickedSensor,
  selectAverageType,
  selectLocale,
  selectSelectedAreas,
} = sensorDataSlice.selectors

