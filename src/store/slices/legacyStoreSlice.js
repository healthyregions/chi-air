import { INITIAL_STATE } from "../../constants/defaults";
import centroid from "@turf/centroid";
import { generateQuantileBins } from "../../utils";
import { createSlice } from "@reduxjs/toolkit";

export const legacyStoreSlice = createSlice({
  name: 'legacy',
  initialState: INITIAL_STATE,
  reducers: {
    resetState: (state, action) => {
      return {
        ...state,
        ...INITIAL_STATE,
        ranges: state.ranges,
        storedGeojson: state.storedGeojson,
      };
    },
    loadDataAndBins: (state, action) => {
      const bins = action.payload.bins
        ? action.payload.bins
        : generateQuantileBins(
          action.payload.geojsonData,
          state.mapParams.colorScale,
          { ...state.mapParams }["accessor"],
          state.mapParams
        );
      const mapParamsObj = {
        ...state.mapParams,
        bins,
      };

      let centroidsArray = [];
      let columnValues = {};
      // const columnNames = Object.keys(action.payload.geojsonData.features[0].properties);\
      const columnNames = state.columnNames;

      for (let n = 0; n < columnNames.length; n++) {
        columnValues[columnNames[n]] = {
          min: 1e10,
          max: -1e10,
        };
      }

      for (let i = 0; i < action.payload.geojsonData.features.length; i++) {
        centroidsArray.push({
          feature: centroid(action.payload.geojsonData.features[i]),
          GEOID: action.payload.geojsonData.features[i].properties.geoid,
        });
        for (let n = 0; n < columnNames.length; n++) {
          if (
            action.payload.geojsonData.features[i].properties[
              columnNames[n]
              ] !== null &&
            action.payload.geojsonData.features[i].properties[columnNames[n]] <
            columnValues[columnNames[n]].min
          )
            columnValues[columnNames[n]].min =
              action.payload.geojsonData.features[i].properties[columnNames[n]];

          if (
            action.payload.geojsonData.features[i].properties[
              columnNames[n]
              ] !== null &&
            action.payload.geojsonData.features[i].properties[columnNames[n]] >
            columnValues[columnNames[n]].max
          )
            columnValues[columnNames[n]].max =
              action.payload.geojsonData.features[i].properties[columnNames[n]];
        }
      }
      const num_steps = 19;

      for (let n = 0; n < columnNames.length; n++) {
        const currMin = columnValues[columnNames[n]].min;
        const currMax = columnValues[columnNames[n]].max;
        const range = currMax - currMin;
        const step = range / num_steps;

        let binArray = [currMin];

        for (let x = 1; x <= num_steps; x++) {
          binArray.push(currMin + step * x);
        }

        columnValues[columnNames[n]]["histogramBins"] = binArray;
      }

      return {
        ...state,
        storedGeojson: action.payload.geojsonData ? action.payload.geojsonData : action.payload,
        mapParams: mapParamsObj,
        centroids: centroidsArray,
        ranges: columnValues,
      };
    },
    changeVariable: (state, action) => {
      if (!action.payload?.params) {
        return {
          ...state,
          storedGeojson: {},
          bins: [],
          colorScale: [],
        };
      }
      const bins = action.payload.params.bins
        ? action.payload.params.bins
        : generateQuantileBins(
          state.storedGeojson,
          action.payload.params.colorScale || state.mapParams.colorScale,
          { ...state.mapParams, ...action.payload.params }["accessor"],
          action.payload.params
        );
      const mapParams = {
        ...state.mapParams,
        ...action.payload.params,
        overlay:
          action.payload.params.custom === "aq_grid" ? "aq" : "community_areas",
        bins,
        useCustom: false,
      };

      return {
        ...state,
        mapParams,
        use3d: false,
      };
    },
    toggle3D: (state) => ({
      ...state,
      use3d: !state.use3d,
    }),
    toggleCustom: (state) => ({
      ...state,
      mapParams: {
        ...state.mapParams,
        useCustom: !state.mapParams.useCustom,
      },
      use3d: true,
    }),
    loadAqData: (state, action) => ({
      ...state,
      aqSummary: action.payload.aqSummary,
      aqIdw: action.payload.aqIdw,
    }),
    setAqLastUpdated: (state, action) => ({
      ...state,
      aqLastUpdated: action.payload,
    }),
    applyFilterValues: (state, action) => {
      const filterValuesObject =
        typeof action.payload.range === "string"
          ? {
            ...state.filterValues,
            [action.payload.name]: [
              ...(state.filterValues[action.payload.name] || []),
              action.payload.range,
            ],
          }
          : {
            ...state.filterValues,
            [action.payload.name]: action.payload.range,
          };

      return {
        ...state,
        filterValues: filterValuesObject,
      };
    },
    removeFilterValues: (state, action) => {
      const removeFilterValuesObject = {
        ...state.filterValues,
      };
      delete removeFilterValuesObject[action.payload.name];

      return {
        ...state,
        filterValues: removeFilterValuesObject,
      };
    },
    removeFilterEntry: (state, action) => {
      const removedEntryValuesObject = {
        ...state.filterValues,
        [action.payload.name]: state.filterValues[action.payload.name].filter(
          (o) => o !== action.payload.value
        ),
      };
      return {
        ...state,
        filterValues: removedEntryValuesObject,
      };
    },
    setGeoid: (state, action) => ({
      ...state,
      currentGeoid: action.payload.geoid,
    }),
    setStoredData: (state, action) => {
      let obj = {
        ...state.storedData,
      };
      obj[action.payload.name] = action.payload.data;
      return {
        ...state,
        storedData: obj,
      };
    },
    setStoredGeojson: (state, action) => {
      let geojsonObj = {
        ...state.storedGeojson,
      };
      geojsonObj[action.payload.name] = action.payload.data;
      return {
        ...state,
        storedGeojson: geojsonObj,
      };
    },
    setStoredLisaData: (state, action) => {
      // let lisaObj = {
      //     ...state.storedLisaData,
      // }
      // lisaObj[action.payload.name] = action.payload.data
      return {
        ...state,
        storedLisaData: action.payload.data,
      };
    },
    setStoredCartogramData: (state, action) => {
      // let cartoObj = {
      //     ...state.storedCartogramData,
      // }
      // cartoObj[action.payload.name] = action.payload.data
      return {
        ...state,
        storedCartogramData: action.payload.data,
      };
    },
    setStoredMobilityData: (state, action) => {
      return {
        ...state,
        storedMobilityData: action.payload.data,
      };
    },
    setCentroids: (state, action) => {
      let centroidsObj = {
        ...state.centroids,
      };
      centroidsObj[action.payload.name] = action.payload.data;
      return {
        ...state,
        centroids: centroidsObj,
      };
    },
    setCurrentData: (state, action) => ({
      ...state,
      currentData: action.payload.data,
    }),
    setGeodaProxy: (state, action) => ({
      ...state,
      geodaProxy: action.payload.proxy,
    }),
    setDates: (state, action) => ({
      ...state,
      dates: action.payload.data,
    }),
    setDataFunction: (state, action) => ({
      ...state,
      currentDataFn: action.payload.fn,
    }),
    setColumnNames: (state, action) => ({
      ...state,
      cols: {
        ...state.cols,
        [action.payload.name]: action.payload.data,
      }
    }),
    setCurrDate: (state, action) => ({
      ...state,
      currDate: action.payload.date,
    }),
    setDateIndex: (state, action) => ({
      ...state,
      currDateIndex: action.payload.index,
    }),
    setStartDateIndex: (state, action) => ({
      ...state,
      startDateIndex: action.payload.index,
    }),
    setBins: (state, action) => ({
      ...state,
      bins: {
        bins: action.payload.bins,
        breaks: action.payload.breaks
      },
    }),
    /**
     * @deprecated This method is deprecated. Use the toggle3d() instead.
     */
    set3D: (state, action) => ({
      ...state,
      use3D: !state.use3D,
    }),
    setDataSidebar: (state, action) => ({
      ...state,
      sidebarData: action.payload.data,
    }),
    setPanelState: (state, action) => ({
      ...state,
      panelState: {
        ...state.panelState,
        ...action.payload,
      },
    }),
    setVariableName: (state, action) => ({
      ...state,
      currentVariable: action.payload.name,
    }),
    setSelectionData: (state, action) => ({
      ...state,
      selectionData: action.payload,
    }),
    appendSelectionData: (state, action) => {
      const appendedChartData = state.chartData;
      const countCol = action.payload.data.name + " Daily Count";
      const sumCol = action.payload.data.name + " Total Cases";

      for (let i = 0; i < appendedChartData.length; i++) {
        appendedChartData[i][countCol] =
          action.payload.data.values[i][countCol];
        appendedChartData[i][sumCol] = action.payload.data.values[i][sumCol];
      }

      return {
        ...state,
        chartData: appendedChartData,
        selectionKeys: [
          action.payload.data.name,
          ...state.selectionKeys,
        ],
        selectionIndex: [
          action.payload.data.index,
          ...state.selectionIndex,
        ],
      };
    },
    removeSelectionData: (state, action) => {
      const removedSelectionNames = [...state.selectionKeys];
      let tempRemoveIndex = removedSelectionNames.indexOf(
        action.payload.data.name
      );
      removedSelectionNames.splice(tempRemoveIndex, 1);

      const removedSelectionIndex = [...state.selectionIndex];
      tempRemoveIndex = removedSelectionIndex.indexOf(
        action.payload.data.index
      );
      removedSelectionIndex.splice(tempRemoveIndex, 1);

      return {
        ...state,
        selectionKeys: removedSelectionNames,
        selectionIndex: removedSelectionIndex,
      };
    },
    setAnchorEl: (state, action) => ({
      ...state,
      anchorEl: action.payload.anchorEl,
    }),
    setMapLoaded: (state, action) => ({
      ...state,
      mapLoaded: action.payload.loaded,
    }),
    setNotification: (state, action) => ({
      ...state,
      notification: action.payload.info,
    }),
    setMapParams: (state, action) => ({
      ...state,
      mapParams: {
        ...state.mapParams,
        ...action.payload,
      },
    }),
    openContextMenu: (state, action) => {
      return {
        ...state,
        panelState: {
          ...state.panelState,
          context: true,
          contextPos: {
            x: action.payload.params.x,
            y: action.payload.params.y,
          },
        },
      };
    },
  },
  selectors: {
    selectStoredGeojson: state => state.storedGeojson,
    selectColumnNames: state => state.columnNames,
    selectMapParams: state => state.mapParams,
    selectRanges: state => state.ranges,
    selectAnchorEl: state => state.anchorEl,
    selectPanelState: state => state.panelState,
    selectUse3d: state => state.use3d,
    selectCentroids: state => state.centroids,

    selectSelectionData: state => state.selectionData,
    selectFilterValues: state => state.filterValues,
    selectUrlParams: state => state.urlParams,

    // Helper accessors for common panels
    selectVariablePanelState: state => state.panelState.variables,
    selectDataPanelState: state => state.panelState.info,


    /**
     * Parameterized selector on title for panel
     *    Usage: const myPanelState = useSelector(selectPanelStateByTitle('myPanelTitle)) )
     *
     * @param title the title/key of the panel to describe
     * @returns {function(*): *} a selector for the panel matching the given title
     */
    selectPanelStateByTitle: title => state => state.legacy.panelState[title],

  }
});

// Actions will update the state
//    write-only, useDispatch
export const {
  loadDataAndBins,
  setPanelState,
  setMapParams,
  applyFilterValues,
  removeFilterValues,
  changeVariable,
  resetState,
  setSelectionData,
} = legacyStoreSlice.actions;

// Our read-only selectors
//    read-only, useSelector
export const {
  selectMapParams,
  selectRanges,
  selectPanelState,
  selectPanelStateByTitle,
  selectSelectionData,
  selectUrlParams,
  selectFilterValues,
  selectUse3d,
  selectStoredGeojson,
  selectCentroids,
  selectColumnNames,
} = legacyStoreSlice.selectors
