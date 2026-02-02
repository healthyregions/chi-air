import {createSlice, createEntityAdapter, createSelector} from '@reduxjs/toolkit';

const sensorsAdapter = createEntityAdapter();

const initialState = {
  sensors: {
    /*
      "sensor_01": { id: "sensor_01", name: "Temperature" },
      "sensor_02": { id: "sensor_02", name: "Humidity" }
     */
    byId: {},
    // "sensor_01", "sensor_02"
    allIds: []
  },
  /*
    "sensor_01": { hourly: [], daily: [], weekly: [], monthly: [], seasonal: [], yearly: [] },
    "sensor_02": {  ...  }
   */
  readings: {},
  status: {
    loading: false,
    error: null,
    lastUpdated: "..."
  }
};

export const staticDataSlice = createSlice({
  name: 'staticData',
  initialState,
  reducers: {}, // No reducers needed for read-only data
});

