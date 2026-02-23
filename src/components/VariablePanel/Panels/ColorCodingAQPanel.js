import Grid from "@mui/material/Grid";
import {LButton, LHeader, SGBody} from "../common";
import {FaArrowCircleLeft} from "@react-icons/all-files/fa/FaArrowCircleLeft";
import {pm2_5Ranges} from "../../../config";


export const ColorCodingAQPanel = ({ pop }) => {
  return(
    <>
      <Grid container spacing={0} marginTop={'1rem'}>
        <LButton as={Grid} size={1} variant={'text'} onClick={() => pop()}
                 style={{ cursor: 'pointer', marginTop: '0.4rem' }}>
          <FaArrowCircleLeft style={{ width: '19px', height: '19px' }} />
        </LButton>

        <Grid size={11}>
          <LHeader>Color Coding Air Quality</LHeader>

          <SGBody style={{ margin: '1rem 0' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis Ut enim ad minim veniam, quis Ut enim ad minim veniam, quis.
          </SGBody>

          {pm2_5Ranges?.map(({ range, label, color, border}, index) => <Grid container spacing={2}>
            <Grid size={12} key={`overlay-key-${index}-${label}`} alignItems={'center'} display={'flex'}>
              <span style={{ display: 'inline-block', backgroundColor: color, width: '19px', height: '64px', margin: '0.3rem 0' }}></span>
              <div style={{ marginLeft: '1rem' }}>
                <LHeader style={{ fontSize: '18px', fontWeight: 700, color: ['Good', 'Moderate'].includes(label) ? border : color }}>{label}</LHeader>
                <SGBody style={{ fontSize: '14px', marginTop: '0.5rem' }}>AQI {range}</SGBody>
              </div>
            </Grid>
          </Grid>)}
        </Grid>
      </Grid>
    </>
  );
};
