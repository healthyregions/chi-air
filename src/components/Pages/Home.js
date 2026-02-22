import React, { useCallback } from "react";
import {createSearchParams, Link, NavLink, useNavigate} from "react-router-dom";
import styled, { keyframes } from "styled-components";

import Grid from "@mui/material/Grid";

import { NavBar, Footer } from "../../components";
import Geocoder from "../../components/Map/Geocoder";
import { colors } from "../../config";
import logoList from '../../config/logos.json';
import { Button } from "@mui/material";
import {DropdownButton} from "../VariablePanel/DropdownButton";
import {selectSensorLocations, setSelectedSensors} from "../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {FaArrowRight} from "@react-icons/all-files/fa/FaArrowRight";
import {FaExternalLinkAlt} from "@react-icons/all-files/fa/FaExternalLinkAlt";
// import PostList from "../Posts/PostList";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;


const HomePageContent = styled.div`
  width: 100%;
  margin: 0 auto;
`;


const HomePage = styled.div`
  h1 {
    font-family: "Lora", serif;
    text-align: center;
    font-size: 4rem;
    font-weight: 350;
    color: ${colors.black};
    max-width: 940px;
    margin: 40px 0 40px 0;

  }
  .h1,
  .h2,
  h2 {
    font-family: "Lora", serif;
    text-align: left;
    font-size: 3.5rem;
    font-weight: 300;
    color: ${colors.black};
    width: 80vw;
    margin: 0 0 40px 0;
  }
  .h3,
  .h4,
  .h5,
  .h6,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 0.5rem;
    font-weight: 500;
    line-height: 1.2;
  }
  hr {
    max-width: 1140px;
    margin: 6em auto;
    border: 0;
    border-top: 1px solid ${colors.black};
  }
  p {
    font-family: "Roboto";
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.5;
    color: ${colors.black};
  }
  a {
    color: ${colors.chicagoBlue};
  }
  hr {
      border: 2px solid #f2f6fc;
      width: 75%;
      margin: 30px auto;
  }
            
  .photo2 {
    width: 100%;
    @media (max-width: 960px) {
      max-height: 40vh;
      width: auto;
      margin: 0 auto;
      display: block;
    }
  }
  .logoScrollText {
    font-size:2rem;
    color:black;
    font-family:"Lora", serif;
    padding-bottom:2rem;
  }
`;


const Hero2 = styled.div`
  width: 100%;
  text-align: center;
  color: ${colors.darkgray};
  margin: 0 auto;
  padding: 80px 10px 80px 10px;
  padding: 40px 120px 40px 120px;
  @media (max-width: 960px) {
      padding: 0
  }
  .font-sm {
    font-size: 13px !important;
  }
  .font-md {
    font-size: 1rem !important;
  }
  .font-lg {
    font-size: 1.25rem !important;
  }
  p {
    font-family: "Roboto";
    font-weight: 300;
    font-stretch: normal;
    text-align: left;
    font-style: normal;
    line-height: 1.6;
    letter-spacing: normal;
    padding: 2rem 0;
  }
  #button-cta {
    font-family: "Lora", serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1.75px;
    line-height: 5;
    justify-content: center;
    text-align: center;
    background-color: #ffffff;
    color: ${colors.darkgray};
    padding: 1rem 1.5rem;
    margin: 1rem;
    // border-radius: .3rem;
    text-decoration: none;
  }

  #button-search {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1.75px;
    text-align: center;
    justify
    text-transform: uppercase;
    background-color: ${colors.darkgray};
    color: #ffffff;
    padding: 1rem 1.5rem;
    text-decoration: none;
    line-height: 2.5;
  }

  .small-text {
    font-size: 0.75rem;
    a {
      font-size: 0.75rem;
      color: ${colors.orange};
      text-decoration: none;
    }
  }
  video {
    margin-bottom: 20px;
    width: 100%;
    max-width: 600px;
  }
  .map-caption {
    font-size: 0.9rem;
    text-align: left;
  }
`;


const Hero = styled.div`
  width: 100%;
  max-width: 1140px;
  text-align: center;
  color: ${colors.darkgray};
  margin: 0 auto;
  padding: 80px 10px 80px 10px;
  h1 {
    margin: auto;
  }
  .font-sm {
    font-size: 13px !important;
  }
  .font-md {
    font-size: 1rem !important;
  }
  .font-lg {
    font-size: 1.25rem !important;
  }
  p {
    font-family: "Roboto";
    font-weight: 300;
    font-stretch: normal;
    text-align: left;
    font-style: normal;
    line-height: 1.6;
    letter-spacing: normal;
    padding: 2rem 0;
  }
  #button-cta {
    font-family: "Lora", serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1.75px;
    line-height: 5;
    text-align: center;
    justify-content: center;
    background-color: #ffffff;
    color: ${colors.darkgray};
    padding: 1rem 1.5rem;
    margin: 1rem;
    // border-radius: .3rem;
    text-decoration: none;
  }

  #button-search {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1.75px;
    text-align: center;
    text-transform: uppercase;
    background-color: ${colors.darkgray};
    color: #ffffff;
    padding: 1rem 1.5rem;
    text-decoration: none;
    line-height: 2.5;
  }

  .small-text {
    font-size: 0.75rem;
    a {
      font-size: 0.75rem;
      color: ${colors.orange};
      text-decoration: none;
    }
  }
  video {
    margin-bottom: 20px;
    width: 100%;
    max-width: 600px;
  }
  .map-caption {
    font-size: 0.9rem;
    text-align: left;
  }
`;

