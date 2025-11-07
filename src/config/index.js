import rawVariables from './variables.json';
import rawCategories from './categories.json';
import rawOverlays from './overlays.json';

export const defaultData = 'chives-data.geojson';
export const defaultVariable = "Air Temperature";

// No further processing needed
export const variableCategories = rawCategories;
export const parsedOverlays = rawOverlays;

export const variablePresets = rawVariables.reduce(
  (obj, row) => Object.assign(obj,
    "HEADER" in row
      ? { ['HEADER::' + row['HEADER']]: { } }
      : row['active'] ? { [row['Variable Name']]: { ...row, accessor: feature => feature.properties[row.Column] } } : {}
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

// https://www.elichens.com/blog-posts/2020/9/16/wildfires-and-urban-air-quality-when-actionable-data-can-only-be-ultra-local
export const pm2_5Bins = [12.1,35.5,55.5,150.5,250.5]
export const pm2_5ColorMap = {
  "Good | 0 to 12.0": [0,174,82],
  "Moderate | 12.1 to 35.4": [254,253,2],
  "Unhealthy for Sensitive Groups | 35.5 to 55.4": [253,191,1],
  "Unhealthy | 55.5 to 150.4": [246,3,1],
  "Very Unhealthy | 150.5 to 250.4": [198,10,70],
  "Unhealthy | 250.5 to 500": [114,24,31],
}