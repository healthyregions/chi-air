import styled from 'styled-components';
import { NavBar } from '../../components';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {GradientBackground, productName, WhiteBackground} from "../VariablePanel/common";
import {NavLink} from "react-router-dom";
import {useState} from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {FaCaretDown, FaCaretRight} from "react-icons/fa";
import {SectionHeader} from "../VariablePanel/SectionHeader";

const AboutPage = styled.div`
    background:white;
`;

const AboutBodyText = styled(Grid)`
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    text-align: right;
`;

const ContentContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
`;

const FAQTopDivider = styled.hr`
    margin: 2.75rem 0 5.375rem;
    border: 0;
    border-top: 1px solid #41B6E6;
`;

const FAQFilterRow = styled(Stack)`
    margin: 3rem 0 2.5rem;
`;

const FAQFilterChip = styled(Chip)`
    && {
        height: 36px;
        border-radius: 999px;
        border: 1px solid #9BC4DF;
        background: ${({ $active }) => $active ? '#DCEEF8' : 'transparent'};
        color: #005899;
        cursor: pointer;
        font-family: Space Grotesk,serif;
        font-size: 18px;
        font-weight: 700;
    }

    && .MuiChip-label {
        padding: 0 16px;
    }
`;

const FAQCategorySection = styled.section`
    margin-bottom: 1rem;
`;

const FAQCategoryTitle = styled.h3`
    margin: 0 0 1rem;
    color: #444444;
    font-family: Lexend,sans-serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '24px' : '20px'};
    font-weight: 400;
    line-height: 1.2;
`;

const FAQAccordion = styled(Accordion)`
    && {
        background: transparent;
        box-shadow: none;
        border: 0;
        margin: 0;
    }

    &&:before {
        display: none;
    }

    &&.Mui-expanded {
        margin: 0;
    }
`;

const FAQAccordionSummary = styled(AccordionSummary)`
    && {
        padding: 0;
        min-height: 0;
        flex-direction: row-reverse;
        align-items: flex-start;
        gap: 0.5rem;
    }

    && .MuiAccordionSummary-content {
        margin: 0;
    }

    && .MuiAccordionSummary-content.Mui-expanded {
        margin: 0;
    }

    && .MuiAccordionSummary-expandIconWrapper {
        color: #005899;
        font-size: 18px;
        margin-top: 0.375rem;
    }
`;

const FAQAccordionDetails = styled(AccordionDetails)`
    && {
        padding: 1rem 0 1rem 1.5rem;
    }
`;

const FAQQuestion = styled.span`
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '24px' : '20px'};
    font-weight: 400;
    line-height: 1.2;
`;

const FAQAnswer = styled.div`
    max-width: 860px;
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '18px' : '16px'};
    font-weight: 400;
    line-height: 1.45;