// const ShowCaseContainer = styled.div`
//   padding:0 0 3em 0;
//   p {
//     max-width:80ch;
//     margin:0 auto;
//   }
// `

const ThreeUpGrid = styled(Grid)`
  padding: 2em 0;
  margin: 1em 0;
  h2 {
    color: ${colors.darkgray};
    text-align: left;
    font-size: 2rem;
    font-family: "Lora", serif;
    margin: 0 0 0.5rem 0.5rem;
    padding: 0;
  }
  p {
    color: ${colors.light};
    font-family: "Roboto", sans-serif;
    text-align: left;
    line-height: 1.1;
    margin: 0.5rem 0 0 0;
    padding: 0;
    font-size: 1rem;
    max-width: 95%;
  }
  img {
    width: 80%;
    max-width: 10em;
    display: block;
  }
  a {
    padding: 0.5rem 1rem;
    text-decoration: none;
    background: ${colors.forest};
    color: white;
    border-radius: 0.3rem;
    margin: 0.5rem 1rem 0 0;
    text-align: left;
    font-size: 1rem;
    font-weight: bold;
    display: table;
    box-shadow: 5px 5px 20px ${colors.forest}55;
    transition: 250ms all;
    @media (max-width: 900px){
      margin:1rem auto 2rem auto;
      text-align:center;
    }
    &:hover {
      background: ${colors.fuschia};
      box-shadow: 5px 10px 20px ${colors.forest}88;
    }
  }
`;

// const PostContainer = styled(Grid)`
//   padding: 0 2rem;
//   margin: 0rem 0;
//   a {
//     text-decoration: none;
//     .post-title {
//       text-decoration: underline;
//     }
//   }

//   a.button {
//     padding: 0.5rem 1rem;
//     text-decoration: none;
//     background: ${colors.forest};
//     color: white;
//     border-radius: 0.3rem;
//     margin: 0.5rem 1rem 0 0;
//     text-align: left;
//     font-size: 1rem;
//     font-weight: bold;
//     display: table;
//     box-shadow: 5px 5px 20px ${colors.forest}55;
//     transition: 250ms all;
//     @media (max-width: 900px){
//       margin:1rem auto 2rem auto;
//       text-align:center;
//     }
//     &:hover {
//       background: ${colors.fuschia};
//       box-shadow: 5px 10px 20px ${colors.forest}88;
//     }
//   }

//   p {
//     padding: 0;
//     margin: 0;
//     max-width: 90%;
//   }
// `;

const GeocoderContainer = styled(Grid)`
  margin: 0.5rem 0;
    min-width: 45vw;
  p {
    max-width: 90%;
  }
`;

const ContributersContainer = styled.div`
  position:relative;
  overflow:hidden;
  height:5rem;
  margin:1rem 0 3rem 0;
  pointer-events:none;
  img {
    height:5rem;
    display:inline;
    margin:0 1rem;
    float:left;
  }
`

