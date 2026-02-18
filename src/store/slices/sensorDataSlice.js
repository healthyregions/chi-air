import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSensors: [],
  locations: [],
  mean_pm25: [],
  geojsonData: {},
};

export const sensorDataSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
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
  }
});

// useDispatch + an action to update the state
export const {
  setSensorLocations,
  setSensorValuesMeanPm25,
  addSensorsToSelection,
  removeSensorsFromSelection,
  setSensorGeojsonData,
} = sensorDataSlice.actions;

// useSelector + a selector to read the state
export const {
  selectSensorLocations,
  selectSensorValuesMeanPm25,
  selectSelectedSensors,
  selectSensorGeojsonData,
} = sensorDataSlice.selectors

