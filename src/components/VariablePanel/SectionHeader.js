import Grid from "@mui/material/Grid";
import styled from "styled-components";
import {Button, useMediaQuery} from "@mui/material";


const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: none;
    color: #005899;
`;
const brandColors = {
  chiDarkBlue: '#005899',
  chiRed: '#E4002B',
  chiLightBlue: '#2D9ECD'
}
const ChiBlackText = styled(Grid)`
    font-family: Lexend;
    font-weight: 400;
    font-style: normal;
`;
const ChiRedText = styled.span`
    font-family: Lexend;
    color: ${brandColors.chiRed};
    font-weight: 700;
    text-align: right;
`;

export const SectionHeader = ({ style = {}, buttonIcon = <></>, buttonText = '', buttonOnClick, topRowText = '', bottomRowTextBlack = '', bottomRowTextRed = '', imgSrc, imgAlt = '' }) => {
  const largeScreen = useMediaQuery('(min-width: 600px)');

  return (
    <Grid style={{...style}} container spacing={0} justifyContent={'space-between'} alignItems={'center'} flexDirection={largeScreen ? 'row' : 'column-reverse'}>
      {(buttonIcon || buttonText) && <LButton style={{ fontSize: largeScreen ? '24px': '16px', marginTop: largeScreen ? '' : '2rem' }} onClick={buttonOnClick}>
          {buttonText} {buttonIcon}
        </LButton>}

      <Grid container alignItems={'center'} spacing={8}>
        <ChiBlackText spacing={0} style={{ fontSize: largeScreen ? '32px': '18px', fontWeight: 400, textAlign: 'right' }}>
          <Grid container spacing={4} alignItems={'center'} justifyContent={'right'}>
            <Grid alignItems={'right'}>
              {topRowText} <div style={{ fontWeight:700 }}>{bottomRowTextBlack} <ChiRedText>{bottomRowTextRed}</ChiRedText></div>
            </Grid>
            <img width={largeScreen ? 100 : 42} src={imgSrc} alt={imgAlt} />
          </Grid>
        </ChiBlackText>
      </Grid>
    </Grid>
  );
};
