import styled from 'styled-components';
import { NavBar } from '../../components';
import Grid from "@mui/material/Grid";
import {Button} from "@mui/material";

const AboutPage = styled.div`
    background:white;
`


const WhiteBackground = styled.div`
    margin-top: 2rem;
    padding-bottom: 2rem;
    padding-left: 6rem;
    padding-right: 6rem;
    background: #FFFFFF00;
    width: 100%;
    min-height: 15rem;
`;

const GradientBackground = styled.div`
    padding-bottom: 2rem;
    padding-left: 6rem;
    padding-right: 6rem;
    background: linear-gradient(
        ${props => props.direction || 'to bottom'},
        ${props => props.startColor || '#FFFFFF00'},
        ${props => props.endColor || '#41B6E633'}
    );
    width: 100%;
    min-height: 20rem;
`;


const brandColors = {
  chiDarkBlue: '#005899',
  chiRed: '#E4002B',
  chiLightBlue: '#2D9ECD'
}
const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: none;
    color: #005899;
`;
const ChiRedText = styled.span`
    font-family: Lexend;
    color: ${brandColors.chiRed};
    font-size: 32px;
    font-weight: 700;
    text-align: right;
`;
const ChiBlackText = styled.span`
    font-family: Lexend;
    font-weight: 400;
    font-style: normal;
`;

export default function About() {
    //const categories = ['Map', 'Protocol', 'Parameters'];
    //const [selectedCategories, setSelectedCategories] = useState([]);

    return (
       <AboutPage>
         <NavBar />

         <WhiteBackground>
           <Grid container spacing={3} justifyContent={'right'} textAlign={'right'}>
             <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '24px', fontWeight: 700, color: '#005899' }}>
               About the Network
             </Grid>
           </Grid>
           <Grid container spacing={3} justifyContent={'right'} textAlign={'right'} marginTop={'2rem'}>
             <Grid size={6} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
               Air pollution is often invisible, but its impact is real. Now, real-time air quality data is available for every neighborhood, for every Chicagoan, ensuring you.
             </Grid>
           </Grid>
           <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'}>
             <Grid size={12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
               The Chicago Air Quality Network serves as a vital bridge between air quality data and community advocacy, making city-wide metrics legible for all. To achieve this, the design utilizes minimalism that balances technical density with cognitive ease. We chose a bright primary palette, anchored by a Chicago blue and accented with a purposeful Chicago red, to establish immediate trust and relatability. The interface features bold, geometric shapes to humanize the data, making the platform feel approachable. By prioritizing clear visual hierarchy and transparent metadata, the dashboard reflects our mission of providing easy access to Chicago's air quality information.
             </Grid>
           </Grid>
         </WhiteBackground>


         <GradientBackground>
           <hr style={{ margin: '3rem 0', borderColor: '#41B6E6' }} />

           <Grid container spacing={0} justifyContent={'space-between'} alignItems={'start'}>
             <LButton style={{ fontSize: '24px' }} onClick={() => true}>
               Expand all
             </LButton>
             <Grid container alignItems={'center'} spacing={8}>
               <ChiBlackText style={{ fontSize: '32px', fontWeight: 400, textAlign: 'right' }}>
                 <div>Some</div>
                 <div style={{ fontWeight:700 }}>Frequently Asked <ChiRedText>Questions</ChiRedText></div>
               </ChiBlackText>
               <img src={'/icons/chiair/aq-resources-icon.svg'} alt={''} />
             </Grid>
           </Grid>
         </GradientBackground>

         <NavBar />
       </AboutPage>
    );
}
