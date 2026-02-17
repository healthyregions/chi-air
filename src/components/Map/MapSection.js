// general imports, state
import React, {useState, useEffect, useRef, useCallback, useMemo} from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

// deck GL and helper function import
import { MapView, FlyToInterpolator } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { fitBounds } from "@math.gl/web-mercator";
import MapboxGLMap, {Marker, Popup} from "react-map-gl";
import { DataFilterExtension, FillStyleExtension } from "@deck.gl/extensions";

// component, action, util, and config import
import MapTooltipContent from "./MapTooltipContent";
import { scaleColor } from "../../utils";
import {
  colors,
  loadStickers,
  parsedOverlays,
  pm2_5Bins, pm2_5BorderColorMap,
  pm2_5ColorMap
} from "../../config";
import * as SVG from "../../config/svg";
import "mapbox-gl/dist/mapbox-gl.css";
import { useChivesData } from "../../hooks/useChivesData";
import { useChivesWorkerQuery } from "../../hooks/useChivesWorkerQuery";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { useControl } from "react-map-gl";
import MapOverlayTooltipContent from "./MapOverlayTooltipContent";

import {
  selectFilterValues,
  selectMapParams,
  selectPanelState,
  selectUrlParams,
  selectUse3d
} from "../../store/slices/legacyStoreSlice";
import MapMarkerPin from "./MapMarkerPin";
import MapMarkerPopup from "./MapMarkerPopup";
import {selectSensorLocations, selectSensorValuesMeanPm25} from "../../store/slices/sensorDataSlice";

function DeckGLOverlay(props) {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay?.setProps(props);
  return null;
}

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;


// const getRightMargin = () =>
//   window.innerWidth * 0.15 < 250 ? 260 : window.innerWidth * 0.15 + 10;

// component styling
const MapContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: 250ms all;
  background: ${colors.white};
  overflow: hidden;
  @media (max-width: 600px) {
    div.mapboxgl-ctrl-geocoder {
      display: none;
    }
    width: 100%;
  }
  @media (max-width: 768px) {
    div.mapboxgl-ctrl-bottom-right {
      transform: translateY(-60px);
    }
    div.mapboxgl-ctrl-bottom-left {
      transform: translate(30px, -60px);
    }
  }
`;


const HoverDiv = styled.div`
  background: ${colors.white};
  padding: 20px;
  color: ${colors.black};
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.7);
  border-radius: 0 15px 15px 15px;
  h3 {
    margin: 5px 0;
  }
  hr {
    margin: 5px 0;
  }
  max-width: 50ch;
  line-height: 1.5;
  table {
    border-collapse: collapse;
  }
  table tr:nth-of-type(even) {
    background: ${colors.chicagoLightBlue};
  }
  table tr td {
    padding: 2px 0;
  }
  table tr td:nth-of-type(1) {
    padding-right: 10px;
  }
`;

const MapButtonContainer = styled.div`
  position: absolute;
  right: ${(props) =>
    props.infoPanel ? "0.75em" : "0.75em"};
  bottom: 0;
  z-index: 10;
  transition: 250ms all;
  @media (max-width: 1000px) {
    right: ${(props) => (props.infoPanel ? "35%" : "0.75em")};
  }
  @media (max-width: 768px) {
    bottom: 100px;
  }
  @media (max-width: 400px) {
    transform: scale(0.75) translate(20%, 20%);
  }
  @media (max-width: 600px) {
    right: 0.75em;
  }
`;

const NavInlineButtonGroup = styled.div`
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
  -moz-box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