const slide = keyframes`
  from {
    left:0;
  }

  to {
    left:-140%;
  }
`;
const ContributersContainerInner = styled.div`
  width:auto;
  position:absolute;
  animation: ${slide} 30s linear infinite;
`

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
                <div style={{ textAlign: 'center', fontFamily: 'Lexend', fontWeight: 700, fontSize: '24px', color: '#005899' }}>{resource?.name} <FaExternalLinkAlt style={{ marginLeft:'0.5rem'}} /></div>
                <div style={{ textAlign: 'center', fontFamily: 'Space Grotesk', fontWeight: 400, fontSize: '18px', color: '#444444' }}>{resource?.description}</div>
              </Grid>
            </Grid>
          )}
        </Grid>
      </GradientBackground>

      <WhiteBackground>

      </WhiteBackground>

      <GradientBackground>

      </GradientBackground>

      <HomePageContent>

      <Hero>
              <Grid container spacing={0}>

                  <Grid item xs={12} md={12}>

                  <h1 style={{fontFamily:'Big Shoulders'}}>Chicago Air Quality</h1>

                  {/* <ShowCaseContainer>
                      <Showcase />
                  </ShowCaseContainer> */}

                  </Grid>
                  <GeocoderContainer container spacing={0} alignItems="center">
            <Grid item xs={12} sm={12} md={6}>
                <p className={'font-lg'}>
              <span>
                Magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
              </span></p>
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
                <Link to="/map">
                    <img
                        className="photo"
                        src={process.env.PUBLIC_URL + "/img/map-view.webp"}
                        alt="Wild Onion"
                        loading="lazy"
                        width="100%"
                    />
                </Link>


                <Geocoder
                    id="Geocoder"
                    placeholder={" Type in an address or zip code to start mapping, e.g. 60643"}
                    API_KEY={MAPBOX_ACCESS_TOKEN}
                    onChange={handleGeocoder}
                />

            </Grid>
        </GeocoderContainer>

              </Grid>
      </Hero>

        <Hero>

        <GeocoderContainer container spacing={0} alignItems="center">
            <Grid item xs={12} sm={12} md={6}>
                <br />
                <h2>Mapping air quality </h2>
                <p className={'font-lg'}>
              <span>
                Magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
              </span></p>
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
                <Link to="/map">
                    <img
                        className="photo"
                        src={process.env.PUBLIC_URL + "/img/map-view.webp"}
                        alt="Wild Onion"
                        loading="lazy"
                        width="100%"
                    />
                </Link>


                <Geocoder
                    id="Geocoder"
                    placeholder={" Type in an address or zip code to start mapping, e.g. 60643"}
                    API_KEY={MAPBOX_ACCESS_TOKEN}
                    onChange={handleGeocoder}
                />

            </Grid>
        </GeocoderContainer>
        <hr></hr>

        <Grid item xs={12} sm={12} md={12}>
            <br /><br />
            <h2> Explore the Dashboard </h2>
            <br /> <br />

            </Grid>

          <ThreeUpGrid container spacing={0}>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <Grid container spacing={0} alignItems="center">
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <img
                    className="photo"
                    src={process.env.PUBLIC_URL + "/icons/nature-book.png"}
                    alt="Wild Onion"
                    loading="lazy"
                  />
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                  <h2>Community <br /> Report</h2>
                </Grid>
              </Grid>
              <p className={'font-md'}>
                Get a dynamic report about key indicators and environmental
                metrics for your neighborhood. Search by your location.{" "}
              </p>
              <Link to="/community">Find Your Community</Link>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <Grid container spacing={0} alignItems="center">
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <img
                    className="photo"
                    src={process.env.PUBLIC_URL + "/icons/tree-location.svg"}
                    alt="Wild Onion"
                    loading="lazy"
                  />
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                  <h2>Thing 2</h2>
                </Grid>
              </Grid>

              <p className={'font-md'}>
                Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
              </p>
              <Link to="/map">Feature link</Link>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <Grid container spacing={0} alignItems="center">
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <img
                    className="photo"
                    src={process.env.PUBLIC_URL + "/icons/resource_guide.png"}
                    alt="Wild Onion"
                    loading="lazy"
                  />
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                  <h2>
                    Thing 3
                  </h2>
                </Grid>
              </Grid>
              <p className={'font-md'}>
                {" "}
                Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo{" "}
              </p>
              <Link to="/guide">Another link</Link>
            </Grid>
          </ThreeUpGrid>

          </Hero>

          <Hero2 style={{ background: '#f2f6fc' }} >

<GeocoderContainer container spacing={0} alignItems="center">
    <Grid item xs={12} sm={12} md={6}>
    <h2>Second panel</h2>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
    </Grid>

    <Grid item xs={12} sm={12} md={6}>
      <a href="https://drive.google.com/file/d/1pe3grtQEo8m8zbt4eUOzxaziCilPGNWH/view?usp=sharing">
    <img
            className="photo"
            src={process.env.PUBLIC_URL + "/img/christian-wiediger-rpZHKBowuig-unsplash.jpg"}
            alt="Wild Onion"
            loading="lazy"
            width="80%"
          />
          </a>
    </Grid>
  </GeocoderContainer>

  </Hero2>
      <Hero>
        <Grid item xs={12} md={12}>
          <p className={'font-lg'}>Place logo files in <code>public/img/logos/</code> and create entries in the <strong>Data Dictionary and Variables</strong> spreadsheet to generate a scrolling logo list below.</p>
          <LogoScroll logoList={logoList} />
        </Grid>
        </Hero>
      </HomePageContent>
      <Footer />
    </HomePage>
  );
}


function LogoScroll({ logoList, autoscroll = true }) {
  return (
    <ContributersContainer>
      <ContributersContainerInner>
        {logoList.map(({ ImagePath }, i) =>
          <img key={`logo-scroll-1-${i}`} src={process.env.PUBLIC_URL + ImagePath} alt="" loading="eager" />
        )}
        {logoList.map(({ ImagePath }, i) =>
          <img key={`logo-scroll-2-${i}`} src={process.env.PUBLIC_URL + ImagePath} alt="" loading="eager" />
        )}
      </ContributersContainerInner>
    </ContributersContainer>
  )
}
