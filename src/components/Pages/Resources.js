import styled from 'styled-components';
import { NavBar } from '..';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {FaArrowRight, FaExternalLinkAlt} from "react-icons/fa";
import { GradientBackground, WhiteBackground } from "../VariablePanel/common";
import {SectionHeader} from "../VariablePanel/SectionHeader";
import {useNavigate} from "react-router-dom";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {useState} from "react";

const ResourcesPage = styled.div`
    background:white;
`;

// Borrowed from Home page
const ResourceLabel = styled.div`
    text-align: center;
    font-family: Lexend,sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: #005899;
    min-height: ${({ $largeScreen }) => $largeScreen ? '4rem' : ''}
`;
const ResourceDescription = styled.div`
    text-align: center;
    font-family: Space Grotesk,serif;
    font-weight: 400;
    font-size: 18px;
    color: #444444;
`;
const ResourceLinkIcon = styled(FaExternalLinkAlt)`
    font-size: 18px;
    margin-left: 0.5rem;
    color: #00589980;
`;

const ContentContainer = styled.div`
    max-width: 1200px; /* Standard container width */
    margin: 0 auto;    /* Centering the container */
    padding: 0 2rem;   /* Prevents text from touching edges */
    width: 100%;
    box-sizing: border-box;
`;

// Borrowed from Team page
const CategorySection = styled.section`
    margin-bottom: 4rem;
`;

const CategoryTitle = styled.h3`
    margin: 0 0 4rem;
    color: #444444;
    font-family: Lexend,sans-serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '24px' : '20px'};
    font-weight: 400;
    line-height: 1.2;
`;

const TeamBodyText = styled(Grid)`
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    text-align: right;
`;

// Borrowed from About page
const FilterRow = styled(Stack)`
    margin: 3rem 0 2.5rem;
`;

