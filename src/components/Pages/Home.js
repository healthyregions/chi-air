import React, { useCallback } from "react";
import {createSearchParams, NavLink, useNavigate} from "react-router-dom";
import styled from "styled-components";

import Grid from "@mui/material/Grid";

import { NavBar } from "../../components";
import Geocoder from "../../components/Map/Geocoder";
import { Button } from "@mui/material";
import {DropdownButton} from "../VariablePanel/DropdownButton";
import {selectSensorLocations, setSelectedSensors} from "../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {FaArrowRight} from "@react-icons/all-files/fa/FaArrowRight";
import {FaExternalLinkAlt} from "@react-icons/all-files/fa/FaExternalLinkAlt";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;



const HomePage = styled.div`
`;

const GeocoderContainer = styled(Grid)`
  margin: 0.5rem 0;
    min-width: 45vw;
  p {
    max-width: 90%;
  }
`;


const TitleBanner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
    text-align: right;
    font-family: Lexend;
`;


const brandColors = {
  chiDarkBlue: '#005899',
  chiRed: '#E4002B',
  chiLightBlue: '#2D9ECD'
}
const ChiHeader = styled.h1`
    font-family: Lexend !important;
    font-family: Lexend;
    font-size: 64px;
    text-align: right;
`;
const ChiBlackText = styled.span`
    font-family: Lexend;
    font-weight: 400;
    font-style: normal;
`;
const ChiDarkBlueText = styled.span`
    font-family: Lexend;
    color: ${brandColors.chiDarkBlue};
    font-size: 64px;
    text-align: right;
    font-style: normal;
    font-weight: 700;
`;
const ChiLightBlueText = styled.span`
    font-family: Lexend;
    color: ${brandColors.chiLightBlue};
    font-size: 32px;
    font-weight: 400;
    text-align: right;
`;
const ChiRedText = styled.span`
    font-family: Lexend;
    color: ${brandColors.chiRed};
    font-size: 32px;
    font-weight: 700;
    text-align: right;
`;

const ChiSubtitle = styled.span`
    max-width: 35vw;
    margin-top: 3rem;
    display: flex;
    align-self: end;
    text-align: right;
    font-family: Space Grotesk;
    font-size: 18px;
    font-weight: 400;
    font-style: normal;
`;

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

const ViewMapButton = styled(Button)`
    font-family: Space Grotesk !important;
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
const LButton = styled(Button)`
    font-family: Lexend,serif;
    text-transform: none;
    color: #005899;
`;

