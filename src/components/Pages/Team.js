import styled from 'styled-components';
import { NavBar } from '../../components';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GradientBackground, WhiteBackground } from "../VariablePanel/common";

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

const Header = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2rem;
    flex-direction: ${({ $largeScreen }) => $largeScreen ? 'row' : 'column-reverse'};
`;

const ExpandButton = styled.button`
    border: 0;
    padding: 0;
    background: transparent;
    color: #005899;
    cursor: pointer;
    font-family: Lexend,sans-serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '24px' : '16px'};
    line-height: 1.2;
`;

const HeaderContent = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 1rem;
    margin-left: auto;
`;

const HeaderText = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    text-align: right;
`;

const HeaderTopRow = styled.div`
    color: #444444;
    font-family: Lexend,sans-serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '32px' : '18px'};
    font-weight: 400;
    line-height: 1.1;
`;

const HeaderBottomRow = styled.div`
    color: #444444;
    font-family: Lexend,sans-serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '32px' : '18px'};
    font-weight: 700;
    line-height: 1.1;
`;

const HeaderBottomAccent = styled.span`
    color: #E4002B;
`;

const HeaderIcon = styled.img`
    width: ${({ $largeScreen }) => $largeScreen ? '100px' : '42px'};
    height: auto;
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
    name: 'Serap Erdal',
    description: 'Principal Investigator, University of Illinois Chicago',
  },
  {
    photo: '/img/team/kolak.png',
    name: 'Marynia Kolak',
    description: 'Co-Investigator, University of Illinois Urbana-Champaign',
  },
  {
    photo: '/img/team/persky.png',
    name: 'Victoria Persky',
    description: 'Co-Investigator, University of Illinois Chicago',
  },
  {
    photo: '/img/team/wang.png',
    name: 'Meida Wang',
    description: 'Co-Investigator, University of Illinois Chicago',
  }
];

const coreteam = [
  {
    name: 'Sara Lambert',
    description: 'Sr. Engineer, UIUC',
  },
  {
    name: 'Shubham Kumar',
    description: 'Sr. Product Designer, UIUC',
  },
  {
    name: 'Frank Pangone',
    description: 'Sr. Manager, RHP',
  },
  {
    name: 'Marc Astacio-Palmer',
    description: 'Research Manager, UIUC',
  },
  {
    name: 'Melissa Fiffer',
    description: 'Collaborator, UIC',
  },
  {
    name: 'Joshua Tootoo',
    description: 'Collaborator, UIC',
  },
  {
    name: 'Adam Cox',
    description: 'Sr. Engineer, UIUC',
  }
];

const students = [
  {
    name: 'Onongoo (Oni) Amar',
    description: 'Research Assistant, UIC',
  },
  {
    name: 'Catherine Discenza',
    description: 'Research Assistant, UIUC',
  },
  {
    name: 'Mahjabin Kabir Adrita',
    description: 'Research Assistant, UIUC',
  },
  {
    name: 'Zhengrui Huang',
    description: 'Research Assistant, UIC',
  },
  {
    name: 'Qingwen Zeng',
    description: 'Research Assistant, UIC',
  }
];

const communityorgs = [
  {
    url: 'https://www.chicagoejn.org/',
    photo: '/img/team/cejn.png',
    name: 'Chicago Environmental Justice Network',
    description: 'Mariah M. Mata',
  },
  {
    url: 'https://www.growgreater.org/',
    photo: '/img/team/gge.jpg',
    name: 'Grow Greater Englewood',
    description: 'John Paul Jones, Adonnis Platt',
  },
  {
    url: 'https://n4ej.org/',
    photo: '/img/team/n4ej.jpg',
    name: 'Neighbors for Environmental Justice',
    description: 'Sonia Monet Saxon, Alfredo Romo, Madalynn Benavides',
  },
  {
    url: 'https://www.peopleforcommunityrecovery.org/',
    photo: '/img/team/pcr.png',
    name: 'People for Community Recovery',
    description: 'Jasmine Ray, Jermica Davis',
  },
  {
    url: 'https://pilsenperro.org/',
    photo: '/img/team/perro.png',
    name: 'Pilsen Environmental Rights and Reform Organization',
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
  },
  {
    url: 'https://prn.mayfirst.info/about-us/',
    photo: '/img/team/prn.png',
    name: 'People\'s Response Network',
    description: '',
  }
];

