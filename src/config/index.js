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

// https://www.elichens.com/blog-posts/2020/9/16/wildfires-and-urban-air-quality-when-actionable-data-can-only-be-ultra-local
export const pm2_5Ranges = [
  { label: 'Good', min: 0, max: 12.0, range: '0 - 50', color: "rgb(162, 217, 156)", border: "rgb(12, 115, 0)", colorComponents: [162, 217, 156], borderComponents: [12, 115, 0] },
  { label: 'Moderate', min: 12.1, max: 35.4, range: '51 - 100', color: "rgb(248, 205, 70)", border: "rgb(122, 96, 17)", colorComponents: [248, 205, 70], borderComponents: [122, 96, 17]  },
  { label: 'Unhealthy for Sensitive Groups', min: 35.5, max: 55.4, range: '101 - 150', color: "rgb(220, 117, 0)", border: "rgb(222, 204, 183)", colorComponents: [220, 117, 0], borderComponents: [222, 204, 183]  },
  { label: 'Unhealthy', min: 55.5, max: 150.4, range: '151 - 200', color: "rgb(228, 0, 4)", border: "rgb(233, 187, 187)", colorComponents: [228, 0, 4], borderComponents: [233, 187, 187]  },
  { label: 'Very Unhealthy', min: 150.5, max: 250.4, range: '201 - 300', color: "rgb(130, 0, 197)", border: "rgb(207, 176, 224)", colorComponents: [130, 0, 197], borderComponents: [207, 176, 224]  },
  { label: 'Hazardous', min: 250.5, max: 500, range: '301+', color: "rgb(139, 13, 56)", border: "rgb(227, 115, 153)", colorComponents: [139, 13, 56], borderComponents: [227, 115, 153] },
]
