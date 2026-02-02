import { INITIAL_STATE } from "../constants/defaults";
import centroid from "@turf/centroid";
import { generateQuantileBins } from "../utils";
import {createSelector, createSlice} from "@reduxjs/toolkit";
import {defaultVariable} from "../config";

/** @deprecated use legacyStoreSlice.actions instead */
export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "DATA_LOAD":
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
        storedGeojson: action.payload.geojsonData,
        mapParams: mapParamsObj,
        centroids: centroidsArray,
        ranges: columnValues,
      };
    case "CHANGE_VARIABLE": {
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
    }
    case "TOGGLE_3D": {
      return {
        ...state,
        use3d: !state.use3d,
      };
    }
    case "TOGGLE_CUSTOM": {
      return {
        ...state,
        mapParams: {
          ...state.mapParams,
          useCustom: !state.mapParams.useCustom,
        },
        use3d: true,
      };
    }
    case "LOAD_AQ_DATA": {
      const { aqSummary, aqIdw } = action.payload;
      return {
        ...state,
        aqSummary,
        aqIdw,
      };
    }
    case "SET_AQ_LAST_UPDATED": {
      return {
        ...state,
        aqLastUpdated: action.payload,
      };
    }
    case "APPLY_FILTER_VALUES":
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
    case "REMOVE_FILTER_VALUES":
      const removeFilterValuesObject = {
        ...state.filterValues,
      };
      delete removeFilterValuesObject[action.payload.name];

      return {
        ...state,
        filterValues: removeFilterValuesObject,
      };
    case "REMOVE_FILTER_ENTRY":
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
    case "SET_GEOID":
      return {
        ...state,
        currentGeoid: action.payload.geoid,
      };
    case "SET_STORED_DATA":
      let obj = {
        ...state.storedData,
      };
      obj[action.payload.name] = action.payload.data;
      return {
        ...state,
        storedData: obj,
      };
    case "SET_STORED_GEOJSON":
      let geojsonObj = {
        ...state.storedGeojson,
      };
      geojsonObj[action.payload.name] = action.payload.data;
      return {
        ...state,
        storedGeojson: geojsonObj,
      };
    case "SET_STORED_LISA_DATA":
      // let lisaObj = {
      //     ...state.storedLisaData,
      // }
      // lisaObj[action.payload.name] = action.payload.data
      return {
        ...state,
        storedLisaData: action.payload.data,
      };
    case "SET_STORED_CARTOGRAM_DATA":
      // let cartoObj = {
      //     ...state.storedCartogramData,
      // }
      // cartoObj[action.payload.name] = action.payload.data
      return {
        ...state,
        storedCartogramData: action.payload.data,
      };
    case "SET_STORED_MOBILITY_DATA":
      return {
        ...state,
        storedMobilityData: action.payload.data,
      };
    case "SET_CENTROIDS":
      let centroidsObj = {
        ...state.centroids,
      };
      centroidsObj[action.payload.name] = action.payload.data;
      return {
        ...state,
        centroids: centroidsObj,
      };
    case "SET_CURRENT_DATA":
      return {
        ...state,
        currentData: action.payload.data,
      };
    case "SET_GEODA_PROXY":
      return {
        ...state,
        geodaProxy: action.payload.proxy,
      };
    case "SET_DATES":
      return {
        ...state,
        dates: action.payload.data,
      };
    case "SET_DATA_FUNCTION":
      return {
        ...state,
        currentDataFn: action.payload.fn,
      };
    case "SET_COLUMN_NAMES":
      let colObj = {
        ...state.cols,
      };
      colObj[action.payload.name] = action.payload.data;
      return {
        ...state,
        cols: colObj,
      };
    case "SET_CURR_DATE":
      return {
        ...state,
        currDate: action.payload.date,
      };
    case "SET_DATE_INDEX":
      return {
        ...state,
        currDateIndex: action.payload.index,
      };
    case "SET_START_DATE_INDEX":
      return {
        ...state,
        startDateIndex: action.payload.index,
      };
    case "SET_BINS":
      let binsObj = {};
      binsObj["bins"] = action.payload.bins;
      binsObj["breaks"] = action.payload.breaks;
      return {
        ...state,
        bins: binsObj,
      };
    case "SET_3D":
      return {
        ...state,
        use3D: !state.use3D,
      };
    case "SET_DATA_SIDEBAR":
      return {
        ...state,
        sidebarData: action.payload.data,
      };
    case "SET_PANELS":
      let panelsObj = {
        ...state.panelState,
        ...action.payload.params,
      };
      return {
        ...state,
        panelState: panelsObj,
      };
    case "SET_VARIABLE_NAME":
      return {
        ...state,
        currentVariable: action.payload.name,
      };
    case "SET_SELECTION_DATA":
      return {
        ...state,
        selectionData: action.payload.data,
      };
    case "APPEND_SELECTION_DATA":
      let appendedChartData = state.chartData;
      let countCol = action.payload.data.name + " Daily Count";
      let sumCol = action.payload.data.name + " Total Cases";

      for (let i = 0; i < appendedChartData.length; i++) {
        appendedChartData[i][countCol] =
          action.payload.data.values[i][countCol];
        appendedChartData[i][sumCol] = action.payload.data.values[i][sumCol];
      }

      let appendedSelectionNames = [
        action.payload.data.name,
        ...state.selectionKeys,
      ];
      let appendedSelectionIndex = [
        action.payload.data.index,
        ...state.selectionIndex,
      ];

      return {
        ...state,
        chartData: appendedChartData,
        selectionKeys: appendedSelectionNames,
        selectionIndex: appendedSelectionIndex,
      };
    case "REMOVE_SELECTION_DATA":
      let removedSelectionNames = [...state.selectionKeys];
      let tempRemoveIndex = removedSelectionNames.indexOf(
        action.payload.data.name
      );
      removedSelectionNames.splice(tempRemoveIndex, 1);

      let removedSelectionIndex = [...state.selectionIndex];
      tempRemoveIndex = removedSelectionIndex.indexOf(
        action.payload.data.index
      );
      removedSelectionIndex.splice(tempRemoveIndex, 1);

      return {
        ...state,
        selectionKeys: removedSelectionNames,
        selectionIndex: removedSelectionIndex,
      };
    case "SET_ANCHOR_EL":
      return {
        ...state,
        anchorEl: action.payload.anchorEl,
      };
    case "SET_MAP_LOADED":
      return {
        ...state,
        mapLoaded: action.payload.loaded,
      };
    case "SET_NOTIFICATION":
      return {
        ...state,
        notification: action.payload.info,
      };
    case "SET_MAP_PARAMS":
      const paramsChangeObj = {
        ...state.mapParams,
        ...action.payload.params,
      };

      return {
        ...state,
        mapParams: paramsChangeObj,
      };
    // case 'SET_URL_PARAMS':
    //     const { urlParams, presets } = action.payload;

    //     let preset = urlParams.var ? presets[urlParams.var.replace(/_/g, ' ')] : {};

    //     let urlMapParamsObj = {
    //         ...state.mapParams,
    //         binMode: urlParams.dbin ? 'dynamic' : '',
    //         mapType: urlParams.mthd || state.mapParams.mapType,
    //         overlay: urlParams.ovr ||  state.mapParams.overlay,
    //         resource: urlParams.res || state.mapParams.resource,
    //         vizType: urlParams.viz || state.mapParams.vizType
    //     };

    //     let urlDataParamsObj = {
    //         ...state.mapParams,
    //         ...preset,
    //         nIndex: urlParams.date || state.mapParams.nIndex,
    //         nRange: urlParams.hasOwnProperty('range') ? urlParams.range === 'null' ? null : urlParams.range : state.mapParams.nRange,
    //         nProperty: urlParams.prop || state.mapParams.nProperty
    //     };

    //     let urlCoordObj = {
    //         lat: urlParams.lat || '',
    //         lon: urlParams.lon || '',
    //         z: urlParams.z || ''
    //     }

    //     let urlParamsSource = urlParams.src ?
    //         `${urlParams.src}.geojson` :
    //         state.currentData

    //     return {
    //         ...state,
    //         currentData: urlParamsSource,
    //         urlParams: urlCoordObj,
    //         mapParams: urlMapParamsObj,
    //         mapParams: urlDataParamsObj
    //     }
    case "OPEN_CONTEXT_MENU":
      let contextPanelsObj = {
        ...state.panelState,
        context: true,
        contextPos: {
          x: action.payload.params.x,
          y: action.payload.params.y,
        },
      };
      return {
        ...state,
        panelState: contextPanelsObj,
      };
    default:
      return state;
  }
}

export const legacyStoreSlice = createSlice({
  name: 'legacy',
  initialState: INITIAL_STATE,
  reducers: {
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
      console.log('columnNames', columnNames);

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
        ...action.payload.params,
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
  }
});



export const selectMapParams = (state) => state.mapParams;

export const {
  loadDataAndBins,
  setPanelState,
  setMapParams,
  applyFilterValues,
  removeFilterValues,
  changeVariable,
  setSelectionData,

} = legacyStoreSlice.actions;

export const selectors = legacyStoreSlice.selectors
