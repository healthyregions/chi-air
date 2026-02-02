import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sensors: []
}

export const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {}, // No reducers needed for read-only data
});

