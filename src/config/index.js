import rawVariables from './variables.json';
import rawCategories from './categories.json';
import rawOverlays from './overlays.json';

export const defaultData = 'chives-data.geojson';
export const defaultVariable = "";

// No further processing needed
export const variableCategories = rawCategories;
export const parsedOverlays = rawOverlays;

export const variablePresets = rawVariables.reduce(
  (obj, row) => Object.assign(obj,
    "HEADER" in row
      ? { ['HEADER::' + row['HEADER']]: { } }
      : row['active'] ? { [row['Variable Name']]: { ...row, accessor: row.Column } } : {}
    ), {});

export const dataDescriptions = rawVariables.reduce(
  (obj, row) => Object.assign(obj, {
    [row['Variable Name']]:
    <div>
      <span dangerouslySetInnerHTML={{ __html: row.Description }}></span>
      <br /><br />
      <b>Data Contributor:</b>{" "}<span dangerouslySetInnerHTML={{__html:row['Added By']}}/>
      <br />
      <b>Data Source</b>:{"  "}<span dangerouslySetInnerHTML={{__html:row['Data Source(s)']}}/>
      <br/>
      <b>Data Year</b>:{" "}{row['Data Year']}</div> }),
  {});


export const loadStickers = async (url) => {
  return await fetch(url).then(r => r.json());
}


// mapbox API token

export const colors = {
  white: '#ffffff',
  black: '#000000',
  darkgray: '#1a1a1a',
  gray: '#2b2b2b',
  buttongray: '#f5f5f5',
  lightgray: '#d8d8d8',
  yellow: '#FFCE00',
  lightblue: '#A1E1E3',
  purple: '#2d004b',
  red: '#EC1E24',
  strongOrange: '#F16622',
  orange: '#F37E44',
  skyblue: '#c1ebeb',
  blue: '#007bff',
  teal: '#00575c',
  // orange: '#f37e43',
  pink: '#e83e8c',
  ivory: '#fff',
  green: '#97DB4F',
  forest: '#3d6017',
  fuschia: '#e83f6f',
  cartoColors: {
    green: '#49c767',
    gold: '#e0d09d',
    gray: '#c7cfc9',
    slate: '#9db3e0',
    sky: '#9dcee0',
    pink: '#e09dd0',
    spring: '#9de0c3'
  },
  chicagoBlue: '#41B6E6',
  chicagoDarkBlue: '#005899',
  chicagoLightBlue: "#E1F3F8",
  chicagoRed: "#E4002B",
  paleyellow: "#F0C016",
}

// Based on 2026 EPA breakpoints for AQI + PM 2.5
// See https://aqs.epa.gov/aqsweb/documents/codetables/aqi_breakpoints.html
export const pm2_5Ranges = [
  { label: 'Good',                            aqi_min: 0, aqi_max: 51,      pm25_min: 0, pm25_max: 9.0,         color: "rgb(162, 217, 156)", border: "rgb(12, 115, 0)", colorComponents: [162, 217, 156], borderComponents: [12, 115, 0] },
  { label: 'Moderate',                        aqi_min: 51, aqi_max: 101,    pm25_min: 9.1, pm25_max: 35.4,      color: "rgb(248, 205, 70)", border: "rgb(122, 96, 17)", colorComponents: [248, 205, 70], borderComponents: [122, 96, 17]  },
  { label: 'Unhealthy for Sensitive Groups',  aqi_min: 101, aqi_max: 151,   pm25_min: 35.5, pm25_max: 55.4,     color: "rgb(220, 117, 0)", border: "rgb(222, 204, 183)", colorComponents: [220, 117, 0], borderComponents: [222, 204, 183]  },
  { label: 'Unhealthy',                       aqi_min: 151, aqi_max: 201,   pm25_min: 55.5, pm25_max: 125.4,    color: "rgb(228, 0, 4)", border: "rgb(233, 187, 187)", colorComponents: [228, 0, 4], borderComponents: [233, 187, 187]  },
  { label: 'Very Unhealthy',                  aqi_min: 201, aqi_max: 301,   pm25_min: 125.5, pm25_max: 225.4,   color: "rgb(130, 0, 197)", border: "rgb(207, 176, 224)", colorComponents: [130, 0, 197], borderComponents: [207, 176, 224]  },
  { label: 'Hazardous',                       aqi_min: 301, aqi_max: 1000,  pm25_min: 225.5, pm25_max: 100000,  color: "rgb(139, 13, 56)", border: "rgb(227, 115, 153)", colorComponents: [139, 13, 56], borderComponents: [227, 115, 153] },
];