`;

const faqCategories = [
  { id: 'map', label: 'Map' },
  { id: 'protocol', label: 'Protocol' },
  { id: 'parameters', label: 'Parameters' }
];

const faqs = [
  {
    id: 'map-data-access',
    category: 'map',
    question: "How can I access the data?",
    answer: "Explore the Map to explore sensor-specific and regional data trends. Data can also be downloaded in a number of ways, including: direct download on this website (see 'Download' links on Map), direct download on the City Data Portal, and direct download on the Open Air Clarity Dashboard."
  },
  {
    id: 'map-colors',
    category: 'map',
    question: "What do the colors on the map mean?",
    answer: "Colors of individual sensor locations correspond to different value bins or groupings of air quality metrics. To identify the value range and corresponding advisory for each color, use the legend 'key' on the top left part of the mapping application."
  },
  {
    id: 'protocol-data-source',
    category: 'protocol',
    question: "Where does this data come from and where is it stored?",
    answer: "This data comes from Clarity sensor measurements of the Open Air Network, a co-owned sensor project between the University of Illinois and the Chicago Department of Public Health. Sensor readings are pulled directly from the Clarity programming interface, cleaned, summarized, and updated in this web mapping application. A copy of the data is stored in a U.S.-based web server. Data can be directly downloaded by time period of interest (e.g. hourly, monthly, seasonal) in the 'Details' section of the mapping interface. The University of Illinois is engaged in independent quality assurance and quality control of the data."
  },
  {
    id: 'protocol-sensor-owner',
    category: 'protocol',
    question: "Who owns the air quality sensors?",
    answer: "Sensors of the Open Air Network and are co-owned between the University of Illinois (as led by Principal Investigator, Professor Erdal) and the City of Chicago, Chicago Department of Public Health."
  },
  {
    id: 'protocol-sensor-maintenance',
    category: 'protocol',
    question: "Who maintains the sensors?",
    answer: "The University of Illinois and the City of Chicago, Chicago Department of Public Health are in communications to develop sensor maintenance protocol."
  },
  {
    id: 'protocol-update-frequency',
    category: 'protocol',
    question: "How often is the data updated?",
    answer: "We update the dashboard hourly. However, some sensors may have a slight delay depending on their connectivity. Always check the 'Last Updated' timestamp at the top of the map."
  },
  {
    id: 'protocol-upload-frequency',
    category: 'protocol',
    question: "Are there plans to increase the frequency of how often the data is uploaded?",
    answer: "Data updates are limited in part by sensor connectivity, programming interface restrictions, and quality assurance. At this time, frequency less than one hour is not supported due to technical challenges of sensor hardware and infrastructure limitations."
  },
  {
    id: 'protocol-raw-data',
    category: 'protocol',
    question: "Can I get access to raw, uncalibrated data? If not, how can I trust the data provided?",
    answer: "Raw measures are available on the City of Chicago Data Portal. Please review Clarity Monitoring documentation in the Resources section for further discussion on sensor limtiations, and why calibrated data is recommended over raw measurements. Deep expertise in air quality data, monitoring, and analyses domains remains necessary to be able to utilize data reliably for community assessment. We are challenged by this task, and our teams are happy to assist organizations with data interpretation needs."
  },
  {
    id: 'parameters-air-quality-metrics',
    category: 'parameters',
    question: "What air quality metrics are shown in this tool?",
    answer: "This tool currently shares measurements of particulate matter smaller than 2.5 microns (PM2.5) and NowCast AQI, a real-time air quality metric generated by Clarity, the manufacturers of the air quality sensors being used. Later this year, the tool will also display nitrogen dioxide (NO2) measurements for all sensors across the city, as well as a few black carbon modules."
  },
  {
    id: 'parameters-ozone',
    category: 'parameters',
    question: "Why is ozone not measured?",
    answer: "The Open Air Network does not include ozone sensor modules at this time. of ozone. In the future, ozone modules may be added."
  }
];

const allFaqIds = faqs.map(({ id }) => id);

export default function About() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedFaqIds, setExpandedFaqIds] = useState([]);
    const largeScreen = useMediaQuery('(min-width: 600px)');
    const visibleCategories = activeCategory === 'all'
      ? faqCategories
      : faqCategories.filter(({ id }) => id === activeCategory);
    const areAllFaqsExpanded = allFaqIds.every((id) => expandedFaqIds.includes(id));

    const toggleAllFaqs = () => {
      setExpandedFaqIds(areAllFaqsExpanded ? [] : allFaqIds);
    };

    const toggleFaq = (faqId, shouldExpand) => {
      setExpandedFaqIds((currentIds) => {
        const nextIds = new Set(currentIds);

        if (shouldExpand) {
          nextIds.add(faqId);
        } else {
          nextIds.delete(faqId);
        }

        return [...nextIds];
      });
    };



    return (
       <AboutPage>
         <NavBar />

         <WhiteBackground $largeScreen={largeScreen}>
           <ContentContainer>
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
               <AboutBodyText size={12}>
                <b className={'notranslate'}>{productName}</b> is a Chicago mapping application that serves as a vital bridge between air quality data, research exploration, and community advocacy,
                 making city-wide metrics legible for all. We build on the largest sensor network in the country with community and
                 cross-sector collaborations to ensure the data is easily accessible, in context, and ready
                 for action. We will continue to refine and add to the dashboard with improvements and more resources over time.
               </AboutBodyText>
{/*               <Grid size={12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
               To achieve our goals, the design utilizes minimalism that balances technical density with cognitive ease. We chose a bright primary palette,
                anchored by a Chicago blue and accented with a purposeful Chicago red, to establish a common ground for all Chicagoans.
                By prioritizing clear visual hierarchy and transparent metadata, the dashboard reflects our mission of providing easy access to Chicago's air quality information.
             </Grid> */}
             </Grid>
           </ContentContainer>
         </WhiteBackground>

         <WhiteBackground $largeScreen={largeScreen}>
            <Grid container spacing={3} justifyContent={'center'} textAlign={'center'}>
              <div className="item"><img src="/img/sensor-calibration.jpg" alt={''} /></div>
            </Grid>
         </WhiteBackground>


         <WhiteBackground $largeScreen={largeScreen}>
           <ContentContainer>
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
                <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
                 The grid-based design of the air monitoring network was based on the EPA’s <a href="https://www3.epa.gov/ttnamti1/files/ambient/pm25/qa/vol2sec06.pdf" style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
                 > Network Design Criteria for Ambient Air Quality Monitoring</a> under the Clean Air Act. We  added additional sensors in areas that have experienced environmental injustices more than others, known as
                 <i> Environmental Justice (EJ)</i> communities. Neighborhoods in or near EJ zones have sensors every 1.4 kilometers (0.87 miles), and non-EJ areas have a grid size of 1.5 x 1.5 km (0.93 miles). By placing sensors
                 across the city using a grid design, we can follow the path of air pollution as it moves above, between, and through Chicago.
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
              <a href="https://publichealth.uic.edu/profiles/serap-erdal/" style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}>Dr. Serap Erdal </a>
               from UIC led the scientific process of grid development, sensor placement, and quality assurance protocol development, with support from the ComEd Hyperlocal Air
               Quality Assessment by RHP Risk Management/ComEd/Exelon LLC, and Congressional Earmark Grant/National Institute of Standards and Technology (#60NANB23D206).
                </Grid>
             </Grid>
           </ContentContainer>
         </WhiteBackground>

         <GradientBackground $largeScreen={largeScreen} style={{ marginBottom: 0, paddingBottom: largeScreen ? '5rem' : '4rem' }}>
           <ContentContainer>
             <FAQTopDivider />
             <SectionHeader imgSrc={'/icons/chiair/aq-resources-icon.svg'}
                            topRowText={'Some'}
                            bottomRowTextBlack={'Frequently Asked'}
                            bottomRowTextRed={'Questions'}
                            style={{ marginBottom: '6rem' }}
                            buttonOnClick={toggleAllFaqs}
                            buttonText={areAllFaqsExpanded ? 'Collapse all' : 'Expand all'}
             />

             <FAQFilterRow direction="row" spacing={1} justifyContent={'flex-end'} useFlexGap flexWrap={'wrap'}>
               <FAQFilterChip
                 clickable
                 label="All"
                 $active={activeCategory === 'all'}
                 onClick={() => setActiveCategory('all')}
               />
               {faqCategories.map(({ id, label }) => (
                 <FAQFilterChip
                   key={id}
                   clickable
                   label={label}
                   $active={activeCategory === id}
                   onClick={() => setActiveCategory(id)}
                 />
               ))}
             </FAQFilterRow>

             {visibleCategories.map(({ id, label }) => (
               <FAQCategorySection key={id}>
                 <FAQCategoryTitle $largeScreen={largeScreen}>{label}</FAQCategoryTitle>
                 {faqs
                   .filter((faq) => faq.category === id)
                   .map((faq) => {
                     const isExpanded = expandedFaqIds.includes(faq.id);

                     return (
                       <FAQAccordion
                         key={faq.id}
                         expanded={isExpanded}
                         onChange={(_, shouldExpand) => toggleFaq(faq.id, shouldExpand)}
                       >
                         <FAQAccordionSummary
                           expandIcon={isExpanded ? <FaCaretDown /> : <FaCaretRight />}
                         >
                           <FAQQuestion $largeScreen={largeScreen}>{faq.question}</FAQQuestion>
                         </FAQAccordionSummary>
                         <FAQAccordionDetails>
                           <FAQAnswer $largeScreen={largeScreen}>{faq.answer}</FAQAnswer>
                         </FAQAccordionDetails>
                       </FAQAccordion>
                     );
                   })}
               </FAQCategorySection>
             ))}
           </ContentContainer>
         </GradientBackground>




         <NavBar />
       </AboutPage>
    );
}
