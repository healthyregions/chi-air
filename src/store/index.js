import { configureStore } from '@reduxjs/toolkit';
import { legacyStoreSlice } from './slices/legacyStoreSlice';
import { sensorDataSlice } from './slices/sensorDataSlice';

const store = configureStore({
  reducer: {
    legacy: legacyStoreSlice.reducer,
    // New slice state accessible under state.user
    sensorData: sensorDataSlice.reducer,
  }
  // , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});

export { store }
