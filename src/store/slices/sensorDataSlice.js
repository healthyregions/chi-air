import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSensors: [],
  locations: [],
  mean_pm25: [],
  mean_pm25_metadata: {},
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
        ...state.selectedSensors.filter(s => s === action.payload)
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
    setSensorValuesMeanPm25Metadata: (state, action) => ({
        ...state,
        mean_pm25_metadata: action.payload,
    }),
  },
  selectors: {
    selectSensorLocations: state => state.locations,
    selectSensorValuesMeanPm25: state => state.mean_pm25,
    selectSensorValuesMeanPm25Metadata: state => state.mean_pm25_metadata,
  }
});

// useDispatch + an action to update the state
export const {
  setSensorLocations,
  setSensorValuesMeanPm25,
  setSensorValuesMeanPm25Metadata,
} = sensorDataSlice.actions;

// useSelector + a selector to read the state
export const {
  selectSensorLocations,
  selectSensorValuesMeanPm25,
  selectSensorValuesMeanPm25Metadata,
} = sensorDataSlice.selectors

