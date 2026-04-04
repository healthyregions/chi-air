import {NavLink, useNavigate} from "react-router-dom";
import styled from "styled-components";

import Grid from "@mui/material/Grid";

import {Geocoder, NavBar} from "../../components";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import {FaArrowRight} from "react-icons/fa";
import {FaExternalLinkAlt} from "react-icons/fa";
import {SectionHeader} from "../VariablePanel/SectionHeader";
import {GradientBackground, useSelectorAsState, WhiteBackground} from "../VariablePanel/common";
import {
  selectSelectedAreas,
  selectSensorLocations,
  setClickedSensor, setSelectedAreas,
  setSelectedSensors
} from "../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";

const TitleBanner = styled(Grid)`
    display: flex;
    align-items: end;
    flex-direction: ${({ $largeScreen }) => $largeScreen ? 'column' : 'row-reverse'};
    justify-content: ${({ $largeScreen }) => $largeScreen ? 'right' : 'center'};
    font-family: Lexend;
`;

const brandColors = {
  chiDarkBlue: '#005899',
  chiRed: '#E4002B',
  chiLightBlue: '#2D9ECD'
}
const ChiHeader = styled.h1`
    font-family: Lexend,sans-serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '64px' : '48px'};
    text-align: right;
`;
const ChiBlackText = styled.span`
    font-family: Lexend,sans-serif;
    font-weight: 400;
    font-style: normal;
`;
const ChiDarkBlueText = styled.span`
    margin-left: 0.5rem;
    font-family: Lexend,sans-serif;
    color: ${brandColors.chiDarkBlue};
    text-align: right;
    font-style: normal;
    font-weight: 700;
`;
const ChiLightBlueText = styled.span`
    font-family: Lexend,sans-serif;
    color: ${brandColors.chiLightBlue};
    font-size: ${({ $largeScreen }) => $largeScreen ? '32px' : '24px'};
    font-weight: 400;
    text-align: ${({ $largeScreen }) => $largeScreen ? 'right' : 'center'};
`;
const ChiRedText = styled.span`
    font-family: Lexend,sans-serif;
    color: ${brandColors.chiRed};
    font-size: ${({ $largeScreen }) => $largeScreen ? '32px' : '24px'};
    font-weight: 700;
    text-align: right;
`;

const ChiSubtitle = styled(Grid)`
    margin-top: 3rem;
    display: flex;
    align-self: end;
    text-align: ${({ $largeScreen }) => $largeScreen ? 'right' : 'center'};
    font-family: Space Grotesk;
    font-size: 18px;
    font-weight: 400;
    font-style: normal;
`;