export default function Home() {
  // const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGeocoder = useCallback((location) => {
    if (location.center !== undefined) {
      navigate({
        pathname: "/map",
        search: createSearchParams({
          lat: location.center[1],
          lon: location.center[0],
       }).toString()
      });
    }
  }, [navigate]);

  const locations = useSelector(selectSensorLocations);
  const handleDropdown = (s, key) => {
    console.log(`Locations: `, locations);
    console.log(`Selecting ${key}: `, s);
    const matches = locations?.filter(l => l?.[key] === s)?.map(l => l?.datasourceId);
    console.log(`Matches: `, matches);
    dispatch(setSelectedSensors(matches));
    navigate('/map');
  }

  const resources = [
    { url: '', icon: '/icons/chiair/resources-graph.svg', backdrop: true, name: 'Start with Air Quality 101', description: 'Dr. Erdal’s introduction to air quality presentation. More about this resource is here' },
    { url: '', icon: '/icons/chiair/resources-tools.svg', backdrop: true, name: 'Build your own Air Filter', description: 'Corsi-Rosenthal Box, more details about this resource is here' },
    { url: '', icon: '/icons/chiair/resources-indoor.svg', backdrop: true, name: 'Indoor Air Quality', description: 'People spend 90% of their time indoors. Learn more about this resource here' },
    { url: '', icon: '/icons/chiair/resources-report.svg', backdrop: true, name: 'Report Air Pollution', description: 'Chi 311 Report Air Pollution. More details about this resource is here' },
    { url: '', icon: '/icons/chiair/resources-square.svg', backdrop: true, name: 'City of Chicago Ordinance', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor' },
    { url: '', icon: '/icons/chiair/resources-triangle.svg', backdrop: true, name: 'Report a Violation (311)', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor' },
    { url: 'https://chichives.com', icon: '/icons/chiair/resources-circle.svg', backdrop: true, name: 'ChiVes Dashboard', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor' },
    { url: '', icon: '/icons/chiair/resources-view-all.svg', backdrop: false, name: 'View all Resources', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor' },
  ]

  return (
    <HomePage>
      <NavBar />

      <WhiteBackground>
        <TitleBanner>
          <ChiHeader><ChiBlackText>Our </ChiBlackText><ChiDarkBlueText>Air</ChiDarkBlueText></ChiHeader>

          <ChiLightBlueText>Mapping the Open Air Network</ChiLightBlueText>
          <ChiRedText>Built for Chicago, with Chicago.</ChiRedText>

          <ChiSubtitle>
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


      <GradientBackground>
        <Grid container spacing={0} alignItems={"center"} justifyContent={'space-between'}>
          <Grid item sm={6} xs={12}>
            <span style={{ marginLeft: '.85rem', fontSize: '18px', fontWeight: 200, flexDirection: 'column', alignContent:'center', fontFamily: 'Space Grotesk' }}>
              <strong style={{ fontWeight: 600 }}>Search</strong> any Chicago Address
            </span>
            <GeocoderContainer container spacing={0} alignItems="center">
              <Geocoder
                id="Geocoder"
                style={{ borderRadius: '100px' }}
                API_KEY={MAPBOX_ACCESS_TOKEN}
                onChange={handleGeocoder}
              />
            </GeocoderContainer>
            <Grid container spacing={4} marginLeft={'.5rem'}>
              <DropdownButton ButtonComponent={LButton}
                              buttonProps={{ size: 'large' }}
                              label={'Community'}
                              options={locations?.map(l => l?.community)}
                              onChange={(s) => handleDropdown(s, 'community')} />

              <DropdownButton ButtonComponent={LButton}
                              buttonProps={{ size: 'large' }}
                              label={'Zip code'}
                              options={locations?.map(l => l?.zip)}
                              onChange={(s) => handleDropdown(s, 'zip')} />
              {/*<DropdownButton label={'Ward'} options={['zip1', 'zip2']} />*/}
            </Grid>
          </Grid>

          <Grid item sm={6} xs={12} style={{ marginTop: '3rem', display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }} >
            <img src={'/icons/homepage-map-mask.svg'} alt={''} />
          </Grid>
        </Grid>
      </GradientBackground>

      <WhiteBackground style={{ marginTop: '8rem' }}>
        <Grid container spacing={0} justifyContent={'space-between'} alignItems={'start'}>
          <LButton style={{ fontSize: '24px' }} onClick={() => navigate('/map')}>
            View Chi Air Quality Network Map <FaArrowRight style={{ marginLeft: '.5rem' }}/>
          </LButton>
          <Grid container alignItems={'center'} spacing={8}>
            <ChiBlackText style={{ fontSize: '32px', fontWeight: 400, textAlign: 'right' }}>
              <div>Access useful</div>
              <div style={{ fontWeight:700 }}>Air Quality <ChiRedText>Resources</ChiRedText></div>
            </ChiBlackText>
            <img src={'/icons/chiair/aq-resources-icon.svg'} alt={''} />
          </Grid>
        </Grid>
      </WhiteBackground>

      <GradientBackground>
        <Grid container spacing={12} justifyContent={'space-around'} alignItems={'center'} marginX={'8rem'}>
          {resources?.map((resource, index) =>
            <Grid key={'resources-'+index} size={3} style={{ cursor: 'pointer' }} onClick={() => window.location.href = resource?.url} justifyItems={'center'}>
              <Grid container spacing={0} marginY={'1rem'}>
                <img style={{ marginRight: '2rem'  }} src={'/icons/chiair/resources-backlayer.svg'} alt={''} />
                <img style={{ position: 'absolute', marginLeft: '2rem' }} src={resource?.icon} alt={''} />
              </Grid>
              <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                <div style={{ textAlign: 'center', fontFamily: 'Lexend', fontWeight: 700, fontSize: '24px', color: '#005899' }}>{resource?.name} <FaExternalLinkAlt style={{ fontSize: '18px', marginLeft:'0.5rem', color: '#00589980' }} /></div>
                <div style={{ textAlign: 'center', fontFamily: 'Space Grotesk', fontWeight: 400, fontSize: '18px', color: '#444444' }}>{resource?.description}</div>
              </Grid>
            </Grid>
          )}
        </Grid>


        <Grid container spacing={0} justifyContent={'space-between'} alignItems={'center'} marginTop={'10rem'} marginBottom={'4rem'}>
          <Grid size={6}>
            <img style={{ sidth: '400px', height: '600px', marginLeft: '-6rem' }} src={'/icons/chiair/aq-network-large.svg'} alt={''} />
          </Grid>
          <Grid size={6} style={{ fontFamily: 'Space Grotesk', fontSize: '18px' }} alignItems={'center'} textAlign={'right'}>
            <Grid container spacing={8} justifyContent={'right'} alignItems={'center'} marginBottom={'4rem'}>
              <ChiBlackText style={{ fontSize: '32px', fontWeight: 400, textAlign: 'right' }}>
                <div>Empowered by a</div>
                <div style={{ fontWeight:700 }}>Record-Breaking <ChiRedText>Network</ChiRedText></div>
              </ChiBlackText>
              <img src={'/icons/chiair/aq-network.svg'} alt={''} />
            </Grid>
            <Grid container spacing={0}>
              <div>Traditional monitoring stations are miles apart, missing the pollution pockets that affect specific blocks. To close this gap, we deployed a fleet of over 277 high-precision sensors to blanket the city.</div>
              <div style={{ margin: '2rem 0 3rem' }}>By operating the largest community air monitoring network in the United States (and the second largest in the world), The Chi Air Quality Network sets a new standard for environmental justice, delivering granular, research grade data to the people who need it most.  <NavLink to={'/about'} style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}>Learn more about us &rarr;</NavLink></div>
            </Grid>
            <Grid container spacing={8} justifyContent={'right'}>
              <img src={'/icons/chiair/uic-logo.svg'} alt={'UIC'} />
              <img src={'/icons/chiair/uiuc-logo.svg'} alt={'UIUC'} />
            </Grid>
          </Grid>
        </Grid>
      </GradientBackground>

      <WhiteBackground>
        <NavBar />
      </WhiteBackground>
    </HomePage>
  );
}

