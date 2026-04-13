import {NavLink, useNavigate} from "react-router-dom";
import styled from "styled-components";

import Grid from "@mui/material/Grid";

import {Geocoder, NavBar} from "../../components";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import {FaArrowRight} from "react-icons/fa";
import {FaExternalLinkAlt} from "react-icons/fa";
import {FaChevronDown} from "react-icons/fa";
import {SectionHeader} from "../VariablePanel/SectionHeader";
import {GradientBackground, useSelectorAsState, WhiteBackground} from "../VariablePanel/common";
import {
  selectSelectedAreas,
  selectSensorLocations,
  setClickedSensor, setSelectedAreas,
  setSelectedSensors
} from "../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";

const brandColors = {
  chiDarkBlue: '#005899',
  chiRed: '#E4002B',
  chiLightBlue: '#2D9ECD'
}
const HeroSectionInner = styled.div`
    position: relative;
    padding-bottom: 6.5rem;
`;
const HeroArtwork = styled.div`
    position: absolute;
    bottom: ${({ $largeScreen }) => $largeScreen ? '6.5rem' : '4rem'};
    opacity: ${({ $xlScreen }) => $xlScreen ? '' : '0.2'};
    width: 100%;
    min-height: ${({ $largeScreen }) => $largeScreen ? '38rem' : '27rem'};
    margin-bottom: ${({ $largeScreen }) => $largeScreen ? '-6.5rem' : '-4.5rem' };
    transform: ${({ $largeScreen }) => $largeScreen ? 'translateY(1.25rem)' : 'translateY(0.75rem)'};
    overflow: visible;
    z-index: -1;
`;
const HeroLight = styled.img`
    position: absolute;
    left: 0;
    bottom: 1.2rem;
    height: ${({ $largeScreen }) => $largeScreen ? '35.5rem' : '23rem'};
    width: auto;
    z-index: 0;
`;
const HeroGroup = styled.img`
    position: absolute;
    left: -0.75rem;
    top: ${({ $largeScreen }) => $largeScreen ? '12.65rem' : '8.95rem'};
    max-width: ${({ $largeScreen }) => $largeScreen ? '1.85rem' : '1.2rem'};
    height: auto;
    z-index: 2;
`;
const HeroWifi = styled.img`
    position: absolute;
    left: ${({ $largeScreen }) => $largeScreen ? '3.2rem' : '1.65rem'};
    top: ${({ $largeScreen }) => $largeScreen ? '12rem' : '8.45rem'};
    width: ${({ $largeScreen }) => $largeScreen ? '1.95rem' : '1.25rem'};
    height: auto;
    z-index: 2;
`;
const HeroBench = styled.img`
    position: absolute;
    left: ${({ $largeScreen }) => $largeScreen ? '3.65rem' : '1.9rem'};
    bottom: ${({ $largeScreen }) => $largeScreen ? '-6.75rem' : '-3.25rem'};
    width: ${({ $largeScreen, $tinyScreen }) => $largeScreen ? '35rem' : $tinyScreen ? '20rem' : '100%'};
    height: auto;
    z-index: 2;
`;
const HeroSquirrel = styled.img`
    position: absolute;
    left: ${({ $largeScreen }) => $largeScreen ? '3.55rem' : '1.7rem'};
    bottom: 1.2rem;
    width: ${({ $largeScreen }) => $largeScreen ? '2.3rem' : '1.5rem'};
    height: auto;
    z-index: 0;
`;
const HeroContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${({ $largeScreen }) => $largeScreen ? 'flex-end' : 'center'};
    justify-content: center;
    text-align: ${({ $largeScreen }) => $largeScreen ? 'right' : 'center'};
    width: 100%;
    max-width: ${({ $largeScreen }) => $largeScreen ? '34rem' : '100%'};
    margin-left: auto;
`;
const HeroTitle = styled.h1`
    font-family: Lexend,sans-serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '4rem' : '3rem'};
    font-weight: 400;
    line-height: 1;
    margin: 0;
`;
const HeroTitleAccent = styled.span`
    margin-left: 0.5rem;
    font-family: Lexend,sans-serif;
    color: ${brandColors.chiDarkBlue};
    font-weight: 700;
`;
const HeroKicker = styled.div`
    margin-top: 0.75rem;
    font-family: Lexend,sans-serif;
    color: ${brandColors.chiLightBlue};
    font-size: ${({ $largeScreen }) => $largeScreen ? '2rem' : '1.5rem'};
    font-weight: 400;
    text-align: ${({ $largeScreen }) => $largeScreen ? 'right' : 'center'};
`;
const HeroKickerAccent = styled.div`
    font-family: Lexend,sans-serif;
    color: ${brandColors.chiRed};
    font-size: ${({ $largeScreen }) => $largeScreen ? '2rem' : '1.5rem'};
    font-weight: 700;
    text-align: ${({ $largeScreen }) => $largeScreen ? 'right' : 'center'};