const ViewMapButton = styled(Button)`
    font-family: Space Grotesk,serif;
    margin-top: 2rem;
    background: rgba(0, 88, 153, 1);
    font-weight: 500;
    font-size: 24px;
    line-height: 16px;
    letter-spacing: 1px;
    text-transform: capitalize;
    width:200px;
    height:46px;

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

// No CMS system, define static data structure here instead
const resources = [
  { url: 'https://scied.ucar.edu/learning-zone/air-quality/what-is-air-quality', icon: '/icons/chiair/resources-graph.svg', backdrop: true, name: 'What is Air Quality?', description: 'An introduction to air quality from the National Center for Atmospheric Research.' },
   { url: 'https://www.airnow.gov/?city=Chicago&state=IL&country=USA', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'AirNow', description: 'AirNow highlights air quality in your local area alongside state and national views.' },
  { url: 'https://311.chicago.gov/', icon: '/icons/chiair/resources-report.svg', backdrop: true, name: 'Report Air Pollution', description: 'Report suspected air quality violations in the City of Chicago.' },
  { url: 'https://www.chicago.gov/city/en/depts/dcd/supp_info/chicago-air-quality-ordinance.html', icon: '/icons/chiair/resources-square.svg', backdrop: true, name: 'Chicago Air Quality Ordinance', description: 'The Air Quality Ordinance regulates the construction and expansion of certain facilities that create air pollution.' },
  { url: 'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html', icon: '/icons/chiair/resources-triangle.svg', backdrop: true, name: 'Open Air Chicago Project', description: 'Check out the City of Chicago website on the Open Air Network, including maps and data.' },
  { url: 'https://chicagohealthatlas.org/', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Chicago Health Atlas', description: 'A resource to review, explore and compare health-related data over time and across communities.' },
  { url: 'https://chichives.com', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'ChiVes: Exploring the City Environment', description: 'A Chicago data collaborative & community mapping platform with environment, climate, & neighborhood indicators.' },
  { url: '', icon: '/icons/chiair/resources-view-all.svg', backdrop: false, name: 'View all Resources', description: 'Explore more learning materials & lesson plans, access reports, and explore additional maps.' },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const largeScreen = useMediaQuery('(min-width: 600px)');

  const sensorCount = 'over 275';

  const locations = useSelector(selectSensorLocations);
  const [, setSelections] = useSelectorAsState(selectSelectedAreas, setSelectedAreas, dispatch);

  const handleDropdownChanged = (s, key = 'community') => {
    setSelections({[key]: [s]});
    const newSelectedSensors = locations.filter(l => l[key] === s)?.map(l => l.datasourceId);
    dispatch(setClickedSensor());
    dispatch(setSelectedSensors([...newSelectedSensors]));
    newSelectedSensors?.length ? navigate(`/map?location=${newSelectedSensors?.[0]}`) : navigate('/map');
  }

  return (
    <>
      <NavBar />

      <WhiteBackground $largeScreen={largeScreen}>
        <TitleBanner container spacing={0} $largeScreen={largeScreen}>
          <ChiHeader $largeScreen={largeScreen}>
            <ChiBlackText $largeScreen={largeScreen}>Our</ChiBlackText>
            <ChiDarkBlueText $largeScreen={largeScreen}>Air</ChiDarkBlueText>
          </ChiHeader>

          <ChiLightBlueText $largeScreen={largeScreen}>Mapping the Open Air Network.
            {largeScreen && <br/>}
            <ChiRedText $largeScreen={largeScreen}> Built for Chicago, with Chicago.</ChiRedText>
          </ChiLightBlueText>

          <ChiSubtitle $largeScreen={largeScreen} size={{ xs:12, md: 6 }}>
            Air pollution is often invisible, but its impact is real.
            Now, real-time air quality data is available for every
            neighborhood, for every Chicagoan, ensuring you and your
            loved ones have the information you need to breathe easier.
          </ChiSubtitle>

          <ViewMapButton component={NavLink} to={'/map'} variant={"contained"} size={"large"} color={"primary"} style={{ color: 'white' }}>
            View Map &rarr;
          </ViewMapButton>
        </TitleBanner>
      </WhiteBackground>


      <GradientBackground $largeScreen={largeScreen}>
        <Grid container spacing={0} alignItems={"center"} justifyContent={largeScreen ? 'space-between' : 'center'}>
          <Grid size={{ sm: 6, xs: 12}}>
            <Geocoder size={'large'} style={{ margin: '0.5rem 0', minWidth: '45vw' }}
                      showSelectedAreas={false}
                      onDropdownChange={handleDropdownChanged}
            />
          </Grid>

          <Grid size={{ sm: 6, xs: 12}} style={{ marginTop: '3rem', display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }} >
            <img src={'/icons/homepage-map-mask.svg'} alt={''} />
          </Grid>
        </Grid>
      </GradientBackground>

      <WhiteBackground $largeScreen={largeScreen}>
        <SectionHeader imgSrc={'/icons/chiair/aq-resources-icon.svg'}
                       topRowText={'Access useful'}
                       bottomRowTextBlack={'Air Quality'}
                       bottomRowTextRed={'Resources'}
                       buttonOnClick={() => navigate('/map')}
                       buttonText={'View Chi Air Quality Network Map'}
                       buttonIcon={<FaArrowRight style={{ marginLeft: '.5rem' }} />}
        />
      </WhiteBackground>

      <GradientBackground $largeScreen={largeScreen}>
        <Grid container spacing={8} alignItems={'start'}>
          {resources?.map((resource, index) =>
            <Grid key={'resources-'+index} size={{ xs: 12, md: 3 }} style={{ cursor: 'pointer' }}
                  onClick={() => navigate(resource?.url)}
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
      </GradientBackground>


      <WhiteBackground $largeScreen={largeScreen}>
        <SectionHeader imgSrc={'/icons/chiair/aq-network.svg'}
                       topRowText={'Empowered by a'}
                       bottomRowTextBlack={'Record-Breaking'}
                       bottomRowTextRed={'Network'}
        />
      </WhiteBackground>

      <GradientBackground $largeScreen={largeScreen} style={{ marginBottom: 0 }}>
        <Grid container spacing={0} flexDirection={largeScreen ? 'row' : 'column-reverse'} justifyContent={'space-between'} alignItems={'center'}>
          <img style={{ maxWidth: '350px', maxHeight: '500px', marginLeft: '-6rem' }} src={'/icons/chiair/aq-network-large.svg'} alt={''} />
          <Grid size={{ xs:12, md: 6 }} style={{ fontFamily: 'Space Grotesk', fontSize: '18px' }} alignItems={'center'} textAlign={'right'}>
            <Grid container spacing={0}>
              <div>Traditional monitoring stations are miles apart, missing the pollution pockets that affect specific blocks. To close this gap, we deployed a fleet of {sensorCount} high-precision sensors to blanket the city.</div>
              <div style={{ margin: '2rem 0 3rem' }}>By operating the largest community air monitoring network in the United States (and the second largest in the world), The Chi Air Quality Network sets a new standard for environmental justice, delivering granular, research grade data to the people who need it most. {!largeScreen && <br/> }<NavLink to={'/about'} style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}>Learn more about us &rarr;</NavLink></div>
            </Grid>
            <Grid container spacing={8} justifyContent={'right'} marginBottom={'4rem'}>
              <img src={'/icons/chiair/uic-logo.svg'} alt={'UIC'} />
              <img src={'/icons/chiair/uiuc-logo.svg'} alt={'UIUC'} />
            </Grid>
          </Grid>
        </Grid>
      </GradientBackground>


      <NavBar style={{ marginBottom: '2rem' }} />
    </>
  );
}

