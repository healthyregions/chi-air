import styled from 'styled-components';
import { NavBar } from '../../components';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {FaExternalLinkAlt} from "react-icons/fa";
import {GradientBackground, productName, WhiteBackground} from "../VariablePanel/common";
import {SectionHeader} from "../VariablePanel/SectionHeader";
import {selectLocale} from "../../store/slices/sensorDataSlice";
import {useSelector} from "react-redux";

const ResourcesPage = styled.div`
    background:white;
`;

const TeamBodyText = styled(Grid)`
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    text-align: right;
`;

const TeamHeadText = styled(Grid)`
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    text-align: left;
    margin-bottom: 1rem;
`;

const TeamHead1Text = styled(Grid)`
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    text-align: left;
    margin-bottom: 1rem;
`;

const StyledAnchorLink = styled.a`
    color: #41b6e7;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
`;

const ContentContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
`;

const TopDivider = styled.hr`
    margin: 2.75rem 0 5.375rem;
    border: 0;
    border-top: 1px solid #41B6E6;
`;

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

const ContributorLabel = styled.div`
    text-align: center;
    font-family: Lexend,sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: #005899;
    min-height: ${({ $largeScreen }) => $largeScreen ? '0rem' : ''}
`;

const ContributorDescription = styled.div`
    text-align: center;
    font-family: Space Grotesk,serif;
    font-weight: 400;
    font-size: 18px;
    color: #444444;
