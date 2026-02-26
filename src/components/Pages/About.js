import styled from 'styled-components';
import { NavBar } from '../../components';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {SectionHeader} from "../VariablePanel/SectionHeader";
import {GradientBackground, WhiteBackground} from "../VariablePanel/common";

const AboutPage = styled.div`
    background:white;
`;

export default function About() {
    //const categories = ['Map', 'Protocol', 'Parameters'];
    //const [selectedCategories, setSelectedCategories] = useState([]);
    const largeScreen = useMediaQuery('(min-width: 600px)');

    return (
       <AboutPage>
         <NavBar />

         <WhiteBackground largeScreen={largeScreen}>
           <Grid container spacing={3} justifyContent={'right'} textAlign={'right'}>
             <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '24px', fontWeight: 700, color: '#005899' }}>
               About the Network
             </Grid>
           </Grid>
           <Grid container spacing={3} justifyContent={'right'} textAlign={'right'} marginTop={'2rem'}>
             <Grid size={largeScreen ? 6 : 12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
               Air pollution is often invisible, but its impact is real. Now, real-time air quality data is available for every neighborhood, for every Chicagoan, ensuring you.
             </Grid>
           </Grid>
           <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'}>
             <Grid size={12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
               The Chicago Air Quality Network serves as a vital bridge between air quality data and community advocacy, making city-wide metrics legible for all. To achieve this, the design utilizes minimalism that balances technical density with cognitive ease. We chose a bright primary palette, anchored by a Chicago blue and accented with a purposeful Chicago red, to establish immediate trust and relatability. The interface features bold, geometric shapes to humanize the data, making the platform feel approachable. By prioritizing clear visual hierarchy and transparent metadata, the dashboard reflects our mission of providing easy access to Chicago's air quality information.
             </Grid>
           </Grid>
         </WhiteBackground>

         <hr style={{ margin: '3rem 0', borderColor: '#41B6E6' }} />

         <GradientBackground largeScreen={largeScreen}>
           <SectionHeader imgSrc={'/icons/chiair/aq-resources-icon.svg'}
                          topRowText={'Some'}
                          bottomRowTextBlack={'Frequently Asked'}
                          bottomRowTextRed={'Questions'}
                          buttonText={'Expand all'}
                          buttonOnClick={() => true}

           />
         </GradientBackground>

         <NavBar />
       </AboutPage>
    );
}
