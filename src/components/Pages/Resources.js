import styled from 'styled-components';
import { NavBar } from '..';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GradientBackground, WhiteBackground } from "../VariablePanel/common";

const ResourcesPage = styled.div`
    background:white;
`;

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

// No CMS system, define static data structure here instead
const resources = [
  { url: 'https://scied.ucar.edu/learning-zone/air-quality/what-is-air-quality', icon: '/icons/chiair/resources-graph.svg', backdrop: true, name: 'What is Air Quality?', description: 'An introduction to air quality from the National Center for Atmospheric Research.' },
   { url: 'https://www.airnow.gov/?city=Chicago&state=IL&country=USA', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'AirNow', description: 'AirNow highlights air quality in your local area alongside state and national views.' },
  { url: 'https://311.chicago.gov/', icon: '/icons/chiair/resources-report.svg', backdrop: true, name: 'Report Air Pollution', description: 'Report suspected air quality violations in the City of Chicago.' },
  { url: 'https://www.chicago.gov/city/en/depts/dcd/supp_info/chicago-air-quality-ordinance.html', icon: '/icons/chiair/resources-square.svg', backdrop: true, name: 'Chicago Air Quality Ordinance', description: 'The Air Quality Ordinance regulates the construction and expansion of certain facilities that create air pollution.' },
  { url: 'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html', icon: '/icons/chiair/resources-triangle.svg', backdrop: true, name: 'Open Air Chicago Project', description: 'Check out the City of Chicago website on the Open Air Network, including maps and data.' },
  { url: 'https://chicagohealthatlas.org/', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chicago Health Atlas', description: 'A resource to review, explore and compare health-related data over time and across communities.' },
  { url: 'https://chichives.com', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'ChiVes: Exploring Chicago', description: 'A Chicago data collaborative & community mapping platform with environment, climate, & neighborhood indicators.' },
  { url: '', icon: '/icons/chiair/resources-view-all.svg', backdrop: false, name: 'View all Resources', description: 'Explore more learning materials & lesson plans, access reports, and explore additional maps.' },
];

const resources2 = [
  { url: 'https://scied.ucar.edu/learning-zone/air-quality/what-is-air-quality', icon: '/icons/chiair/resources-graph.svg', backdrop: true, name: 'What is Air Quality?', description: 'An introduction to air quality from the National Center for Atmospheric Research.' },
   { url: 'https://www.airnow.gov/?city=Chicago&state=IL&country=USA', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'AirNow', description: 'AirNow highlights air quality in your local area alongside state and national views.' },
  { url: 'https://311.chicago.gov/', icon: '/icons/chiair/resources-report.svg', backdrop: true, name: 'Report Air Pollution', description: 'Report suspected air quality violations in the City of Chicago.' },
  { url: 'https://www.chicago.gov/city/en/depts/dcd/supp_info/chicago-air-quality-ordinance.html', icon: '/icons/chiair/resources-square.svg', backdrop: true, name: 'Chicago Air Quality Ordinance', description: 'The Air Quality Ordinance regulates the construction and expansion of certain facilities that create air pollution.' },
  { url: 'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html', icon: '/icons/chiair/resources-triangle.svg', backdrop: true, name: 'Open Air Chicago Project', description: 'Check out the City of Chicago website on the Open Air Network, including maps and data.' },
  { url: 'https://chicagohealthatlas.org/', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chicago Health Atlas', description: 'A resource to review, explore and compare health-related data over time and across communities.' },
  { url: 'https://chichives.com', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'ChiVes: Exploring Chicago', description: 'A Chicago data collaborative & community mapping platform with environment, climate, & neighborhood indicators.' },
  { url: '', icon: '/icons/chiair/resources-view-all.svg', backdrop: false, name: 'View all Resources', description: 'Explore more learning materials & lesson plans, access reports, and explore additional maps.' },
];

const resources3 = [
  { url: 'https://scied.ucar.edu/learning-zone/air-quality/what-is-air-quality', icon: '/icons/chiair/resources-graph.svg', backdrop: true, name: 'What is Air Quality?', description: 'An introduction to air quality from the National Center for Atmospheric Research.' },
   { url: 'https://www.airnow.gov/?city=Chicago&state=IL&country=USA', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'AirNow', description: 'AirNow highlights air quality in your local area alongside state and national views.' },
  { url: 'https://311.chicago.gov/', icon: '/icons/chiair/resources-report.svg', backdrop: true, name: 'Report Air Pollution', description: 'Report suspected air quality violations in the City of Chicago.' },
  { url: 'https://www.chicago.gov/city/en/depts/dcd/supp_info/chicago-air-quality-ordinance.html', icon: '/icons/chiair/resources-square.svg', backdrop: true, name: 'Chicago Air Quality Ordinance', description: 'The Air Quality Ordinance regulates the construction and expansion of certain facilities that create air pollution.' },
  { url: 'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html', icon: '/icons/chiair/resources-triangle.svg', backdrop: true, name: 'Open Air Chicago Project', description: 'Check out the City of Chicago website on the Open Air Network, including maps and data.' },
  { url: 'https://chicagohealthatlas.org/', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chicago Health Atlas', description: 'A resource to review, explore and compare health-related data over time and across communities.' },
  { url: 'https://chichives.com', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'ChiVes: Exploring Chicago', description: 'A Chicago data collaborative & community mapping platform with environment, climate, & neighborhood indicators.' },
  { url: '', icon: '/icons/chiair/resources-view-all.svg', backdrop: false, name: 'View all Resources', description: 'Explore more learning materials & lesson plans, access reports, and explore additional maps.' },
];

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
              Add text here. 
            </TeamBodyText>
          </Grid>
        </ContentContainer>
      </WhiteBackground>


          <CategorySection>
            <CategoryTitle $largeScreen={largeScreen}>Core Team</CategoryTitle>
          </CategorySection>

      <ContentContainer>
        <Grid container spacing={8} marginBottom={16} alignItems={'start'} rowSpacing={4}>
          {resources2?.map((resource, index) =>
            <Grid key={'resources-'+index} size={{ xs: 12, md: 3 }} style={{ cursor: 'pointer' }}
                  onClick={() => navigate(resources2?.url)}
                  justifyItems={'center'}>
              <Grid container spacing={0} marginY={'1rem'}>
                <img style={{ marginRight: '2rem'  }} src={'/icons/chiair/resources-backlayer.svg'} alt={''} />
                <img style={{ position: 'absolute', marginLeft: '2rem' }} src={resource?.icon} alt={''} />
              </Grid>
              <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                <ResourceLabel $largeScreen={largeScreen}>{resources2?.name} <ResourceLinkIcon /></ResourceLabel>
                <ResourceDescription>{resources2?.description}</ResourceDescription>
              </Grid>
            </Grid>
          )}
        </Grid>
      </ContentContainer>      


          <CategorySection>
            <CategoryTitle $largeScreen={largeScreen}>Core Team</CategoryTitle>
          </CategorySection>


      <GradientBackground $largeScreen={largeScreen} style={{ marginBottom: 0, paddingBottom: largeScreen ? '5rem' : '4rem' }}>
      </GradientBackground>

      <NavBar />
    </ResourcesPage>
  );
}
