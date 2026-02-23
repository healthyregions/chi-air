import styled from "styled-components";
import {Button} from "@mui/material";


export const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: none;
    color: #005899;
`;


export const Divider = styled.hr`
    border-color: rgba(65, 182, 230, 1);
    border-width: 1px;
    margin: .5rem 0 0.5rem 0;
`;
export const LHeader = styled.span`
    font-size: 32px;
    font-size: clamp(16px, 24px, 32px);
    font-family: Lexend;
    font-weight: 300;
`;
export const LLabel = styled.span`
    font-family: Lexend;
    box-shadow: none;
    color: rgba(65, 182, 230, 1);
    margin-top: 0.5rem;
`;

export const SGBody = styled.div`
    font-family: Space Grotesk;
    font-weight: 300;
    font-style: normal;
    font-size: 14px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;

`;

export const LinkText = styled.span`
    color: rgba(0, 88, 153, 1);
    cursor: pointer;
`;

export const getLatestValue = (geojsonData, id) => {
  if (!id) { return undefined; }
  const first = geojsonData?.features?.find(f => {
    return f.properties['datasourceId'] === id;
  });
  return first?.properties;
}
