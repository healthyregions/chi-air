import styled from 'styled-components';
import { NavBar } from '../../components';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {SectionHeader} from "../VariablePanel/SectionHeader";
import {GradientBackground, WhiteBackground} from "../VariablePanel/common";
import {NavLink} from "react-router-dom";
import {useState} from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {FaCaretDown, FaCaretUp} from "react-icons/fa";
// import {NavLink, useNavigate} from "react-router-dom";

const AboutPage = styled.div`
    background:white;
`;

export default function About() {
    const [expandAll, setExpandAll] = useState(false);
    const categories = ['Map', 'Protocol', 'Parameters'];
    const [selectedCategories, setSelectedCategories] = useState([]);

    const largeScreen = useMediaQuery('(min-width: 600px)');

    const toggleCategory = (category) => {
      console.log('Clicked: ', category);
      if (selectedCategories?.includes(category?.toLowerCase())) {
        setSelectedCategories(selectedCategories?.filter(c => c !== category?.toLowerCase()))
      } else {
        setSelectedCategories([...selectedCategories, category?.toLowerCase()])
      }
    };

    const faqs = [
      {
        category: "map",
        question: "What do the colors on the map mean?",
        answer: "Colors of individual sensor locations correspond to different value bins or groupings of air quality metrics. To identify the value range and corresponding advisory for each color, use the legend on the bottom right part of the mapping application as a guide.",
        //    ...    ...    ...    ...    ...    ...
        // Insert contents from Box spreadsheet:
        //    See https://uofi.app.box.com/file/2139463971757?s=ee3f7ar6kbrltnysgyfz0ewhtg2xod7o
      },
      {
        category: "map",
        question: "Test 123?",
        answer: "Colors of individual sensor locations correspond to different value bins or groupings of air quality metrics. To identify the value range and corresponding advisory for each color, use the legend on the bottom right part of the mapping application as a guide.",
        //    ...    ...    ...    ...    ...    ...
        // Insert contents from Box spreadsheet:
        //    See https://uofi.app.box.com/file/2139463971757?s=ee3f7ar6kbrltnysgyfz0ewhtg2xod7o
      },
            {
        category: "map",
        question: "Test 456?",
        answer: "Colors of individual sensor locations correspond to different value bins or groupings of air quality metrics. To identify the value range and corresponding advisory for each color, use the legend on the bottom right part of the mapping application as a guide.",
        //    ...    ...    ...    ...    ...    ...
        // Insert contents from Box spreadsheet:
        //    See https://uofi.app.box.com/file/2139463971757?s=ee3f7ar6kbrltnysgyfz0ewhtg2xod7o
      }
    ];


    
    return (
       <AboutPage>
         <NavBar />

         <WhiteBackground $largeScreen={largeScreen}>
           <Grid container spacing={3} justifyContent={'right'} textAlign={'right'}>
             <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '48px', fontWeight: 700, color: '#005899' }}>
               About
             </Grid>
           </Grid>
{/*            <Grid container spacing={3} justifyContent={'right'} textAlign={'right'} marginTop={'2rem'}>
             <Grid size={largeScreen ? 6 : 12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
               Air pollution is often invisible, but its impact is real. Now, real-time air quality data is available for every neighborhood, for every Chicagoan.
             </Grid>
           </Grid> */}
           <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'}>
             <Grid size={12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
              <b>Our Air</b> is a Chicago mapping application that serves as a vital bridge between air quality data, research exploration, and community advocacy,
               making city-wide metrics legible for all. We build on the largest sensor network in the country with community and
               cross-sector collaborations to ensure the data is easily accessible, in context, and ready
               for action. We will continue to refine and add to the dashboard with improvements and more resources over time.
               </Grid>
{/*               <Grid size={12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
               To achieve our goals, the design utilizes minimalism that balances technical density with cognitive ease. We chose a bright primary palette,
                anchored by a Chicago blue and accented with a purposeful Chicago red, to establish a common ground for all Chicagoans.
                By prioritizing clear visual hierarchy and transparent metadata, the dashboard reflects our mission of providing easy access to Chicago's air quality information.
             </Grid> */}
           </Grid>
         </WhiteBackground>

         <WhiteBackground $largeScreen={largeScreen}>
            <Grid container spacing={3} justifyContent={'center'} textAlign={'center'}>
              <div className="item"><img src="/img/sensor-calibration.jpg" alt={''} /></div>
            </Grid>
         </WhiteBackground>


         <WhiteBackground $largeScreen={largeScreen}>
           <Grid container spacing={3} justifyContent={'left'} textAlign={'left'}>
             <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '24px', fontWeight: 700, color: '#005899' }}>
               Building on Open Air
             </Grid>
           </Grid>
           <Grid container spacing={3} justifyContent={'left'} textAlign={'left'} marginTop={'2rem'}>
             <Grid size={12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
              The <a href="https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html" style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}>Open Air Network </a>
               is a citywide project consisting of 277 non-regulatory air sensors installed in Summer 2025.
                The sensor network has a five-year lifespan, with continuous monitoring, calibration, and refinement anticipated.
                It was founded by the University of Illinois at Chicago and Chicago Department of Public Health, in collaboration with
                dozens of advisory board and other partners. Learn more about University of Illinois & Community teams <NavLink to={"/teams"} style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}>here.</NavLink>
                </Grid>
{/*
              It was founded by the Chicago Department of Public Health (CDPH) and the University of Illinois at Chicago School of Public Health (UIC SPH).
              The development of the network was supported by an advisory board and other partners, including the following:
              Alliance of the Southeast, Chicago Environmental Justice Network, Communities United, Grow Greater Englewood,
              Little Village Environmental Justice Organization, Neighbors for Environmental Justice, ONE Northside, Openlands. People for Community Recovery,
              Pilsen Environmental Rights and Reform Organization, Southeast Environmental Task Force,
              The Southwest Collective and the Westside Cultural Alliance, Chicago Department of Transportation, Cook County Department of
              Environment and Sustainability, Illinois Environmental Protection Agency, RHP Risk Management, University of Illinois Urbana-Champaign,
              Clarity Movement Company, and Illinois Public Health Institute. */}
{/*              </Grid>
             <Grid size={12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
              The City of Chicago manages hourly and daily concentrations datasets published on its Data Portal as
              <a href ='https://data.cityofchicago.org/Health-Human-Services/Open-Air-Chicago-Individual-Measurements/xfya-dxtq/about_data' style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}> Open Air Chicago Individual Measurements. </a>
              This website also provides data downloads of air quality measurements, accessed through the Mapping platform. Both suites of measurements are derived from the same raw values from Clarity sensors that make up the Open Air Network.
             </Grid>
             <Grid size={12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
            <a href="https://publichealth.uic.edu/profiles/serap-erdal/" style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}>Dr. Serap Erdal </a>
             from UIC SPH led the scientific process of grid development, sensor placement, and quality assurance protocol development, with support from a Congressional
             Earmark Grant/National Institute of Standards and Technology (#60NANB23D206), and ComEd Hyperlocal Air Quality Assessment. RHP Risk Management/ComEd/Exelon,
             LLC from 2025 through 2026.  */}
              </Grid>
              <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
               The grid-based design of the air monitoring network was based on the EPA’s <a href="https://www3.epa.gov/ttnamti1/files/ambient/pm25/qa/vol2sec06.pdf" style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
               > Network Design Criteria for Ambient Air Quality Monitoring</a> under the Clean Air Act. We  added additional sensors in areas that have experienced environmental injustices more than others, known as
               <i> Environmental Justice (EJ)</i> communities. Neighborhoods in or near EJ zones have sensors every 1.4 kilometers (0.87 miles), and non-EJ areas have a grid size of 1.5 x 1.5 km (0.93 miles). By placing sensors
               across the city using a grid design, we can follow the path of air pollution as it moves above, between, and through Chicago.
             </Grid>
             <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
            <a href="https://publichealth.uic.edu/profiles/serap-erdal/" style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}>Dr. Serap Erdal </a>
             from UIC led the scientific process of grid development, sensor placement, and quality assurance protocol development, with support from a Congressional
             Earmark Grant/National Institute of Standards and Technology (#60NANB23D206), and ComEd Hyperlocal Air Quality Assessment. RHP Risk Management/ComEd/Exelon,
             LLC from 2025 through 2026.
              </Grid>
         </WhiteBackground>

         <hr style={{ margin: '3rem 0', borderColor: '#41B6E6' }} />

         <GradientBackground $largeScreen={largeScreen}>
           <SectionHeader imgSrc={'/icons/chiair/aq-resources-icon.svg'}
                          topRowText={'Some'}
                          bottomRowTextBlack={'Frequently Asked'}
                          bottomRowTextRed={'Questions'}
                          buttonText={'Expand all'}
                          buttonOnClick={() => {setSelectedCategories([]);setExpandAll(!expandAll)}}

           />
         </GradientBackground>


         <WhiteBackground $largeScreen={largeScreen}>
           <Stack direction="row" spacing={1} justifyContent={'flex-end'}>
             <Chip clickable label="All"
                   onClick={() => setSelectedCategories([])}
                   variant={!selectedCategories?.length ? '' : 'outlined'}
             />
             { categories?.map((category) =>
               <Chip clickable label={category}
                     onClick={() => toggleCategory(category)}
                     variant={selectedCategories?.includes(category?.toLowerCase()) ? '' : 'outlined'}
               />
             )}
           </Stack>

           {categories
             ?.filter(c => !selectedCategories?.length || selectedCategories?.includes(c?.toLowerCase()))
             ?.map(category => <>
                 <h3>{category}</h3>
                 {faqs?.filter(f => f.category?.toLowerCase() === category?.toLowerCase())?.map((faq) =>
                   <Accordion expanded={expandAll}>
                     <AccordionSummary
                       expandIcon={selectedCategories?.includes(category?.toLowerCase()) ? <FaCaretUp /> : <FaCaretDown />}
                     >
                       {faq.question}
                     </AccordionSummary>
                     <AccordionDetails>
                       {faq.answer}
                     </AccordionDetails>
                   </Accordion>)
                 }
               </>
             )}
         </WhiteBackground>




         <NavBar />
       </AboutPage>
    );
}