const communityindividual = [
  {
    name: 'Ben Barrett',
    description: 'PhD Candidate, Northwestern University',
  },
  {
    name: 'Benjamin Campbell',
    description: 'PhD Candidate, University of Illinois Urbana Champaign',
  },
  {
    name: 'Bill Miller',
    description: 'Professor Emeritus, Northwestern University',
  },
  {
    name: 'Beth Beyer',
    description: 'Executive Director, The Technology Alliance',
  },
  {
    name: 'Christine Dannhausen-Brun, MPH',
    description: 'Chief Operations Officer, Nordson Green Earth Foundation',
  },
  {
    name: 'Daisy Magana',
    description: 'Sr. Research Specialist, UIC SPH',
  },
  {
    name: 'Dr. Alex Peimer',
    description: 'Contributor, Northeastern Illinois University',
  },
  {
    name: 'Jocelyn Vazquez-Gomez',
    description: 'Community Science Organizer, Little Village Environmental Justice Organization',
  },
  {
    name: 'Julia McKenna',
    description: 'Data Steward, STRONG Manoomin Collective',
  }
];

const ResourceLinkIcon = styled(FaExternalLinkAlt)`
    font-size: 18px;
    margin-left: 0.5rem;
    color: #00589980;
`;

export default function Team() {
  const largeScreen = useMediaQuery('(min-width: 600px)');

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
              <b>Our Air</b> is a collective effort driven by a shared commitment to data transparency and public health. This page honors the diverse group of individuals from academic institutions to community partners across Chicago, who contributed their technical insights and lived experiences to architect a platform that empowers people to understand the air they breathe.
            </TeamBodyText>
          </Grid>
        </ContentContainer>
      </WhiteBackground>

      <WhiteBackground $largeScreen={largeScreen}>
        <ContentContainer>
          <TopDivider />
          <Header $largeScreen={largeScreen}>
            <ExpandButton $largeScreen={largeScreen} onClick={''}>
              {/* Add "Contact Us ->" button here later */}
            </ExpandButton>
            <HeaderContent>
              <HeaderText>
                <HeaderTopRow $largeScreen={largeScreen}>Passionately built</HeaderTopRow>
                <HeaderBottomRow $largeScreen={largeScreen}>
                  With <HeaderBottomAccent>Collaboration</HeaderBottomAccent>
                </HeaderBottomRow>
              </HeaderText>
              <HeaderIcon
                $largeScreen={largeScreen}
                src={'/icons/chiair/aq-team-collab.svg'}
                alt={''}
              />
            </HeaderContent>
          </Header>

          <CategorySection>
            <CategoryTitle $largeScreen={largeScreen}>Leadership</CategoryTitle>
            <img src="/img/team/uic.png" alt={''} style={{ marginRight: '64px' }} />
            <img src="/img/team/uiuc.png" alt={''} />
          </CategorySection>

          <Grid container spacing={8} marginBottom={8} alignItems={'start'} rowSpacing={4}>
            {leadership?.map((contributor, index) =>
              <Grid key={'leadership-' + index} size={{ xs: 12, md: 3 }} justifyItems={'center'}>
                <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                  <img src={contributor?.photo} alt={''} />
                  <ContributorLabel $largeScreen={largeScreen}>{contributor?.name}</ContributorLabel>
                  <ContributorDescription>{contributor?.description}</ContributorDescription>
                </Grid>
              </Grid>
            )}
          </Grid>

          <CategorySection>
            <CategoryTitle $largeScreen={largeScreen}>Core Team</CategoryTitle>
          </CategorySection>

          <Grid container spacing={8} marginBottom={8} alignItems={'start'} rowSpacing={4}>
            {coreteam?.map((contributor, index) =>
              <Grid key={'leadership-' + index} size={{ xs: 12, md: 3 }} justifyItems={'center'}>
                <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                  <ContributorLabel $largeScreen={largeScreen}>{contributor?.name}</ContributorLabel>
                  <ContributorDescription>{contributor?.description}</ContributorDescription>
                </Grid>
              </Grid>
            )}
          </Grid>

          <CategorySection>
            <CategoryTitle $largeScreen={largeScreen}>Student Team</CategoryTitle>
          </CategorySection>

          <Grid container spacing={8} marginBottom={8} alignItems={'start'} rowSpacing={4}>
            {students?.map((contributor, index) =>
              <Grid key={'leadership-' + index} size={{ xs: 12, md: 3 }} justifyItems={'center'}>
                <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                  <ContributorLabel $largeScreen={largeScreen}>{contributor?.name}</ContributorLabel>
                  <ContributorDescription>{contributor?.description}</ContributorDescription>
                </Grid>
              </Grid>
            )}
          </Grid>

        </ContentContainer>
      </WhiteBackground>

      <ContentContainer>
        <Header $largeScreen={largeScreen}>
          <HeaderContent>
            <HeaderText style={{ marginBottom: '6rem' }}>
              <HeaderTopRow $largeScreen={largeScreen}>Co-created with</HeaderTopRow>
              <HeaderBottomRow $largeScreen={largeScreen}>
                The <HeaderBottomAccent>Community</HeaderBottomAccent>
              </HeaderBottomRow>
            </HeaderText>
            <HeaderIcon
              $largeScreen={largeScreen}
              src={'/icons/chiair/aq-team-community.svg'}
              alt={''}
            />
          </HeaderContent>
        </Header>
      </ContentContainer>
      <ContentContainer>
        <Grid container spacing={8} marginBottom={8} alignItems={'start'} rowSpacing={4}>
          {communityorgs?.map((contributor, index) =>
            <Grid key={'community-' + index} size={{ xs: 12, md: 3 }}
              onClick={() => contributor?.url && window.open(contributor.url, '_blank', 'noopener,noreferrer')}
              style={{ cursor: 'pointer' }} justifyItems={'center'}>
              <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                <img src={contributor?.photo} style={{ minHeight: '100px', maxHeight: '100px' }} alt={''} />
                <ContributorLabel $largeScreen={largeScreen}>{contributor?.name} <ResourceLinkIcon /></ContributorLabel>
                <ContributorDescription>{contributor?.description}</ContributorDescription>
              </Grid>
            </Grid>
          )}
        </Grid>

      </ContentContainer>

      <GradientBackground $largeScreen={largeScreen} style={{ marginBottom: 0, paddingBottom: largeScreen ? '5rem' : '4rem' }}>
        <ContentContainer>
          <Grid container spacing={8} marginBottom={8} alignItems={'start'} rowSpacing={4}>
            {communityindividual?.map((contributor, index) =>
              <Grid key={'leadership-' + index} size={{ xs: 12, md: 3 }} justifyItems={'center'}>
                <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                  <ContributorLabel $largeScreen={largeScreen}>{contributor?.name}</ContributorLabel>
                  <ContributorDescription>{contributor?.description}</ContributorDescription>
                </Grid>
              </Grid>
            )}
          </Grid>
          <TeamBodyText>
            Gratitude to all survey and focus group participants.
          </TeamBodyText>
          <TeamBodyText>
            While only consenting members are featured, this platform was shaped by the collective input of everyone involved.
          </TeamBodyText>
        </ContentContainer>
      </GradientBackground>

      <NavBar />
    </ResourcesPage>
  );
}
