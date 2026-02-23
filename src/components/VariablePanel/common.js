import styled from "styled-components";
import {Button} from "@mui/material";
import {FaInfoCircle} from "@react-icons/all-files/fa/FaInfoCircle";


// Button with Lexend font
export const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: none;
    color: #005899;
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
    font-family: Lexend,serif;
    font-weight: 300;
`;
// Label with Lexend font
export const LLabel = styled.span`
    font-family: Lexend,serif;
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
// Static helper method to grab the most recent value from the built geojson data
export const getLatestValue = (geojsonData, id) => {
  if (!id) { return undefined; }
  const first = geojsonData?.features?.find(f => {
    return f.properties['datasourceId'] === id;
  });
  return first?.properties;
}