`;

const leadership = [
  {
    photo: '/img/team/erdal.png',
    name: 'Serap Erdal, Ph.D.',
    description: 'Principal Investigator, University of Illinois Chicago',
  },
  {
    photo: '/img/team/persky.png',
    name: 'Victoria Persky, M.D.',
    description: 'Co-Investigator, University of Illinois Chicago',
  },
  {
    photo: '/img/team/kolak.png',
    name: 'Marynia Kolak, Ph.D.',
    description: 'Co-Investigator, University of Illinois Urbana-Champaign',
  },
  {
    photo: '/img/team/wang.png',
    name: 'Meida Wang, Ph.D.',
    description: 'Co-Investigator, University of Illinois Chicago',
  }
];

const coreteam = [
  {
    photo: '/img/team/astacio-palmer.png',
    name: 'Marc Astacio-Palmer, MS',
    description: 'Research Manager, UIUC',
  },
  {
    photo: '/img/team/kamaria.png',
    name: 'Kamaria Barronville, Ed.D.',
    description: 'Research Specialist, UIUC',
  },
  {
    photo: '/img/team/mallikarjun.png',
    name: 'Mallikarjun Bhansoor, MS',
    description: 'Research Scientist, UIUC',
  },
  {
    photo: '/img/team/cox.png',
    name: 'Adam Cox, MS',
    description: 'Sr. Engineer, UIUC',
  },
  {
    photo: '/img/team/fiffer.png',
    name: 'Melissa Fiffer, Ph.D.',
    description: 'Scientific Consultant, UIC',
  },
  {
    photo: '/img/team/person.png',
    name: 'Camrin Garrett, MS',
    description: 'Research Specialist, UIUC',
  },
  {
    photo: '/img/team/kumar.png',
    name: 'Shubham Kumar, MSIM',
    description: 'Sr. Product Designer, UIUC',
  },
  {
    photo: '/img/team/lambert.png',
    name: 'Sara Lambert',
    description: 'Lead Sr. Engineer, UIUC',
  },
  {
    photo: '/img/team/pagone.png',
    name: 'Frank Pagone, Ph.D.',
    description: 'Sr. Manager, RHP',
  },
  {
    photo: '/img/team/tootoo.png',
    name: 'Joshua Tootoo',
    description: 'Scientific Consultant, UIC',
  },
  {
    photo: '/img/team/jocelynV.png',
    name: 'Jocelyn Vazquez-Gomez',
    description: 'Community Science Organizer, LVEJO',
  }
];

const students = [
  {
    photo: '/img/team/oni.png',
    name: 'Onongoo (Oni) Amar',
    description: 'Research Assistant, UIC',
  },
  {
    photo: '/img/team/discenza.png',
    name: 'Catherine Discenza',
    description: 'Research Assistant, UIUC',
  },
  {
    photo: '/img/team/mahjabin.png',
    name: 'Mahjabin Kabir Adrita, MS',
    description: 'Research Assistant, UIUC',
  },
  {
    photo: '/img/team/zhengrui.png',
    name: 'Zhengrui Huang',
    description: 'Research Assistant, UIC',
  },
  {
    photo: '/img/team/nianen.png',
    name: 'Nianen Si',
    description: 'Research Assistant, UIUC',
  },
  {
    photo: '/img/team/qingwen.png',
    name: 'Qingwen Zeng',
    description: 'Research Assistant, UIC',
  }
];

const communityorgs = [
  {
    url: 'https://www.chicagoejn.org/',
    photo: '/img/team/cejn.png',
    name: 'Chicago Environmental Justice Network',
    description: 'Mariah M. Mata, Myrna Salgado',
  },
  {
    url: 'https://www.growgreater.org/',
    photo: '/img/team/gge.jpg',
    name: 'Grow Greater Englewood',
    description: 'John Paul Jones, Adonnis Platt',
  },
  {
    url: 'https://www.lvejo.org/',
    photo: '/img/team/lvejo.png',
    name: 'Little Village Environmental Justice Organization',
    description: 'Jocelyn Vazquez-Gomez',
  },
   {
    url: 'https://openlands.org/',
    photo: '/img/team/OPL-Htag-purple.jpg',
    name: 'Openlands',
    description: '',
  },
  {
    url: 'https://n4ej.org/',
    photo: '/img/team/n4ej.jpg',
    name: 'Neighbors for Environmental Justice',
    description: 'Sonia Monet Saxon, Alfredo Romo, Madalynn Benavides, Anthony Moser',
  },
  {
    url: 'https://www.peopleforcommunityrecovery.org/',
    photo: '/img/team/pcr.png',
    name: 'People for Community Recovery',
    description: 'Jasmine Ray, Jermica Davis',
  },
    {
    url: 'https://prn.mayfirst.info/about-us/',
    photo: '/img/team/prn.png',
    name: 'People\'s Response Network',
    description: '',
  },
  {
    url: 'https://pilsenperro.org/',
    photo: '/img/team/perro.png',
    name: 'Pilsen Environmental Rights & Reform Organization',
    description: 'Ajay Chatha, Apriori Diaz, Citlalli Trujillo, Estephany Baumgarder Leandro-Torres, Jaime Valero-Torres, Rose Gomez, Zitlalli Paez',
  },
  {
    url: 'https://www.swcollective.org/',
    photo: '/img/team/swc.jpg',
    name: 'The Southwest Collective',
    description: '',
  },
  {
    url: 'https://www.womenforgreenspaces.org/',
    photo: '/img/team/wgs.png',
    name: 'Women for Green Spaces',
    description: '',
  }
];

const communityindividual = [
  {
    name: '',
    description: <><strong>Ben Barrett</strong>, Northwestern University</>
  },
  {
    name: '',
    description: <><strong>Benjamin Campbell, Ph.D.</strong>, University of Illinois Urbana Champaign</>
  },
  {
    name: '',
    description: <><strong>Bill Miller, Ph.D.</strong>, Northwestern University</>
  },
  {
    name: '',
    description: <><strong>Beth Beyer</strong>, The Technology Alliance</>
  },
  {
    name: '',
    description: <><strong>Christine Dannhausen-Brun, MPH</strong>, Nordson Green Earth Foundation</>
  },
  {
    name: '',
    description: <><strong>Daisy Magana, MPH</strong>, Univeristy of Illinios Chicago School of Public Health</>
  },
  {
    name: '',
    description: <><strong>Alex Peimer, Ph.D.</strong>, Northeastern Illinois University</>
  },
  {
    name: '',
    description: <><strong>Julia McKenna</strong>, STRONG Manoomin Collective</>
  }
];

const ResourceLinkIcon = styled(FaExternalLinkAlt)`
    font-size: 18px;
    margin-left: 0.5rem;
    color: #00589980;
