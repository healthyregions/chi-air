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
  { id: 'cat1', label: 'Category 1' },
  { id: 'cat2', label: 'Category 2' },
  { id: 'cat3', label: 'Category 3' }
];

// No CMS system, define static data structure here instead

// Define some resources, assign them to a Category
const resources1 = [
  { url: 'https://scied.ucar.edu/learning-zone/air-quality/what-is-air-quality', icon: '/icons/chiair/resources-graph.svg', backdrop: true, name: 'What is Air Quality?', description: 'An introduction to air quality from the National Center for Atmospheric Research.' },
  { url: 'https://www.airnow.gov/?city=Chicago&state=IL&country=USA', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'AirNow', description: 'AirNow highlights air quality in your local area alongside state and national views.' },
  { url: 'https://311.chicago.gov/', icon: '/icons/chiair/resources-report.svg', backdrop: true, name: 'Report Air Pollution', description: 'Report suspected air quality violations in the City of Chicago.' },
].map(r => ({ ...r, category: 'cat1'}));

const resources2 = [
  { url: 'https://www.chicago.gov/city/en/depts/dcd/supp_info/chicago-air-quality-ordinance.html', icon: '/icons/chiair/resources-square.svg', backdrop: true, name: 'Chicago Air Quality Ordinance', description: 'The Air Quality Ordinance regulates the construction and expansion of certain facilities that create air pollution.' },
  { url: 'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html', icon: '/icons/chiair/resources-triangle.svg', backdrop: true, name: 'Open Air Chicago Project', description: 'Check out the City of Chicago website on the Open Air Network, including maps and data.' },
].map(r => ({ ...r, category: 'cat2'}));

const resources3 = [
  { url: 'https://chicagohealthatlas.org/', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chicago Health Atlas', description: 'A resource to review, explore and compare health-related data over time and across communities.' },
  { url: 'https://chichives.com', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'ChiVes: Exploring Chicago', description: 'A Chicago data collaborative & community mapping platform with environment, climate, & neighborhood indicators.' },
  { url: '', icon: '/icons/chiair/resources-view-all.svg', backdrop: false, name: 'View all Resources', description: 'Explore more learning materials & lesson plans, access reports, and explore additional maps.' },
].map(r => ({ ...r, category: 'cat3'}));

// Combine into a single shared list of resources (now includes category)
const resources = [
  ...resources1,
  ...resources2,
  ...resources3
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
              Resources
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
