import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { legacyStoreSlice } from './slices/legacyStoreSlice';
import { staticDataSlice } from './slices/staticDataSlice';
import { locationsSlice } from './slices/locationsSlice';

const store = configureStore({
  reducer: {
    legacy: legacyStoreSlice.reducer,
    // New slice state accessible under state.user
    locations: locationsSlice.reducer,
    staticData: staticDataSlice.reducer,
  }
  // , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});

export { store }