`;
const HeroBody = styled.p`
    margin: 3.13rem 0 0;
    max-width: 30rem;
    text-align: ${({ $largeScreen }) => $largeScreen ? 'right' : 'center'};
    font-family: Space Grotesk,serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.45;
    color: #444444;
`;
const HeroButton = styled(Button)`
    font-family: Space Grotesk,serif;
    margin-top: 2rem;
    background: rgba(0, 88, 153, 1);
    font-weight: 500;
    font-size: 1.5rem;
    line-height: normal;
    letter-spacing: 0;
    text-transform: capitalize;
    min-width: 10rem;
    height: 3.5rem;
    padding: 0 1.5rem;
`;
const SearchBand = styled.section`
    position: relative;
    z-index: 1;
    width: 100%;
    background: url('/img/header/home-page-header-background.svg') center top / cover no-repeat;
    padding: ${({ $largeScreen }) => $largeScreen ? '4.31rem 0 3.03rem' : '3rem 0 2.5rem'};
    overflow: hidden;
`;
const SearchBandInner = styled.div`
    position: relative;
    width: 100%;
    max-width: 54rem;
    margin: 0 auto;
    z-index: 2;
`;
const SearchBandDecor = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    opacity: ${({ $largeScreen }) => $largeScreen ? 1 : 0};
    display: ${({ $largeScreen }) => $largeScreen ? 'block' : 'none'};
`;
const SearchBandDecorItem = styled.img`
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    left: ${({ $x }) => $x};
    top: ${({ $y }) => $y};
    bottom: ${({ $bottom }) => $bottom};
    transform: ${({ $mirror }) => $mirror ? 'scaleX(-1)' : 'none'};
`;
const SearchBandChevron = styled(FaChevronDown)`
    margin-top: 4.65rem;
    font-size: 1.123rem;
    width: 1.123rem;
    height: 1.123rem;
    color: #005899;
    cursor: pointer;
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

const headerDecorItems = [
  { src: '/img/header/header1.svg', offsetFromHeader6: 19.44, y: '6.5rem' },
  { src: '/img/header/header2.svg', offsetFromHeader6: 19.44, bottom: '10.19rem' },
  { src: '/img/header/header3.svg', offsetFromHeader6: 12.87, y: '9.25rem' },
  { src: '/img/header/header4.svg', offsetFromHeader6: 6.5, y: '6.5rem' },
  { src: '/img/header/header5.svg', offsetFromHeader6: 6.5, bottom: '10.19rem' },
  { src: '/img/header/header6.svg', offsetFromHeader6: 0, y: '9.12rem' },
];

const searchBandHeader6LeftAnchor = 25.75;
const searchBandHeader6RightAnchor = 25.75;

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tinyScreen = useMediaQuery('(min-width: 300px)');
  const largeScreen = useMediaQuery('(min-width: 600px)');
  const xlScreen = useMediaQuery('(min-width: 900px)');

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

  const scrollToResources = () => {
    const target = document.getElementById('home-resources');
    if (!target) {
      return;
    }

    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const offset = largeScreen ? 93 : 64;
    window.scrollTo({ top: targetTop - offset, behavior: 'smooth' });
  };

  return (
    <>
      <NavBar />

      <WhiteBackground $largeScreen={largeScreen} style={{ marginBottom: 0 }}>
        <ContentContainer>
          <HeroSectionInner>
            <Grid container spacing={largeScreen ? 4 : 0} alignItems={'center'}>
              <Grid size={{ xs: 12, md: 6 }}>
                <HeroArtwork $largeScreen={largeScreen} $xlScreen={xlScreen}>
                  <HeroLight src={'/img/header/light.svg'} alt={''} $largeScreen={largeScreen} />
                  <HeroGroup src={'/img/header/group.svg'} alt={''} $largeScreen={largeScreen} />
                  <HeroWifi src={'/img/header/wifi.svg'} alt={''} $largeScreen={largeScreen} />
                  <HeroBench src={'/img/header/bench.svg'} alt={''} $largeScreen={largeScreen} $tinyScreen={tinyScreen} />
                  <HeroSquirrel src={'/img/header/squirrel.svg'} alt={''} $largeScreen={largeScreen} />
                </HeroArtwork>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <HeroContent $largeScreen={largeScreen}>
                  <HeroTitle $largeScreen={largeScreen}>
                    Our<HeroTitleAccent>Air</HeroTitleAccent>
                  </HeroTitle>
                  <HeroKicker $largeScreen={largeScreen}>Mapping the Open Air Network</HeroKicker>
                  <HeroKickerAccent $largeScreen={largeScreen}>Built for Chicago, with Chicago.</HeroKickerAccent>
                  <HeroBody $largeScreen={largeScreen}>
                    Air pollution is often invisible, but its impact is real. Now, real-time air quality
                    data is available for every neighborhood, for every Chicagoan, ensuring you and your
                    loved ones have the information you need to breathe easier.
                  </HeroBody>
                  <HeroButton component={NavLink} to={'/map'} variant={"contained"} size={"large"} color={"primary"} style={{ color: 'white' }}>
                    Explore Map &rarr;
                  </HeroButton>
                </HeroContent>
              </Grid>
            </Grid>
          </HeroSectionInner>
        </ContentContainer>
      </WhiteBackground>

      <SearchBand $largeScreen={largeScreen}>
        <SearchBandDecor $side={'left'} $largeScreen={largeScreen}>
          {headerDecorItems.map((item, index) => (
              <SearchBandDecorItem
                key={`left-${index}`}
                src={item.src}
                alt={''}
                $x={`calc(50% - ${searchBandHeader6LeftAnchor + item.offsetFromHeader6}rem)`}
                $y={item.y}
                $bottom={item.bottom}
              />
            ))}
          </SearchBandDecor>
        <SearchBandDecor $side={'right'} $largeScreen={largeScreen}>
          {headerDecorItems.map((item, index) => (
              <SearchBandDecorItem
                key={`right-${index}`}
                src={item.src}
                alt={''}
                $x={`calc(50% + ${searchBandHeader6RightAnchor + item.offsetFromHeader6}rem)`}
                $y={item.y}
                $bottom={item.bottom}
                $mirror
              />
            ))}
        </SearchBandDecor>
        <ContentContainer>
          <SearchBandInner>
            <Geocoder
              size={'large'}
              variant={'home'}
              showSelectedAreas={false}
              onDropdownChange={handleDropdownChanged}
            />
            <Grid container justifyContent={'center'}>
              <SearchBandChevron onClick={scrollToResources} />
            </Grid>
          </SearchBandInner>
        </ContentContainer>
      </SearchBand>

      <WhiteBackground $largeScreen={largeScreen} style={{ marginTop: '5.81rem', scrollMarginTop: '5.81rem' }} id={'home-resources'}>
        <ContentContainer style={{marginBottom: 80}}>
          <SectionHeader imgSrc={'/icons/chiair/aq-resources-icon.svg'}
                        topRowText={'Access useful'}
                        bottomRowTextBlack={'Air Quality'}
                        bottomRowTextRed={'Resources'}
                        buttonOnClick={() => navigate('/map')}
                        buttonText={'View Our Air Map'}
                        buttonIcon={<FaArrowRight style={{ marginLeft: '.5rem' }} />}
          />
        </ContentContainer>
      </WhiteBackground>


      <ContentContainer>
        <Grid container spacing={8} marginBottom={16} alignItems={'start'} rowSpacing={4}>
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
      </ContentContainer>


      <WhiteBackground $largeScreen={largeScreen}>
        <ContentContainer>
          <SectionHeader imgSrc={'/icons/chiair/aq-network.svg'}
                        topRowText={'Empowered by a'}
                        bottomRowTextBlack={'Record-Breaking'}
                        bottomRowTextRed={'Network'}
          />
        </ContentContainer>
      </WhiteBackground>

      <GradientBackground $largeScreen={largeScreen} style={{ marginBottom: 0 }}>
        <ContentContainer>
          <Grid container spacing={0} flexDirection={largeScreen ? 'row' : 'column-reverse'} justifyContent={'space-between'} alignItems={'flex-start'}>
            <img style={{ maxWidth: largeScreen ? '300px' : '100%', maxHeight: '500px' }} src={'/icons/chiair/aq-network-large.svg'} alt={''} />
            <Grid size={{ xs:12, md: 6 }} style={{ fontFamily: 'Space Grotesk', fontSize: '18px' }} alignItems={'center'} textAlign={'right'}>
              <Grid container spacing={0}>
                <div>Traditional monitoring stations are miles apart, missing the pollution pockets that affect specific blocks. To close this gap, we deployed a fleet of {sensorCount} high-precision sensors to blanket the city.</div>
                <div style={{ margin: '2rem 0 1rem' }}>By operating the largest community air monitoring network in the United States (and the second largest in the world), the <NavLink to={'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html'} style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}>Open Air Network</NavLink> sets a new standard for environmental justice, delivering granular, research grade data to the people who need it most.</div>
                <div style={{ margin: '1rem 0 3rem' }}>This mapping application builds on that further, developed with community and cross-sector collaborations across Chicago to ensure the data is easily accessible, in context, and ready for action. <NavLink to={'/about'} style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}>Learn more about us &rarr;</NavLink>.</div>{!largeScreen && <br/> }
              </Grid>
              <Grid container spacing={8} justifyContent={'right'} marginBottom={'4rem'}>
                <img src={'/icons/chiair/uic-logo.svg'} alt={'UIC'} style={{ maxWidth: '100%' }} />
                <img src={'/icons/chiair/uiuc-logo.svg'} alt={'UIUC'} style={{ maxWidth: '100%' }} />
              </Grid>
            </Grid>
          </Grid>
        </ContentContainer>
      </GradientBackground>


      <NavBar style={{ marginBottom: '4rem' }} />
    </>
  );
}
