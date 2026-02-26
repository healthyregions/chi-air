import styled from "styled-components";
import Button from "@mui/material/Button";
import {FaInfoCircle} from "react-icons/fa";
import {useSelector} from "react-redux";
import Grid from "@mui/material/Grid";
import {asyncBufferFromUrl, parquetReadObjects} from "hyparquet";
import {compressors} from "hyparquet-compressors";

// Button with Lexend font
export const LButton = styled(Button)`
    font-family: Lexend,sans-serif;
    text-transform: none;
    color: #005899;
    cursor: pointer;
`;
//Styled <hr />
export const Divider = styled.hr`
    border-color: rgba(65, 182, 230, 1);
    border-width: 1px;
    margin: .5rem 0 0.5rem 0;
`;
// Header with Lexend font
export const LHeader = styled.span`
    font-size: clamp(16px, 24px, 32px);
    font-family: Lexend,sans-serif;
    font-weight: 300;
`;
// Label with Lexend font
export const LLabel = styled.span`
    font-family: Lexend,sans-serif;
    box-shadow: none;
    color: rgba(65, 182, 230, 1);
    margin-top: 0.5rem;
`;
// Body text in Space Grotesk font
export const SGBody = styled.div`
    font-family: Space Grotesk,serif;
    font-weight: 300;
    font-style: normal;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
`;
// Link text for clickable brand blue
export const LinkText = styled.span`
    color: rgba(0, 88, 153, 1);
    cursor: pointer;
`;
// Clickable tooltip in brand light blue
export const SensorValueLabelTooltip = styled(FaInfoCircle)`
    width: 15px;
    height: 15px;
    margin-left: 0.5rem;
    align-self: center;
    color: rgba(0, 88, 153, 0.5);
    cursor: pointer;
`;
// Static page section for white background
export const WhiteBackground = styled(Grid)`
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding-left: ${({ $largeScreen }) => $largeScreen ? '6rem' : '2rem'};
    padding-right: ${({ $largeScreen }) => $largeScreen ? '6rem' : '2rem'};
    background: #FFFFFF00;
    width: 100%;
    //min-height: 15rem;
`;
// Static page section for gradient blue background
export const GradientBackground = styled.div`
    margin-bottom: ${({ $largeScreen }) => $largeScreen ? '6rem' : '2rem'};
    padding-bottom: 4rem;
    padding-left: ${({ $largeScreen }) => $largeScreen ? '6rem' : '2rem'};
    padding-right: ${({ $largeScreen }) => $largeScreen ? '6rem' : '2rem'};
    background: linear-gradient(
        ${({ $direction }) => $direction || 'to bottom'},
        ${({ $startColor }) => $startColor || '#FFFFFF00'},
        ${({ $endColor }) => $endColor || '#41B6E633'}
    );
    width: 100%;
    //min-height: 20rem;
`;
// Static helper function to grab the most recent value from the built geojson data
export const getLatestValue = (geojsonData, id) => {
  if (!id) { return {}; }
  const first = geojsonData?.features?.find(f => {
    return f.properties['datasourceId'] === id;
  });
  return first?.properties;
}
// Given a sensorId + related datasets, extract basic fragments needed by a few different views
export const getMetadata = (clickedSensor, locations, geojsonData, mean_pm25) => {
  // Grab our previously-fetched data to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const firstHourlyRow = mean_pm25?.find((r) => r.type === 'hour');
  const clickedLocation = locations?.find(s => s.datasourceId === clickedSensor);
  const latest = getLatestValue(geojsonData, clickedSensor);
  const recentValueCount = latest?.mean_pm25?.filter((r) => r[clickedLocation.datasourceId] != null
    && r[clickedLocation.datasourceId] !== "None" && r[clickedLocation.datasourceId] !== "NaN")?.length
  return {firstHourlyRow, latest, clickedLocation, recentValueCount};
}
// Static helper function to format dates consistently across DataPanel/Map components
//    short => 02/22/26 10PM
//     long => 10:00 PM, 02/22/26
export const formatDate = ({ timestamp, year=true, format='long' }) => {
  if (!timestamp) {
    return { time:'', date:'', iso: '', utc: undefined };
  }

  const iso = timestamp?.split(' ')?.join('T') + 'Z';
  const utc = new Date(iso);

  // Use 'en-US' to ensure the Month/Day/Year order
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  }).formatToParts(utc);

  // Format: MM/DD/YY (e.g. 02/22/26)
  const date = year ? `${parts.find(p => p.type === 'month').value}/${parts.find(p => p.type === 'day').value}/${parts.find(p => p.type === 'year').value}` : `${parts.find(p => p.type === 'month').value}/${parts.find(p => p.type === 'day').value}`;

  // Format: hhA (e.g. 10PM)
  if (format === 'short') {
    return {
      time: `${parts.find(p => p.type === 'hour').value}${parts.find(p => p.type === 'dayPeriod').value}`,
      date, iso, utc
    };
  }

  // Format: hh:mm A (e.g. 10:00 PM)
  return {
    time: `${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value} ${parts.find(p => p.type === 'dayPeriod').value}`,
    date, iso, utc
  };
}

// Adapter to provide a selector/reducer as a drop-in replacement for useState
export const useSelectorAsState = (selector, reducer, dispatch) => {
  return [ useSelector(selector), (s) => dispatch(reducer(s)) ];
}

// Given a url, columns, & start/end index, fetch from a Parquet dataset
const maxRetries = 5;
export const fetchPq = async ({ url, columns, rowStart, rowEnd }) => {
  let retries = 0;
  // Fetch the list of location id, name, coordinates
  while (retries < maxRetries) {
    try {
      return await parquetReadObjects({
        file: await asyncBufferFromUrl({url}),
        columns,
        rowStart,
        rowEnd,
        compressors
      });
    } catch (e) {
      console.warn(`Warning: Failed fetching (${retries}/${maxRetries}) from ${url}. Retrying...`, e);
      retries = retries+1;
    }
  }

  console.error(`ERROR: Failed to fetch Parquet dataset from ${url} after ${maxRetries} retries.`);
};