const FilterChip = styled(Chip)`
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

const resourceCategories = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'learning', label: 'Learning Resources' },
  { id: 'governance', label: 'City Governance & Reporting' },
  { id: 'supporting', label: 'Supporting Maps & Resources' },
];

// No CMS system, define static data structure here instead

// Define some resources, assign them to a Category
const foundationalResources = [
  { url: 'https://scied.ucar.edu/learning-zone/air-quality/what-is-air-quality', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Intro to Air Quality', description: 'An introduction to air quality from the National Center for Atmospheric Research.' },
  { url: '', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Air Quality 101 ', description: 'Lectures by Prof Erdal at UIC on air quality' },
  { url: 'https://www.epa.gov/indoor-air-quality-iaq/learn-about-indoor-air-quality', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Indoor Air Quality', description: 'People spend 90% of their time indoors. Information about indoor air quality basics.' },
  { url: 'https://www.epa.gov/criteria-air-pollutants/naaqs-table', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'National Ambient Air Quality Standards', description: 'National Ambient Air Quality Standards for the U.S.' },
  { url: 'https://www.who.int/publications/i/item/9789240034228', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'WHO Global Air Quality Guidelines', description: 'World Health Organization global air quality guidelines.' },
  { url: 'https://www.clarity.io/air-quality-monitoring-resources', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Clarity AQ Monitoring Resources', description: 'Resources on Clarity air quality monitoring. ' },
].map(r => ({ ...r, category: 'foundations'}));

const learningResources = [
  { url: 'https://airknowledge.gov/BASC-SI.html', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Air Knowledge Course', description: 'Get a deeper dive into air quality with this free course on the basics of air quality.' },
  { url: 'https://scied.ucar.edu/activity?field_learning_zone_category_target_id=26', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'AQ Classroom Activities', description: 'Teaching resources for air quality learning in the classroom. ' },
  { url: 'https://corsirosenthalfoundation.org/instructions/', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Build Your Own Filter', description: 'Do-it-yourself air purifiers, with lesson plans.' },
  { url: '', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Carb - Prof Erdal to Share', description: 'TBD' },
].map(r => ({ ...r, category: 'learning'}));

const governanceResources = [
  { url: 'https://311.chicago.gov/', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chi 311', description: 'Report suspected air quality violations in the City of Chicago.' },
  { url: 'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/cumulative-impact-assessment.html', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Cumulative Impact Assessment 2023', description: 'TBD' },
  { url: 'https://www.chicago.gov/content/dam/city/depts/cdph/statistics_and_reports/Air_Quality_Health_doc_FINALv4.pdf', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Air Quality & Health Report 2020', description: 'Chicago\'s report on air quality and health from 2020.' },
  { url: 'https://www.chicago.gov/city/en/depts/dcd/supp_info/chicago-air-quality-ordinance.html', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chicago Air Quality Ordinance⠀', description: 'An overview of Chicago air quality ordinance.' },
  { url: 'https://www.chicago.gov/content/dam/city/depts/cdph/environment/community_information/2024/EJ-Action-Plan-2024-Report-FULL.pdf', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chicago Environmental Justice Action Plan Report', description: 'Chicago\'s latest EJ action plan with updates. ' },
  { url: 'https://www.chicago.gov/city/en/progs/env.html', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Department of Environment & Sustainability', description: 'City department focused on environmental initiatives that center equity and sustainability.' },
  { url: 'https://www.chicago.gov/city/en/depts/cdph.html', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chicago Department of Public Health', description: 'CDPH focuses on guidance, services, and strategies that make Chicago a healthier and safer city.' },
].map(r => ({ ...r, category: 'governance'}));

const supportingResources = [
  { url: 'https://www.airnow.gov/?city=Chicago&state=IL&country=USA', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'EPA AirNow', description: 'AirNow highlights air quality in your local area while also providing air quality information at state and national views.' },
  { url: 'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html#modalpop', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Open Air Network City Map', description: 'City of Chicago map of the Open Air Network sensors.' },
  { url: 'https://www.chicago.gov/content/dam/city/depts/cdph/environment/CumulativeImpact/Chicago-EJ-Index_CAs-1500x2318.jpg', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chicago EJ Index Map', description: 'TBD' },
  { url: 'https://chicagohealthatlas.org/', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chicago Health Atlas', description: 'A resource to review, explore and compare health-related data over time and across communities.' },
  { url: 'https://chichives.com/', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'ChiVes: Exploring Chicago\'s Environment', description: 'A data collaborative and community mapping platform to explore climate, environment, and key neighborhood indicators.' },
  { url: 'https://public-environmental-data-partners.github.io/j40-cejst-2/en/#9.29/41.8341/-87.7321T', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Climate & Economic Justice Screening Tool', description: 'This copy of the original U.S. tool highlights key measures of climate and environmental justices for all census tracts.' },
  { url: 'https://ceche.uic.edu/', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'UIC Center for Extreme Conditions and Health Excellence', description: 'TBD' },
].map(r => ({ ...r, category: 'supporting'}));

// Combine into a single shared list of resources (now includes category)
const resources = [
  ...foundationalResources,
  ...learningResources,
  ...governanceResources,
  ...supportingResources
];

export default function Resources() {
  const navigate = useNavigate();
  const largeScreen = useMediaQuery('(min-width: 600px)');

  const [activeCategory, setActiveCategory] = useState('all');
  const visibleCategories = activeCategory === 'all'
    ? resourceCategories
    : resourceCategories.filter(({ id }) => id === activeCategory);

  return (
    <ResourcesPage>
      <NavBar />

      <WhiteBackground $largeScreen={largeScreen}>
        <ContentContainer>
          <Grid container spacing={3} justifyContent={'right'} textAlign={'right'}>
            <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '48px', fontWeight: 700, color: '#005899' }}>
              Access useful Air Quality Resources
            </Grid>
          </Grid>
          <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'}>
            <TeamBodyText size={12}>
              This list of air quality resources includes tools, data repositories, and monitoring networks designed for the general public, researchers, and policymakers, ranging from local, government-regulated data to global, satellite-based datasets.
            </TeamBodyText>
          </Grid>
        </ContentContainer>
      </WhiteBackground>


      <ContentContainer>
        <SectionHeader imgSrc={'/icons/chiair/aq-resources-icon.svg'}
                       topRowText={'Access useful'}
                       bottomRowTextBlack={'Air Quality'}
                       bottomRowTextRed={'Resources'}
                       buttonOnClick={() => navigate('/map')}
                       buttonText={'View Chi Air Quality Network Map'}
                       buttonIcon={<FaArrowRight style={{ marginLeft: '.5rem' }} />}
        />

        <FilterRow direction="row" spacing={1} justifyContent={'flex-end'} useFlexGap flexWrap={'wrap'}>
          <FilterChip
            clickable
            label="All"
            $active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {resourceCategories.map(({ id, label }) => (
            <FilterChip
              key={id}
              clickable
              label={label}
              $active={activeCategory === id}
              onClick={() => setActiveCategory(id)}
            />
          ))}
        </FilterRow>

        {visibleCategories?.map((category, catIndex) =>
          <CategorySection key={`resource-category-${catIndex}`}>
            <CategoryTitle $largeScreen={largeScreen}>{category?.label}</CategoryTitle>
            <Grid container spacing={8} marginBottom={16} alignItems={'start'} rowSpacing={4}>
              {resources?.filter(r => r?.category === category?.id)?.map((resource, resIndex) =>
                <Grid key={'resources-'+resIndex} size={{ xs: 12, md: 3 }} style={{ cursor: 'pointer' }}
                      onClick={() => window.open(resource.url)}
                      justifyItems={'center'}>
                  <Grid container spacing={0} marginY={'1rem'}>
                    <img style={{ marginRight: '2rem'  }} src={'/icons/chiair/resources-backlayer.svg'} alt={''} />
                    <img style={{ position: 'absolute', marginLeft: '2rem' }} src={resource?.icon} alt={''} />
                  </Grid>
                  <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                    <ResourceLabel $largeScreen={largeScreen}>{resource?.name} <ResourceLinkIcon /></ResourceLabel>
                    <ResourceDescription>{resource?.description}</ResourceDescription>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </CategorySection>
        )}

      </ContentContainer>


      <GradientBackground $largeScreen={largeScreen} style={{ marginBottom: 0, paddingBottom: largeScreen ? '5rem' : '4rem' }}>
      </GradientBackground>

      <NavBar />
    </ResourcesPage>
  );
}
