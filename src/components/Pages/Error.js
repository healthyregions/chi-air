import styled from 'styled-components';

import { ContentContainer } from '../../styled_components';
import {NavBar, Geocoder} from '../';
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  selectSelectedAreas,
  selectSensorLocations,
  setClickedSensor, setSelectedAreas,
  setSelectedSensors
} from "../../store/slices/sensorDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {NavLink, useNavigate} from "react-router-dom";
import {useSelectorAsState, WhiteBackground} from "../VariablePanel/common";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";


const brandColors = {
  chiDarkBlue: '#005899',
  chiRed: '#E4002B',
  chiLightBlue: '#2D9ECD'
}

const ErrorPage = styled.div`
  background:white;
  min-height:100vh;
  text-align:center;
`;

const SearchBand = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    //background: url('/img/header/home-page-header-background.svg') center top / cover no-repeat;
    padding: ${({ $largeScreen }) => $largeScreen ? '4.31rem 0 3.03rem' : '3rem 0 2.5rem'};
    //overflow: hidden;
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
    left: -23px;
    right: 0;
    pointer-events: none;
    display: ${({ $largeScreen }) => $largeScreen ? 'block' : 'none'};
    background: linear-gradient(
      ${({ $direction }) => $direction || 'to bottom'},
      ${({ $startColor }) => $startColor || 'rgba(209, 237, 251, 1)'},
      ${({ $endColor }) => $endColor || 'rgba(255, 255, 255, 1)'}
    );
`;
const SearchBandDecorItem = styled.img`
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    z-index: 10;
    left: ${({ $x }) => $x};
    top: ${({ $y }) => $y};
    transform: ${({ $mirror }) => $mirror ? 'scaleX(-1)' : 'none'};
`;

const headerDecorItems = [
  { src: '/img/header/header1.svg', offsetFromHeader6: 19.44, y: '6.5rem' },
  { src: '/img/header/header2.svg', offsetFromHeader6: 19.44, y: '12rem' },
  { src: '/img/header/header3.svg', offsetFromHeader6: 12.87, y: '9.25rem' },
  { src: '/img/header/header4.svg', offsetFromHeader6: 6.5, y: '6.5rem' },
  { src: '/img/header/header5.svg', offsetFromHeader6: 6.5, y: '12rem' },
  { src: '/img/header/header6.svg', offsetFromHeader6: 0, y: '9.12rem' },
];

const searchBandHeader6LeftAnchor = 25.75;
const searchBandHeader6RightAnchor = 25.75;

const ErrorBodyText = styled(Grid)`
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: 18px;
    font-style: normal;
    margin-top: 1rem;
    font-weight: 400;
    text-align: right;
`;
const HomepageButton = styled(Button)`
    margin-top: 2rem;
    color: rgba(0, 88, 153, 1);
    font-weight: 500;
    font-size: 1.5rem;
    text-transform: capitalize;
    min-width: 10rem;
    height: 3rem;
    padding: 0 1.5rem;
    z-index: 55;
`;
const MapButton = styled(Button)`
    margin-top: 2rem;
    background: ${brandColors.chiDarkBlue};
    font-weight: 500;
    font-size: 24px;
    line-height: 16px;
    letter-spacing: 1px;
    text-transform: capitalize;
    min-width: 10rem;
    height: 3rem;
    padding: 0 1.5rem;
    z-index: 55;
`;

const Error = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const largeScreen = useMediaQuery('(min-width: 600px)');

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
    <ErrorPage >
      <NavBar/>
      <WhiteBackground $largeScreen={largeScreen}>
        <ContentContainer>
          <Grid container spacing={3} justifyContent={'right'} textAlign={'right'}>
            <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '48px', fontWeight: 700, color: '#005899' }}>
              Page Not Found
            </Grid>
          </Grid>
          {/*            <Grid container spacing={3} justifyContent={'right'} textAlign={'right'} marginTop={'2rem'}>
             <Grid size={largeScreen ? 6 : 12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '##444444' }}>
               Air pollution is often invisible, but its impact is real. Now, real-time air quality data is available for every neighborhood, for every Chicagoan.
             </Grid>
           </Grid> */}
          <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'}>
            <ErrorBodyText offset={5} size={7} style={{ fontFamily: 'Space Grotesk', fontSize: '18px'}}>
              Error 404 - Sorry we can't find the page you're looking for.
              <br/><br/>
              Let's get you back on track. Check air quality in your neighborhood by
              exploring the map, or search a Chicago address or a community area, zip
              code, or ward to get started.
            </ErrorBodyText>
          </Grid>
          <Grid container spacing={3} justifyContent={'end'} textAlign={'right'} marginTop={'2rem'}>
            <HomepageButton disableRipple component={NavLink} to={'/'} variant={"text"} size={"large"} style={{ fontFamily: 'Lexend', fontSize: '24px'}}>
              Homepage
            </HomepageButton>

            <MapButton component={NavLink} to={'/map'} variant={"contained"} size={"large"} style={{ fontFamily: 'Lexend', fontSize: '24px'}}>
              Explore Map &rarr;
            </MapButton>
          </Grid>
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
          </SearchBandInner>
        </ContentContainer>
      </SearchBand>

      <NavBar asFooter={true} />
    </ErrorPage>
  );
}

export default Error;