`;

export default function Team() {
  const largeScreen = useMediaQuery('(min-width: 600px)');
  const locale = useSelector(selectLocale);

  console.log('Current locale is: ', locale);

  return (
    <ResourcesPage>
      <NavBar />

      <WhiteBackground $largeScreen={largeScreen}>
        <ContentContainer>
          <Grid container spacing={3} justifyContent={'right'} textAlign={'right'}>
            <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '48px', fontWeight: 700, color: '#005899' }}>
              Team
            </Grid>
          </Grid>
          <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'}>
            <TeamBodyText size={12}>
              <b className={'notranslate'}>{productName}</b>&nbsp;is a collective effort driven by a shared commitment to air quality and data science and transparency, and public health. This page honors the diverse group of individuals, from academic institutions to community partners across Chicago, who contributed their technical insights and lived experiences to architect a platform that empowers people to understand the quality of air they breathe in Chicago, IL.
            </TeamBodyText>
          </Grid>
        </ContentContainer>
      </WhiteBackground>

      <WhiteBackground $largeScreen={largeScreen}>
        <ContentContainer>
          <TopDivider />
          <SectionHeader imgSrc={'/icons/chiair/aq-team-collab.svg'}
                         topRowText={'Passionately built'}
                         bottomRowTextBlack={'With'}
                         bottomRowTextRed={'Collaboration'}
          />
          {/*buttonOnClick={() => navigate('/contact')}*/}
          {/*buttonText={'Contact Us'}*/}
          {/*buttonIcon={<FaArrowRight style={{ marginLeft: '.5rem' }} />}*/}

          <CategorySection>
            <CategoryTitle $largeScreen={largeScreen}>Chicago Air Quality Program Leadership</CategoryTitle>
                <Grid container spacing={5}>
                  <Grid size={{ xs: 12, md: 4 }}>
                      <TeamHeadText>
                        Lead Institution
                      </TeamHeadText>
                      <img src="/img/team/uic.png" alt={''} style={{ marginRight: '64px' }} />
                  </Grid>
                  <Grid size={{ xs: 12, md:4 }}>
                      <TeamHead1Text>
                        Contributing Institution
                      </TeamHead1Text>
                      <img src="/img/team/uiuc.png" alt={''} style={{ marginRight: '64px' }} />
                  </Grid>
                </Grid>
          </CategorySection>


          <Grid container spacing={8} marginBottom={8} alignItems={'start'} rowSpacing={4}>
            {leadership?.map((contributor, index) =>
              <Grid key={'leadership-' + index} size={{ xs: 12, md: 3 }} justifyItems={'center'}>
                <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                  <img src={contributor?.photo} alt={''} height={113} />
                  <ContributorLabel $largeScreen={largeScreen}>{contributor?.name}</ContributorLabel>
                  <ContributorDescription>{contributor?.description}</ContributorDescription>
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'} marginBottom={8}>
            <TeamBodyText>
              The Chicago Air Quality Program, led by UIC, is a strong community-driven project that involved active participation
              and contribution of UIC’s seven official community partners under the two UIC grants [i.e., Southeast Environmental Task Force
              (SETF), Little Village Environmental Justice Organization (LVEJO), Alliance of the Southeast (ASE), People for Community Recovery
              (PCR). Neighbors for Environmental Justice (N4EJ), Chicago Environmental Justice Network (CEJN), Pilsen Environmental Rights
              and Reform Organization (PERRO)], six additional community organizations serving on the CDPH's Advisory Board [i.e.,
              Communities United, Grow Greater Englewood (GGE), ONE Northside, Openlands, Westside Community Alliance (WCA), and The Southwest
              Collective], and many others who participated in our focus group sessions and surveys. Please refer to the Chicago Department of
              Public Health's (CDPH){" "}
              <a href="https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html"
                 style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
                 target={'_blank'} rel="noreferrer noopener">
              Open Air</a>{" "}website to learn about the 13 community organizations serving on CDPH's “Open Air Chicago” Advisory Committee.

            </TeamBodyText>
            </Grid>
          </Grid>

          <CategorySection>
              <CategoryTitle $largeScreen={largeScreen}>OurAir Dashboard Leadership</CategoryTitle>
                <Grid container spacing={10}>
                  <Grid size={{ xs: 12, md: 7 }}>
                      <TeamBodyText>
                        The OurAir mapping platform was developed by the{" "}
                        <a href="https://healthyregions.org/"
                           style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
                           target={'_blank'} rel="noreferrer noopener">
                          Healthy Regions & Policies Lab
                        </a>{" "}at the University of Illinois, directed by <b>Dr. M. Kolak</b>, in close
                        collaboration with Program Leadership, UIC Partners, the Core Team, Student Researchers,
                        and dozens of Chicagoland contributors.
                      </TeamBodyText>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }} container spacing={5}>
                    <StyledAnchorLink href="https://healthyregions.org/"><img src="/img/team/herop.png" alt={''} height={90} /></StyledAnchorLink>
                    <img src="/img/team/i.png" alt={''} height={90} />
                    <img src="/img/team/CAMP.CIRC.SM.RGB.png" alt={''} height={90} />
                  </Grid>
              </Grid>

          </CategorySection>

          <CategorySection>
            <CategoryTitle $largeScreen={largeScreen}>Core Team</CategoryTitle>
          </CategorySection>

          <Grid container spacing={8} marginBottom={8} alignItems={'start'} rowSpacing={4}>
            {coreteam?.map((contributor, index) =>
              <Grid key={'coreteam-' + index} size={{ xs: 12, md: 3 }} justifyItems={'center'}>
                <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                  <img src={contributor?.photo} alt={''} height={113} />
                  <ContributorLabel className={contributor?.name === 'Sara Lambert' && locale !== 'zh-CN' ? '' : 'notranslate'} $largeScreen={largeScreen}>{contributor?.name}</ContributorLabel>
                  <ContributorDescription>{contributor?.description}</ContributorDescription>
                </Grid>
              </Grid>
            )}
          </Grid>

          <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'} marginBottom={8}>
            <TeamBodyText>
              We are additionally grateful to <b className={'notranslate'}>Pengyin Shan</b> for their technical support and <b className={'notranslate'}>Paulina Arias Caballero</b> for their essential translation services.
              Finally, we are grateful to the <i>Pilsen Arts & Community House</i> for hosting the live co-design session.

            </TeamBodyText>
          </Grid>

          <CategorySection>
            <CategoryTitle $largeScreen={largeScreen}>Student Team</CategoryTitle>
          </CategorySection>

          <Grid container spacing={8} marginTop={9} marginBottom={8} alignItems={'start'} rowSpacing={4}>
            {students?.map((contributor, index) =>
              <Grid key={'students-' + index} size={{ xs: 12, md: 3 }} justifyItems={'center'}>
                <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                  <img src={contributor?.photo} alt={''} height={113} />
                  <ContributorLabel className={'notranslate'} $largeScreen={largeScreen}>{contributor?.name}</ContributorLabel>
                  <ContributorDescription>{contributor?.description}</ContributorDescription>
                </Grid>
              </Grid>
            )}
          </Grid>

        </ContentContainer>
      </WhiteBackground>

      <ContentContainer>
        <SectionHeader imgSrc={'/icons/chiair/aq-team-community.svg'}
                       topRowText={'Co-created with'}
                       bottomRowTextBlack={'The'}
                       bottomRowTextRed={'Community'}
                       style={{ marginBottom: '2rem' }}
        />
      </ContentContainer>


      <GradientBackground $largeScreen={largeScreen} style={{ marginBottom: 0, paddingBottom: largeScreen ? '5rem' : '4rem' }}>

      <ContentContainer>
      <CategorySection>
            <CategoryTitle $largeScreen={largeScreen}>OurAir Group Contributors</CategoryTitle>
      </CategorySection>
        <Grid container spacing={8} marginBottom={8} alignItems={'start'} rowSpacing={4}>
          {communityorgs?.map((contributor, index) =>
            <Grid key={'communityorgs-' + index} size={{ xs: 12, md: 3 }}
              onClick={() => contributor?.url && window.open(contributor.url, '_blank', 'noopener,noreferrer')}
              style={{ cursor: 'pointer' }} justifyItems={'center'}>
              <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                <img src={contributor?.photo} style={{ minHeight: '100px', maxHeight: '100px' }} alt={''} height={113} />
                <ContributorLabel className={'notranslate'} $largeScreen={largeScreen}>{contributor?.name} <ResourceLinkIcon /></ContributorLabel>
                <ContributorDescription className={'notranslate'}>{contributor?.description}</ContributorDescription>
              </Grid>
            </Grid>
          )}
        </Grid>

      </ContentContainer>

        <ContentContainer>
        <CategorySection>
            <CategoryTitle $largeScreen={largeScreen}>OurAir Individual Contributors</CategoryTitle>
        </CategorySection>
          <Grid container spacing={8} marginBottom={8} alignItems={'start'} rowSpacing={4}>
            {communityindividual?.map((contributor, index) =>
              <Grid key={'communityindividual-' + index} size={{ xs: 12, md: 3 }} justifyItems={'center'}>
                <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                  <ContributorLabel className={'notranslate'} $largeScreen={largeScreen}>{contributor?.name}</ContributorLabel>
                  <ContributorDescription className={'notranslate'}>{contributor?.description}</ContributorDescription>
                </Grid>
              </Grid>
            )}
          </Grid>
          <TeamBodyText>
            <h3>Gratitude to all OurAir contributors, survey & focus group participants, and conversations.</h3>
          </TeamBodyText>
          <TeamBodyText>
            While only consenting members are featured, this mapping platform was shaped by the collective input of everyone involved.
          </TeamBodyText>
        </ContentContainer>
      </GradientBackground>

      <NavBar />
    </ResourcesPage>
  );
}