`;

const NavInlineButton = styled.button`
  width: 29px;
  height: 29px;
  padding: 5px;
  display: block;
  fill: rgb(60, 60, 60);
  background-color: ${(props) =>
    props.isActive ? colors.lightblue : colors.buttongray};
  outline: none;
  border: none;
  transition: 250ms all;
  cursor: pointer;
  :after {
    opacity: ${(props) => (props.shareNotification ? 1 : 0)};
    content: "Map Link Copied to Clipboard!";
    background: ${colors.buttongray};
    -moz-box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    position: absolute;
    transform: translate(-120%, -25%);
    padding: 5px;
    width: 150px;
    pointer-events: none;
    max-width: 50vw;
    transition: 250ms all;
  }
  svg {
    transition: 250ms all;
    transform: ${(props) => (props.tilted ? "rotate(30deg)" : "none")};
  }
`;

/*const GeocoderContainer = styled.div`
  position: fixed;
  left: 130px;
  top: 7px;
  z-index: 500;
  width: 230px;
  height: 45px;
  @media (max-width: 600px) {
    display: none;
  }
`;*/


function MapSection({ setViewStateFn = () => {}, bounds, geoids = [], showSearch = true, showCustom = false }) {
  const locations = useSelector(selectSensorLocations);
  const mean_pm25 = useSelector(selectSensorValuesMeanPm25);

  // fetch pieces of state from store
  const { storedGeojson } = useChivesData();
  const panelState = useSelector(selectPanelState);
  const mapParams = useSelector(selectMapParams);
  const urlParams = useSelector(selectUrlParams);
  const filterValues = useSelector(selectFilterValues);
  const use3d = useSelector(selectUse3d);
  // component state elements
  // hover and highlight geographies
  const [hoverInfo, setHoverInfo] = useState({
    x: null,
    y: null,
    object: null,
  });
  const [hoverGeog, setHoverGeog] = useState(null);
  const [overlayHover, setOverlayHover] = useState({
    x: null,
    y: null,
    object: null,
  });
  const [censorPopupFeature, setCensorPopupFeature] = useState(null);

  // AQ monitoring stations as stickers (similar to ChiVes community stickers)
  const [stickers, setStickers] = useState([]);
  useEffect( () => {
    loadStickers('/content/stickers.json').then(s => setStickers(s))
  }, []);
  const mapStickers = useMemo(() =>
    stickers?.map((sticker, index) => (
      <Marker
        key={`marker-${index}`}
        longitude={sticker.long||sticker.longitude}
        latitude={sticker.lat||sticker.latitude}
        anchor="bottom"
        offset={[7, 8]}
        onClick={e => {
          // If we let the click event propagates to the map, it will immediately close the popup
          // with `closeOnClick: true`
          //e.originalEvent.stopPropagation();
          setPopupInfo(null);
          setPopupInfo(sticker);
        }}
      >
        <MapMarkerPin size={32} imgSrc={sticker?.icon} imgAlt={sticker?.title} />
      </Marker>
    )), [stickers]);


  const [popupInfo, setPopupInfo] = useState(null);
  const mapRef = useRef(null);

  const handlePanMap = (viewState) => {
    mapRef?.current?.flyTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      bearing: viewState.bearing,
      pitch: viewState.pitch,
    });
  };
  const hoverRef = useRef();
  const hoverCcRef = useRef();
  const viewRef = useRef(null);
  const mapContainerRef = useRef(null);
  // map view location
  const [viewState, setViewState] = useState({
    latitude: +urlParams.lat || bounds.latitude,
    longitude: +urlParams.lon || bounds.longitude,
    zoom: +urlParams.z || bounds.zoom,
    bearing: 0,
    pitch: 0,
  });

  const mapIsTilted =
    viewRef.current?.bearing !== 0 || viewRef.current?.pitch !== 0;

  useEffect(() => {
    setViewState(bounds);
    handlePanMap(bounds);
  }, [JSON.stringify(bounds)]); //eslint-disable-line

  useEffect(() => {
    setViewStateFn(setViewState);
  }, []); //eslint-disable-line

  useEffect(() => {
    mapContainerRef.current.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }, []);

  useEffect(() => {
    setViewState((view) => ({
      ...view,
      latitude: +urlParams.lat || bounds.latitude,
      longitude: +urlParams.lon || bounds.longitude,
      zoom: +urlParams.z || bounds.zoom,
      bearing: 0,
      pitch: 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParams]);

  useEffect(() => {
    let handler = (e) => {
      if (hoverRef.current && !hoverRef.current.contains(e.target)) {
        setHoverInfo({ x: null, y: null, object: null });
      }
    };
    document.addEventListener("mousedown", handler);
  });
  const GetMapView = () => {
    try {
      const currView = viewRef.current;
      return currView || { ...viewState };
    } catch {
      return { ...viewState };
    }
  };

  const deckRef = useRef({
    deck: {
      viewState: {
        MapView: {
          ...viewState,
        },
      },
    },
  });
  const { queryViewport } = useChivesWorkerQuery(deckRef);

  const handleMapClick = ({ x, y, object }, overlay) => {
    if (overlay?.popupContent) {
      // Overlay point was clicked - show overlay popup, hide census tract popup
      setHoverGeog(null);
      setHoverInfo({ x: null, y: null, object: null });
      setOverlayHover({x, y, object: object.properties, overlay: overlay});
    } else if (object?.properties?.geoid) {
      // Non-point map section was clicked - hide overlay popup, show census tract popup
      setOverlayHover({ x: null, y: null, object: null, overlay: null });
      setHoverGeog(object.properties.geoid);
      setHoverInfo({x, y, object: object.properties});
    } else if (!object?.properties) {
      // User clicked outside of the visualized map area - hide all popups
      setOverlayHover({ x: null, y: null, object: null, overlay: null });
      setHoverGeog(null);
      setHoverInfo({ x: null, y: null, object: null });
    }
  };

  const handleGeolocate = async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const currMapView = GetMapView();
      handlePanMap({
        ...currMapView,
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        zoom: 14,
      });
    });
  };

  const handleZoom = (zoom) => {
    const currMapView = GetMapView();
    handlePanMap({
      ...currMapView,
      zoom: currMapView.zoom + zoom,
    });
  };
  const handleTilt = () => {
    const currMapView = GetMapView();
    handlePanMap({
      ...currMapView,
      pitch: 45,
      transitionDuration: 250,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const resetTilt = () => {
    const currMapView = GetMapView();
    handlePanMap({
      ...currMapView,
      bearing: 0,
      pitch: 0,
      transitionDuration: 250,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const handleGeocoder = useCallback((location) => {
    if (location.center !== undefined) {
      let center = location.center;
      let zoom = 13;

      if (location.bbox) {
        let bounds = fitBounds({
          width: window.innerWidth,
          height: window.innerHeight,
          bounds: [
            [location.bbox[0], location.bbox[1]],
            [location.bbox[2], location.bbox[3]],
          ],
        });
        center = [bounds.longitude, bounds.latitude];
        zoom = bounds.zoom * 0.9;
      }

      handlePanMap({
        longitude: center[0],
        latitude: center[1],
        zoom: zoom,
        bearing: 0,
        pitch: 0,
      });
    }
  }, []);

  const COLOR_SCALE = (x) =>
    scaleColor(x, mapParams.bins, mapParams.colorScale);

  const isVisible = (feature, filters) => {
    for (const property in filters) {
      if (typeof filters[property][0] === "string") {
        if (!filters[property].includes(feature.properties[property]))
          return false;
      } else {
        if (
          feature.properties[property] < filters[property][0] ||
          feature.properties[property] > filters[property][1]
        )
          return false;
        }
      }
      return true;
    };

      const DISPLACEMENT_COLOR_SCALE = {
        // Displacement Pressure
        '0': [225,225,225],
        'vulnerable, prices not rising': [252,146,114],
        'vulnerable, prices rising':  [222,45,38]
      };

  const mapAlphaFunc = (feature, color) => {
    const variableName = mapParams.variableName?.toLowerCase();
    switch (true) {
      // example of putting a legend on for a variable
      case variableName.toLowerCase().includes("displacement index"):
        const indexKey = String(feature.properties["HPRICETIER"]).toLowerCase();
        return (
          DISPLACEMENT_COLOR_SCALE[indexKey] || [
            0, 0, 0,
          ]
        );
      default:
        return color;
    }
  };

  const baseLayers = [
    new GeoJsonLayer({
      id: "highlighted-geoids",
      data: storedGeojson,
      pickable: false,
      stroked: true,
      filled: true,
      extruded: false,
      getFillColor: [232, 63, 111],
      getLineColor: [0, 0, 0, 120],
      getLineWidth: 1,
      lineWidthMaxPixels: 1,
      lineWidthMinPixels: 1,
      opacity: 0.5,
      getFilterValue: (d) => (geoids.includes(+d.properties.geoid) ? 1 : 0),
      visible: geoids.length === 0 && !mapParams.useCustom,
      filterRange: [1, 1],
      extensions: [new DataFilterExtension({ filterSize: 1 })],
      updateTriggers: {
        getFilterValue: JSON.stringify(geoids),
        visible: [geoids.length, mapParams.useCustom],
      },
      transitions: {
        getFillColor: 250,
      },
      beforeId: "water",
    }),
    new GeoJsonLayer({
      id: "choropleth",
      data: storedGeojson,
      pickable: true,
      stroked: false,
      filled: true,
      extruded: false,
      getFillColor: (feature) => {
        if (geoids) {
          if (geoids.includes(+feature.properties.geoid)) {
            return [232, 63, 111];
          }
        }
        const val = feature?.properties[mapParams.accessor];
        if ([null, undefined].includes(val)) {
          return [0, 0, 0, 0];
        } else {
          return mapAlphaFunc(feature, COLOR_SCALE(val));
        }
      },
      opacity: 1,
      onClick: handleMapClick,
      getFilterValue: (d) => (isVisible(d, filterValues) ? 1 : 0),
      filterRange: [1, 1],
      extensions: [new DataFilterExtension({ filterSize: 1 })],
      visible: geoids.length === 0 && !mapParams.useCustom,
      updateTriggers: {
        getFillColor: [
          storedGeojson.type,
          mapParams.variableName,
          mapParams.bins,
          mapParams.colorScale,
          JSON.stringify(geoids),
        ],
        visible: [geoids.length, mapParams.useCustom],
        getFilterValue: filterValues,
      },
      transitions: {
        getFillColor: 250,
      },
      beforeId: "water",
    }),

    new GeoJsonLayer({
      id: "highlightLayer",
      data: storedGeojson,
      opacity: 0.8,
      material: false,
      pickable: false,
      stroked: true,
      filled: true,
      lineWidthScale: 5,
      getLineColor: (d) =>
        d.properties.geoid === hoverGeog
          ? [65, 182, 230, 255]
          : [100, 100, 100, 0],
      getFillColor: (d) =>
        d.properties.geoid === hoverGeog
          ? [65, 182, 230, 120]
          : [65, 182, 230, 0],
      getLineWidth: 1,
      lineWidthMinPixels: 3,
      visible: geoids.length === 0 && !mapParams.useCustom,
      updateTriggers: {
        getLineColor: [hoverGeog],
        getFillColor: [hoverGeog],
        visible: [geoids.length, mapParams.useCustom],
      },
      transitions: {
        getLineColor: 250,
        getFillColor: 250,
      },
    }),
    new GeoJsonLayer({
      id: "parks",
      data: `${process.env.PUBLIC_URL}/geojson/parks.geojson`,
      pickable: false,
      stroked: false,
      filled: true,
      extruded: false,
      getFillColor: [0, 0, 0, 120],
      opacity: 1,
      fillPatternAtlas: `${process.env.PUBLIC_URL}/icons/park-pattern.png`,
      fillPatternMapping: {
        dot: {
          x: 0,
          y: 0,
          width: 128,
          height: 128,
          mask: true,
        },
      },
      getFillPattern: (f) => "dot",
      getFillPatternScale: (19 - GetMapView().zoom) / 8,
      getFillPatternOffset: [0, 0],
      extensions: [new FillStyleExtension({ pattern: true })],
      beforeId: "water",
    }),
  ];
  const customLayers = [];

  // Layers parsed from newer pattern for storing Data Overlays
  // See https://github.com/healthyregions/chicago-environment-explorer/issues/168
  const overlayLayers = parsedOverlays
      .filter(({ id }) => mapParams.overlays.includes(id))
      .map((parsedOverlay) => {
    const colors = JSON.parse(parsedOverlay.fillColor);
    return new GeoJsonLayer({
      // Accounting
      id: parsedOverlay.id,
      data: parsedOverlay.data,

      // Behavior
      pickable: parsedOverlay.geometryType === 'point',    // TODO: point data should be clickable (optionally?)

      // Look & Feel
      opacity: (JSON.stringify(colors) === JSON.stringify([0,0,0,0]) || JSON.stringify(colors) === JSON.stringify([0,0,0])) ? 1.0 : 0.8,
      material: false,
      stroked: !!parsedOverlay.lineColor,
      filled: !!parsedOverlay.fillColor,
      extruded: parsedOverlay.geometryType === 'point',
      getElevation: 20,
      //getPosition: (d) => [d.x_coordinate, d.y_coordinate],
      //getText: f => f.properties[parsedOverlay.symbolProp],
      getFillColor: Array.isArray(colors) ? colors : (feature) => {
        // If single color, use that color
        // If mapping of colors, choose color based on symbolProp
        const { symbolProp } = parsedOverlay;
        const symbolKey = feature.properties[symbolProp];

        if (typeof symbolKey === 'object' && symbolKey.sort) {
          // Treat as array of strings
          const key = symbolKey.sort().join(" & ");
          return colors[key];
        } else if (typeof symbolKey === 'object') {
          // Treat as a mapping of strings
          console.error('ERROR: Currently unsupported - please use an array of strings for your symbol instead');
        }

        return colors[symbolKey];
      },

      lineWidthScale: 1,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 4,

      getLineWidth: 1,
      getLineColor: Number(parsedOverlay.lineColor) || [0,0,0,255],

      getPointRadius: 4,
      getTextSize: 12,
      pointRadiusUnits: 'pixels',
      pointType: 'circle',
      onClick: (feature) => handleMapClick(feature, parsedOverlay),

      // Visibility
      visible: mapParams.overlays.includes(parsedOverlay?.id),
      updateTriggers: {
        visible: [mapParams.overlay, mapParams.overlays],
      },
      beforeId: "state-label",
    })
  });

  const sensorIds = [...new Set(locations.map(l => l.datasourceId))];
  //const geojsonUrl = "https://chicago-aq.s3.us-east-2.amazonaws.com/latest.geojson"
  const sortedHourlyRows = mean_pm25.filter(r => r.period === 'hour' || r.type === 'hour')
    .sort((a, b) => a.date.localeCompare(b.date))
    .reverse();
  const latestHourlyRow = sortedHourlyRows.find(() => true);
  const previousHourlyRow = sortedHourlyRows.slice(1).find(() => true);
  const geojsonData = {
    type: 'FeatureCollection',
    features: sensorIds.map((datasourceId) => {
      const location = locations.find(r => r.datasourceId === datasourceId);
      const metric_pm25 = mean_pm25.map((r) => ({
        period: r.period || r.type,
        date: r.date,
        [datasourceId]: r[datasourceId]
      }));

      return {
        type: 'Feature',
        geometry: {
          type: "Point",
          coordinates: [
            location.locationLongitude,
            location.locationLatitude
          ],
        },
        // Ensure this is valid GeoJSON format
        properties: {
          ...location,
          last_update: latestHourlyRow?.[datasourceId] ? latestHourlyRow?.['date'] : previousHourlyRow?.['date'],
          latest_mean_pm25: latestHourlyRow?.[datasourceId] || previousHourlyRow?.[datasourceId],
          mean_pm25: metric_pm25
        },
      }
    }),
  };
  baseLayers.push(
    new GeoJsonLayer({
      id: "sensors",
      data: geojsonData,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      getFillColor: (feature) => {
        // Detect loading state, display soft colors while loading
        if (Object.keys(latestHourlyRow)?.length <= 2) {
          return [229, 238, 245];
        }
        const latest = feature.properties.latest_mean_pm25;
        if (latest === null || latest === undefined || latest === "None" || latest === "NaN") {
          //return [79, 143, 197];
          return [200, 200, 200];
        }
        return scaleColor(latest, pm2_5Bins, Object.values(pm2_5ColorMap));
      },
      opacity: .85,
      getPointRadius: 400,
      getLineWidth: 35,
      getLineColor: (feature) => {
        // Detect loading state, display soft colors while loading
        if (Object.keys(latestHourlyRow)?.length <= 2) {
          return [79, 143, 197];
        }
        const latest = feature.properties.latest_mean_pm25;
        if (latest === "None" || latest === "NaN" || latest === null || latest === undefined) {
          return [229, 238, 245];
          //return [68, 68, 68];
        }
        return scaleColor(latest, pm2_5Bins, Object.values(pm2_5BorderColorMap));
      },
      pointRadiusUnits: 'meters',
      visible: true,
      onClick: (feature) => {setCensorPopupFeature(feature)},
      beforeId: "state-label",
      onHover: (info, event) => {setHoverInfo({x:null, y:null, object:{
        popupTitle: "{datasourceId}",
        popupContent: `{"id": "datasourceId"}`
      }})}
    })
  )
  const allLayers = [...baseLayers, ...customLayers, overlayLayers];

  useEffect(() => {
    if (use3d) {
      handleTilt();
    } else {
      resetTilt();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [use3d]);

  const view = new MapView({ repeat: true });

  const getCoolingCenterTooltip = ({object}) => {
    return object && (object.properties.site_name) &&
        (`${object.properties.site_type}: ${object.properties.site_name}\n` +
            (object.properties.address ? object.properties.address + '\n' : '') +
            (object.properties.phone ? object.properties.phone + '\n' : '') +
            (object.properties.hours_of_operation ? object.properties.hours_of_operation : ''));
  }

  return (
    <MapContainer infoPanel={panelState.info} ref={mapContainerRef}>
      <MapboxGLMap
        ref={mapRef}
        mapStyle={
          "mapbox://styles/herop-lab/cloho6j71001s01ns3fna60uj"
        }
        preserveDrawingBuffer={true}
        preventStyleDiffing={true}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        initialViewState={viewState}
        controller={{
          dragRotate: true,
          dragPan: true,
          doubleClickZoom: true,
          touchZoom: true,
          touchRotate: true,
          keyboard: true,
          scrollZoom: true,
          inertia: 100,
        }}
        views={view}
        pickingRadius={20}
        onMove={(e) => {
          queryViewport({
            ...(e?.viewState || {}),
            width: window.innerWidth,
            height: window.innerHeight,
          });
          viewRef.current = e.viewState;
          overlayHover.object &&
            handleMapClick({ x: null, y: null, object: null }, null);
          setCensorPopupFeature(null)
        }}
        onViewportLoad={(e) => {
          queryViewport({
            ...(e?.viewState || {}),
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }}
        onLoad={(e) => {
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          if (urlParams.has("lat") && urlParams.has("lon")) {
            const center = [+urlParams.get("lon"), +urlParams.get("lat")];
            handleGeocoder({
              center,
            });
          }
        }}
      >
        {mapParams.overlays.includes('aq-monitoring-sites') && mapStickers}
        {popupInfo && (
          <Popup
            anchor="top"
            className="sticker-marker-popup"
            closeOnClick={false}
            closeOnMove={true}
            maxWidth={'45vw'}
            longitude={Number(popupInfo.long||popupInfo.longitude)}
            latitude={Number(popupInfo.lat||popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <MapMarkerPopup sticker={popupInfo} />
          </Popup>
        )}
        <DeckGLOverlay
          interleaved={true}
          width={"100%"}
          height={"100%"}
          layers={allLayers}
          onClick={handleMapClick}
          getTooltip={getCoolingCenterTooltip}
        />
      </MapboxGLMap>
      {!geoids.length && (
        <MapButtonContainer infoPanel={panelState.info}>
          <NavInlineButtonGroup>
            <NavInlineButton
              title="Geolocate"
              id="geolocate"
              onClick={() => handleGeolocate()}
            >
              {SVG.locate}
            </NavInlineButton>
          </NavInlineButtonGroup>

          <NavInlineButtonGroup>
            <NavInlineButton
              title="Zoom In"
              id="zoomIn"
              onClick={() => handleZoom(0.5)}
            >
              {SVG.plus}
            </NavInlineButton>
            <NavInlineButton
              title="Zoom Out"
              id="zoomOut"
              onClick={() => handleZoom(-0.5)}
            >
              {SVG.minus}
            </NavInlineButton>
            <NavInlineButton
              title="Reset Tilt"
              id="resetTilt"
              tilted={mapIsTilted}
              onClick={() => resetTilt()}
            >
              {SVG.compass}
            </NavInlineButton>
          </NavInlineButtonGroup>
        </MapButtonContainer>
      )}
      {/*!geoids.length && showSearch && (
        <GeocoderContainer>
          <Geocoder
            id="Geocoder"
            placeholder={"Search for address..."}
            API_KEY={MAPBOX_ACCESS_TOKEN}
            onChange={handleGeocoder}
            height={36}
            style={{color:"red", borderColor:"green"}}
          />
        </GeocoderContainer>
      )*/}

      {hoverInfo.object && (
        <HoverDiv
          style={{
            position: "absolute",
            zIndex: 1,
            left: hoverInfo.x,
            top: hoverInfo.y,
          }}
          ref={hoverRef}
        >
          <MapTooltipContent content={hoverInfo.object} showCustom={showCustom} />
        </HoverDiv>
      )}
      {
        overlayHover.object &&
          <HoverDiv
              style={{
                position: "absolute",
                zIndex: 1,
                left: overlayHover.x,
                top: overlayHover.y,
              }}
              ref={hoverCcRef}
          >
           <MapOverlayTooltipContent content={overlayHover.object} overlay={overlayHover.overlay} />
          </HoverDiv>
      }
      {
        censorPopupFeature &&
          <HoverDiv
              style={{
                position: "absolute",
                zIndex: 1,
                left: censorPopupFeature.x,
                top: censorPopupFeature.y,
              }}
              ref={hoverCcRef}
          >
           <h3>{censorPopupFeature.object.properties.name}</h3>
           <ul>
            {Object.keys(censorPopupFeature.object.properties).map((key) => {
              const value = censorPopupFeature.object.properties[key];
              if (typeof value === 'object' && value?.sort) {
                return (
                  <div key={`sensor-popup-${key}`}>
                    Arrays Unsupported: {key}
                  </div>
                );
              } else if (typeof value === 'object' && !value?.sort) {
                return (<div key={`sensor-popup-${key}`}>Objects Unsupported: {key}</div>);
              }
              return <li key={`sensor-popup-${key}`}>{key}: {value}</li>
            })}
           </ul>
          </HoverDiv>
      }
    </MapContainer>
  );
}

export default MapSection;
