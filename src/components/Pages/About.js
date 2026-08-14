import styled from 'styled-components';
import { NavBar } from '../../components';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {GradientBackground, platformName, productName, WhiteBackground} from "../VariablePanel/common";
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
    padding: 2.75rem 0 5.375rem;
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
    { id: 'protocol', label: 'Sensors' },
    { id: 'data', label: 'Data' },
    { id: 'parameters', label: 'Parameters' },
    { id: 'map', label: 'Map' }
];

const faqs = [
  {
    id: 'map-data-access',
    category: 'data',
    question: "How can I access the data?",
    answer: <>
      Explore the Map to explore sensor-specific, community/neighborhood-specific, or city-wide data trends.
      Data can also be downloaded in a number of ways, including: direct download on the{" "}
      <a href={'https://data.cityofchicago.org/Health-Human-Services/Open-Air-Chicago-Individual-Measurements/xfya-dxtq/about_data'}
         style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
         target={'_blank'} rel="noreferrer noopener">City Data Portal</a>,
      direct download on the{" "}
      <a href={'https://map.clarity.io/open-air-chicago'}
         style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
         target={'_blank'} rel="noreferrer noopener">
        Open Air Clarity Dashboard
      </a>, and direct download on this website (see 'Download' links on Map).
      Note that when downloading data from the Our Air Map on this website, only the sensors that
      you clicked during exploration will be able to be downloaded. In the future,
      we plan to develop a more robust Data Download filter for more customized options.
    </>
  },
  {
    id: 'map-data-details',
    category: 'map',
    question: "How do I get more details on the data in the mapping interface?",
    answer: "The 'Details' Section on the Map provides many more details on the air quality measures. On the Map page, click a sensor to see a graph appear in the DataPanel. To the top-right of this graph, you should see the 'Details →' button - clicking this button will show the Details panel for the chosen sensor, which shows the Historical Trends graph. Here you should see a 'Download →' button, that offers downloads in various common formats."
  },
  {
    id: 'map-colors',
    category: 'map',
    question: "What do the colors on the map mean?",
    answer: <>
      Colors of individual sensor locations correspond to different value bins or groupings of EPA’s Air Quality Index (AQI). The U.S. Air Quality Index (AQI) is EPA's tool for communicating about outdoor air quality and health. The AQI includes six color-coded
      categories, each corresponding to a range of index values representing a different level of health concern. For example, while AQI value of 50 or below represents good air quality, an AQI value over 300 represents hazardous air quality. To identify the value
      range and corresponding advisory for each color, use the legend 'key' on the top left part of the mapping application. To learn more about the AQI, please consult{" "}
      <a href={'https://www.airnow.gov/aqi/aqi-basics/'}
         style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
         target={'_blank'} rel="noreferrer noopener">
        https://www.airnow.gov/aqi/aqi-basics/
      </a>.
    </>
  },
  {
    id: "data-use-protection",
    category: 'data',
    question: 'How can I use the data to protect myself from harmful exposures to air pollutants?',
    answer: <>
      We highly recommend checking the map regularly and understanding the trends in air quality in your neighborhood. On days when the Air Quality Index (AQI) is unhealthy (i.e., greater than 100), we recommend using our Map as a “Public Health Messaging Tool” and adjust your daily activities to reduce your exposures to air pollutants and associated health risks.
      Specifically, we recommend adopting one or more of the{" "}
      <a href={'https://www.epa.gov/wildfire-smoke-course/strategies-reduce-exposure-outdoors'}
         style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
         target={'_blank'} rel="noreferrer noopener">
        Strategies to Reduce Exposure Outdoors
      </a>.
      {" "}For example: adjusting outdoor activities (such as running) during time frames when the air quality is healthy, staying indoors, using an N95 mask, etc.)
    </>
  },
  {
    id: 'data-source',
    category: 'data',
    question: "Where does this data come from and where is it stored?",
    answer: <>
      The data represents the Clarity Node-S sensor measurements for Fine Particulate
      Matter (PM2.5) and Nitrogen Dioxide (NO2) of the “Open Air Chicago” network, a co-
      owned sensor-based air monitoring and air quality assessment project between the
      University of Illinois at Chicago and the Chicago Department of Public Health. Sensor
      readings are pulled directly from the Clarity programming interface, cleaned, summarized,
      and updated in this web mapping application. The data cleaning and data quality assurance
      and quality control protocols are employed by Clarity (see below for
      more details). A copy of the data is stored on a U.S.-based web server. Data can be
      directly downloaded by time period of interest (e.g., hourly, monthly, seasonally) in
      the 'Details' section of the mapping interface. The raw and weighted (average) data for
      individual measurements, hourly and daily averages can also be accessed and downloaded from the
      {" "}<a href={'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html'}
        style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
        target={'_blank'} rel="noreferrer noopener">
        CDPH Open Air Chicago website
      </a>
    </>
  },
  {
    id: 'protocol-sensor-owner',
    category: 'protocol',
    question: "Who owns the air quality sensors?",
    answer: <>
      Sensors of the Open Air Network are co-owned between the University of Illinois at Chicago
      (as led by Principal Investigator, Professor Erdal) and the City of Chicago, Chicago Department
      of Public Health. While 60% of 277 sensors were purchased from the two UIC grants, the remaining
      was purchased by the CDPH from various sources of city funding. Each entity also maintains extra
      sensors in the inventory for sensor replacements, if warranted.
    </>
  },
  {
    id: 'protocol-sensor-maintenance',
    category: 'protocol',
    question: "Who maintains the sensors and the network?",

    answer: <>
      The University of Illinois at Chicago and the City of Chicago, Chicago Department of Public Health,
      and Clarity are collaborating on sensor and network maintenance, and this work is currently in
      progress. The City of Chicago, Chicago Department of Transportation is also an important collaborator
      since they maintain the light poles throughout the city. CDOT crews trained in sensor installation
      criteria and protocols prepared by UIC must perform sensor removals and installations.
    </>
  },
  {
    id: 'data-update-frequency',
    category: 'data',
    question: "How often is the data updated?",
    answer: <>
      We update the dashboard hourly. However, some sensors may have a slight delay depending
      on their cellular connectivity. Please always check the 'Last Updated' timestamp at the
      top of the map (e.g., updated 3:00 PM, 06/23/26) to access the latest air quality data.
    </>
  },
  {
    id: 'data-raw-data',
    category: 'data',
    question: "Can I get access to raw, uncalibrated data?",
    answer: <>
      Raw measurements from the Clarity Node-S sensors are available on the{" "}
      <a href={'https://data.cityofchicago.org/Health-Human-Services/Open-Air-Chicago-Individual-Measurements/xfya-dxtq/about_data'}
         style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
         target={'_blank'} rel="noreferrer noopener">
        City of Chicago “Open Air Chicago” data portal
      </a>. Raw data do not go through data cleaning, data quality assurance and control (QA/QC) checks,
      and are not calibrated. Please review Clarity Monitoring documentation in the Resources section
      for further discussion on sensor limitations and why calibrated
      data is recommended over raw measurements for air quality assessment. Deep technical expertise in
      air quality data, monitoring, and analyses domains remains necessary to analyze and utilize data reliably for community assessment. Our teams are happy to assist organizations with data interpretation needs.
    </>
  },
  {
    id: 'data-quality',
    category: 'data',
    question: "How is the data quality assessed?",
    answer: <>
      Upon review of approval of the Clarity Node-S sensor performance and Clarity data cleaning and data
      quality assurance and quality control protocols by the U.S. EPA scientists, the EPA and U.S.
      Forest service began displaying PM2.5 data from Clarity Node-S air sensors on EPA’s{" "}
      <a href={'https://fire.airnow.gov/'}
              style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
              target={'_blank'} rel="noreferrer noopener">
        Fire and Smoke Map (FASM)
      </a>
      {" "}located on EPA’s{" "}
      <a href={'https://www.airnow.gov/'}
              style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
              target={'_blank'} rel="noreferrer noopener">
        AirNow.gov website
      </a>{" "}
      on July 23, 2025. The Clarity Node-S sensor is currently only one of the two commercially available
      lower-cost indicative sensors approved by the USEPA to display sensor data directly in the FASM (the
      other is PurpleAir sensor). Clarity reported that over 550 Clarity Node-S air quality sensors are
      providing PM2.5 data on the FASM expanding air quality measurements obtained at EPA air monitoring
      stations using regulatory-grade Federal Reference Monitors (FRMs) and Federal Equivalent Monitors (FEMs)
      significantly and this number has been growing. The approval of Clarity sensor performance and
      data QA/QC protocols by the EPA and inclusion in the EPA’s FASM
      facilitated direct use of Clarity produced data by the end-users such as Los Angeles Unified School
      District’s Clarity “Know Your Air” network (within the jurisdiction of South Coast Air Quality
      Management District (SCAQMD)). Similarly, we are using EPA-approved Clarity data, with a number of
      measures instituted to safeguard the data and to ensure dissemination of high-quality data to the
      public. These measures are:
      <ul>
        <li>
          We are collaborating with CDPH and Clarity on network maintenance to check and track the health of the sensors
          and the network;
        </li>
        <li>
          We placed triplicate Clarity sensors at a number of EPA air monitoring stations in the Chicago area and are currently performing a collocation study to assess the performance of Clarity sensors against the EPA’s regulatory grade FRMs/FEMs for PM2.5 and NO2. This study will allow us to generate Chicago-specific calibration equations
          for the Clarity sensor and assessment of representativeness of Clarity’s global calibration equation for Chicago.
          About Page Revisions-6-Under Protocol
        </li>
      </ul>
    </>
  },
  {
    id: 'data-regulations',
    category: 'data',
    question: "Can the “Open Air Chicago” sensor data can be used for regulatory decision-making (e.g., enforcement of industrial sources)?",
    answer: <>
      The Clarity Node-S sensors (or any lower cost sensors) are not regulatory grade Federal
      Reference Monitors (FRMs) and Federal Equivalent Monitors (FEMs) used to assess compliance
      with the National Ambient Air Quality Standard (NAAQS) in a given area. Thus, they cannot be
      used for regulatory decision-making (e.g., compliance assessment, enforcement action, etc.).
      The lower cost sensors are called indicative sensors, and they are useful tools to assess
      variability in concentrations of air pollutants at community level and can produce supporting
      data for regulatory networks.
    </>
  },
  {
    id: 'parameters-air-quality-metrics',
    category: 'parameters',
    question: "What air quality metrics are shown in this tool?",
    answer: "This mapping tool currently shares measurements of Fine Particulate Matter (i.e., PM2.5) that is equal or smaller than 2.5 microns (PM 2.5) in aerodynamic size and NowCast AQI, a real-time Air Quality Index (AQI) metric generated by Clarity per EPA guidelines. The NowCast AQI is a real-time algorithm used to estimate the current hour's Air Quality Index. The traditional AQI calculation is based on a full 24-hour average of pollutant concentrations. Thus, they cannot capture sudden changes in air quality concentrations. With the employment of the NowCast algorithm, this deficiency is remedied by using a weighted average of the past 12 hours of data to reflect current air quality conditions. For this reason, EPA uses NowCast AQI as the standard metric displayed as 'current air quality' on AirNow.gov website (https://www.airnow.gov/ . Later this year, our mapping tool will also display Nitrogen Dioxide (NO2) concentration measurements for all 277 sensors across the city, as well as those of six Black Carbon (BC) sensors potentially (see below for the status of BC sensors."
  },
  {
    id: 'parameters-ozone',
    category: 'parameters',
    question: "Why is ozone not measured?",
    answer: "The “Open Air Network” does not include ozone sensor modules at this time. Ozone is an important criteria air pollutant and has well-established adverse health effects on the respiratory system. In the future, ozone modules may be added."
  },
    {
    id: 'parameters-black carbon',
    category: 'parameters',
    question: "What is the status of Black Carbon sensors?",
    answer: "We purchased six Black Carbon sensors from two UIC grants. Our six community partners (ASE, SETF, PCR, LVEJO, PERRO, and N4EJ) guided the light pole selections for the installation of four BC sensors in the EJ communities on the west and southeast sides of the city. One was placed in the urban core and the other was installed at a background location on the north side. They were all installed on light poles by CDOT crews in October-November 2025. After running for a few weeks, they all stopped operating. We exchanged components, and they are still not functioning. The UIC, Clarity, and CDPH are collaborating to resolve the BC sensor technical and operational issues. Because they work in warmer climates, the operation of the sensors on solar power in colder environments with limited sunshine has been postulated as a potential cause for our BC sensors. We will update this entry as we make more progress on this issue."
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
                <b className={'notranslate'}>{productName}</b> is a Chicago
                 mapping application that serves as a vital bridge between air quality data,
                 scientific exploration, community empowerment, and advocacy, making city-wide
                 air quality metrics legible for all Chicago residents. We present and build
                 on the largest sensor-based air monitoring network in the U.S. (and the second
                 largest in the world) with community and cross-sector collaborations to ensure
                 the data is easily accessible, transparent, in context, and ready for action for
                 policy-making and community empowerment, and advocacy. We will continue to refine
                 and add to the dashboard with improvements and more resources over time. We welcome
                 scientific, regulatory, and community input.
               </AboutBodyText>
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
                 Background on "{platformName}" Network
               </Grid>
             </Grid>
             <Grid container spacing={3} justifyContent={'left'} textAlign={'left'} marginTop={'2rem'}>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 The Open Air Network is a citywide project consisting of 277 Clarity Node-S Fine
                 Particulate Matter (PM2.5) and Nitrogen Dioxide (NO2) non-regulatory air sensors
                 installed across Summer 2025. The sensor network has a five-year subscription with
                 Clarity, with continuous monitoring, calibration, and refinement anticipated. It was
                 founded by the University of Illinois at Chicago and Chicago Department of Public
                 Health (CDPH), in collaboration with 13 community organizations serving on the city’s
                 advisory board, seven of which were UIC’s official community partners under the UIC
                 grants (CEJN, ASE, SETF, PCR, PERRO, LVEJO, and N4EJ). Please refer to CDPH website to{" "}
                 <a href="https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html"
                    style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
                    target={'_blank'} rel="noreferrer noopener">
                   learn about the “Open Air Chicago” Partner Organizations
                 </a>.
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 The UIC and UIUC teams are the technical architects of the design of the “Open Air Chicago” air monitoring
                 network. We adopted the technical principles behind EPA’s {" "}
                 <a href={'https://www3.epa.gov/ttnamti1/files/ambient/pm25/qa/vol2sec06.pdf'}
                    style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
                    target={'_blank'} rel="noreferrer noopener">
                   Network Design Criteria for Ambient Air Quality Monitoring
                 </a>
                 {" "}under the Clean Air Act to create a neighborhood scale grid-based design, overlaying the grid-based design
                 on the Environmental Justice (EJ) Index Score map generated by CDPH through a comprehensive
                 stakeholder participatory process in 2023 under the{" "}
                 <a href="https://www.chicago.gov/city/en/depts/env/supp_info/cumulative-impact-assessment.html"
                    style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
                    target={'_blank'} rel="noreferrer noopener">
                   Cumulative Impact Assessment project
                 </a>. Neighborhoods in or near EJ zones have a grid size of 1.4 km x 1.4 km (i.e., 0.87 miles x 0.87 miles),
                 and non-EJ areas have a grid size of 1.5 x 1.5 km (0.93 miles x 0.93 miles). This means that there
                 are sensors across Chicago less than 1 mile from each other in every direction. This design,
                 generating concentrations upwind and downwind of a given location, is particularly advantageous
                 in supporting various forms of air quality analysis and modeling.
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 Upon development of technical design of the grid-based air monitoring network, we sought
                 community input into sensor placements on light poles in close proximity to theoretical
                 grid sampling points in a series of community meetings with 13 community organizations
                 serving on the city’s Advisory Board, in collaboration with CDPH. Prior to community
                 meetings for sensor site selections, UIC provided community education sessions on air
                 quality to community organization staff.
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 <a href="https://publichealth.uic.edu/profiles/serap-erdal/"
                    style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
                    target={'_blank'} rel="noreferrer noopener">Dr. Serap Erdal</a>
                 {" "}from UIC led the scientific and community engagement process of network
                 development and is the principal Investigator of two grants, the National Institute of
                 Standard and Technology (NIST) (i.e., a Congressional Earmark from Senator Tammy Duckworth
                 Office); and Exelon-ComEd/RHP, that supported the work of UIC and UIUC teams. Please see the
                 specifics of these grants on the “Funders and Acknowledgements” section. Dr. Marynia Kolak at
                 UIUC, and Drs. Victoria Persky, Meida Wang, and Dr. at UIC serve as the co-investigators in
                 these grants.
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

         <WhiteBackground  style={{ margin: 0, backgroundColor: '#41B6E633' }} >
           <ContentContainer>
             <FAQTopDivider/>
           </ContentContainer>
         </WhiteBackground>

         <GradientBackground $direction={'to top'} $largeScreen={largeScreen} style={{ marginBottom: 0, paddingBottom: largeScreen ? '5rem' : '4rem' }}>
           <ContentContainer>
             <SectionHeader imgSrc={'/icons/chiair/aq-team-collab.svg'}
                            topRowText={'Our Funders'}
                            bottomRowTextBlack={'and'}
                            bottomRowTextRed={'Acknowledgments'}
                            style={{ marginBottom: '6rem' }}
             />

             <Grid container spacing={2} textAlign={'left'}>
               <Grid size={12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 Dr. Serap Erdal (PI). U.S. Congress Earmark/National Institute of
                 Standards and Technology (NIST). Community-Driven Air Quality and
                 Environmental Justice Assessment. NIST 60NANB23D206.
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 Dr. Serap Erdal (PI). ComEd Utility Company/RHP. ComEd Hyperlocal
                 Air Quality Assessment in Environmental Justice Communities in
                 Chicago. 2-549224-731000-191200.
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 Special thanks to all project partners, community organizations,
                 regulatory agencies, survey and focus group participants, and
                 participating Chicago residents!
                </Grid>
             </Grid>

           </ContentContainer>
         </GradientBackground>




         <NavBar />
       </AboutPage>
    );
}
