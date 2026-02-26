import { configureStore } from '@reduxjs/toolkit';
import { legacyStoreSlice } from './slices/legacyStoreSlice';
import { sensorDataSlice } from './slices/sensorDataSlice';

export const store = configureStore({
  reducer: {
    legacy: legacyStoreSlice.reducer,
    // New slice state accessible under state.user
    sensors: sensorDataSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    //immutableCheck: false,
    serializableCheck: false,
  })
  // , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});
