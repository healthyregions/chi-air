import Grid from "@mui/material/Grid";
import styled from "styled-components";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";


const LButton = styled(Button)`
    font-family: Lexend,sans-serif;
    text-transform: none;
    color: #005899;
`;
const brandColors = {
  chiDarkBlue: '#005899',
  chiRed: '#E4002B',
  chiLightBlue: '#2D9ECD'
}
const ChiBlackText = styled(Grid)`
    font-family: Lexend,sans-serif;
    font-weight: 400;
    color: #444444;
    font-style: normal;
`;
const ChiRedText = styled.span`
    font-family: Lexend,sans-serif;
    color: ${brandColors.chiRed};
    font-weight: 700;
    text-align: right;
`;
const SectionIcon = styled.img`
    width: 72px;
    height: auto;
`

export const SectionHeader = ({ style = {}, buttonIcon = <></>, buttonText = '', buttonOnClick, topRowText = '', bottomRowTextBlack = '', bottomRowTextRed = '', imgSrc, imgAlt = '' }) => {
  const largeScreen = useMediaQuery('(min-width: 600px)');

  return (
    <Grid style={{...style}} container spacing={0} justifyContent={'space-between'} alignItems={'center'} flexDirection={largeScreen ? 'row' : 'column-reverse'}>
      {(buttonIcon || buttonText) && <Grid><LButton style={{ fontSize: largeScreen ? '24px': '16px', marginTop: largeScreen ? '' : '2rem' }} onClick={buttonOnClick}>
          {buttonText} {buttonIcon}
      </LButton></Grid>}

      <Grid container spacing={8} size justifyContent={'end'} flexGrow={1} flexWrap={'nowrap'}>
        <ChiBlackText spacing={0} style={{ fontSize: largeScreen ? '32px': '18px', fontWeight: 400, textAlign: 'right' }}>
          <Grid container gap={5} alignItems={'center'} justifyContent={'right'} flexWrap={'nowrap'}>
            <Grid>
              {topRowText} <div style={{ fontWeight:700 }}>{bottomRowTextBlack+' '} <ChiRedText>{bottomRowTextRed}</ChiRedText></div>
            </Grid>
            <SectionIcon $largeScreen={largeScreen} src={imgSrc} alt={imgAlt} />
          </Grid>
        </ChiBlackText>
      </Grid>
    </Grid>
  );
};
