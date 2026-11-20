import styled from 'styled-components';
import { NavBar } from '..';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  FaArrowRight,
  FaChartLine,
  FaDoorOpen,
  FaExternalLinkAlt,
  FaHeadSideCough,
  FaLink, FaList, FaMap, FaMapMarkerAlt, FaToolbox,
  FaWind
} from "react-icons/fa";
import {GradientBackground, productName, WhiteBackground} from "../VariablePanel/common";
import {SectionHeader} from "../VariablePanel/SectionHeader";
import {useNavigate} from "react-router-dom";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {FaChalkboardTeacher} from "@react-icons/all-files/fa/FaChalkboardTeacher";
import {FaAirFreshener} from "@react-icons/all-files/fa/FaAirFreshener";
import {FaChartBar} from "@react-icons/all-files/fa/FaChartBar";
import {FaInfo} from "@react-icons/all-files/fa/FaInfo";
import {FaGraduationCap} from "@react-icons/all-files/fa/FaGraduationCap";
import {FaHammer} from "@react-icons/all-files/fa/FaHammer";
import {FaStickyNote} from "@react-icons/all-files/fa/FaStickyNote";
import {
  FaBoltLightning,
  FaCircleCheck,
  FaEnvelopeCircleCheck, FaMobileScreen,
  FaPersonThroughWindow,
  FaScaleBalanced
} from "react-icons/fa6";
import {FaSign} from "@react-icons/all-files/fa/FaSign";
import {FaHospital} from "@react-icons/all-files/fa/FaHospital";
import {FaHospitalSymbol} from "@react-icons/all-files/fa/FaHospitalSymbol";
import {FaStar} from "@react-icons/all-files/fa/FaStar";
import {FaDownload} from "@react-icons/all-files/fa/FaDownload";
import {FaAt} from "@react-icons/all-files/fa/FaAt";

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

// Category ids are used for filtering; labels are translated at render (resources namespace: categories.<id>)
const resourceCategories = [
  { id: 'foundations' },
  { id: 'learning' },
  { id: 'governance' },
  { id: 'supporting' },
];

// No CMS system, define static data structure here instead

// Define some resources, assign them to a Category.
// Card text lives in the `resources` namespace under cards.<id>.name / cards.<id>.description
const foundationalResources = [
  { id: 'outdoorAirQualityIntro', url: 'https://scied.ucar.edu/learning-zone/air-quality/what-is-air-quality', faIcon: <FaWind/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'airQuality101', url: '/resources/Serap Erdal-AIR QUALITY 101 Presentation-6-20-2025.pdf', faIcon: <FaAirFreshener/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'indoorAirQualityIntro', url: 'https://www.epa.gov/report-environment/indoor-air-quality', faIcon: <FaHeadSideCough/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'indoorAirQualityResources', url: 'https://www.epa.gov/indoor-air-quality-iaq/learn-about-indoor-air-quality', faIcon: <FaDoorOpen/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'naaqs', url: 'https://www.epa.gov/criteria-air-pollutants/naaqs-table', faIcon: <FaChartBar/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'whoGuidelines', url: 'https://www.who.int/publications/i/item/9789240034228', faIcon: <FaStickyNote/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'clarityMonitoring', url: 'https://www.clarity.io/air-quality-monitoring-resources', faIcon: <FaInfo/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'aqiInformation', url: 'https://www.airnow.gov/aqi/aqi-basics/', faIcon: <FaBoltLightning />, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
].map(r => ({ ...r, category: 'foundations'}));

const learningResources = [
  { id: 'airKnowledgeCourse', url: 'https://airknowledge.gov/BASC-SI.html', faIcon: <FaGraduationCap/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'classroomActivities', url: 'https://scied.ucar.edu/activity?field_learning_zone_category_target_id=26', faIcon: <FaChalkboardTeacher/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'buildYourOwnFilter', url: 'https://corsirosenthalfoundation.org/instructions/', faIcon: <FaHammer/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'epaWebinars', url: 'https://www.epa.gov/amtic/CommunityAirMonitoringWebinars', faIcon: <FaList/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'highSchoolCurriculum', url: 'https://deohs.washington.edu/air-quality-curriculum-student-led-research-projects', faIcon: <FaHammer/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'epaSensorToolbox', url: 'https://www.epa.gov/air-sensor-toolbox', faIcon: <FaToolbox/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  ].map(r => ({ ...r, category: 'learning'}));

const governanceResources = [
  { id: 'chi311', url: 'https://311.chicago.gov/', faIcon: <FaInfo/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'cumulativeImpactAssessment', url: 'https://www.chicago.gov/city/en/depts/env/supp_info/cumulative-impact-assessment.html#docaccess-45c4545badc7db64483ab543f48066a0', faIcon: <FaChartLine/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'airQualityHealthReport2020', url: 'https://www.chicago.gov/city/en/depts/cdph/provdrs/environmental_health/svcs/air-quality-and-health.html', faIcon: <FaChartBar/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'airQualityOrdinance', url: 'https://www.chicago.gov/city/en/depts/dcd/supp_info/chicago-air-quality-ordinance.html', icon: '/icons/chiair/resources-indoor.svg', faIcon: <FaScaleBalanced/>, backdrop: true },
  { id: 'ejActionPlanReport', url: 'https://www.chicago.gov/content/dam/city/depts/cdph/environment/community_information/2024/EJ-Action-Plan-2024-Report-FULL.pdf', faIcon: <FaEnvelopeCircleCheck/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'deptEnvironment', url: 'https://www.chicago.gov/city/en/progs/env.html', faIcon: <FaSign/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'cdph', url: 'https://www.chicago.gov/city/en/depts/cdph.html', faIcon: <FaHospital/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
].map(r => ({ ...r, category: 'governance'}));

const supportingResources = [
  { id: 'openAirNetworkMap', url: 'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html#modalpop', faIcon: <FaCircleCheck/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'epaAirNow', url: 'https://www.airnow.gov/?city=Chicago&state=IL&country=USA', faIcon: <FaPersonThroughWindow/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'purpleAir', url: 'https://map.purpleair.com/', faIcon: <FaMapMarkerAlt/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'ejIndexMap', url: 'https://www.chicago.gov/content/dam/city/depts/cdph/environment/CumulativeImpact/Chicago-EJ-Index_CAs-1500x2318.jpg', faIcon: <FaDownload/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'ejScreen', url: 'https://screening-tools.com/epa-ejscreen', faIcon: <FaMobileScreen/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'cdcEji', url: 'https://www.atsdr.cdc.gov/place-health/php/eji/index.html', faIcon: <FaCircleCheck/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'chives', url: 'https://chichives.com/', faIcon: <FaPersonThroughWindow/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'healthAtlas', url: 'https://chicagohealthatlas.org/', faIcon: <FaHospitalSymbol/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'cejst', url: 'https://public-environmental-data-partners.github.io/j40-cejst-2/en/#9.29/41.8341/-87.7321T', faIcon: <FaStar/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'policyMap', url: 'https://www.policymap.com/', faIcon: <FaMobileScreen/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'gis101Toolkit', url: 'https://cnt.org/publications/geographic-information-system-gis-101-toolkit-for-environmental-justice-organizations', faIcon: <FaMap/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'sdohPlace', url: 'https://sdohplace.org/', faIcon: <FaLink/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'uicSph', url: 'https://publichealth.uic.edu/', faIcon: <FaHospitalSymbol/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'uiucSese', url: 'https://earth.illinois.edu/', faIcon: <FaPersonThroughWindow/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'uicCeche', url: 'https://ceche.uic.edu/', faIcon: <FaAt/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true },
  { id: 'healthyRegions', url: 'https://healthyregions.org/', faIcon: <FaCircleCheck/>, icon: '/icons/chiair/resources-indoor.svg', backdrop: true }



].map(r => ({ ...r, category: 'supporting'}));

// Combine into a single shared list of resources (now includes category)
const resources = [
  ...foundationalResources,
  ...learningResources,
  ...governanceResources,
  ...supportingResources
];

export default function Resources() {
  const { t } = useTranslation('resources');
  const navigate = useNavigate();
  const largeScreen = useMediaQuery('(min-width: 600px)');

  const [activeCategory, setActiveCategory] = useState('all');
  const visibleCategories = activeCategory === 'all'
    ? resourceCategories
    : resourceCategories.filter(({ id }) => id === activeCategory);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <ResourcesPage>
      <NavBar />

      <WhiteBackground $largeScreen={largeScreen}>
        <ContentContainer>
          <Grid container spacing={3} justifyContent={'right'} textAlign={'right'}>
            <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '48px', fontWeight: 700, color: '#005899' }}>
              {t('header.title')}
            </Grid>
          </Grid>
          <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'}>
            <TeamBodyText size={12}>
              {t('header.intro')}
            </TeamBodyText>
          </Grid>
        </ContentContainer>
      </WhiteBackground>


      <ContentContainer>
        <SectionHeader imgSrc={'/icons/chiair/aq-resources-icon.svg'}
                       topRowText={t('sectionHeader.topRow')}
                       bottomRowTextBlack={t('sectionHeader.bottomRowBlack')}
                       bottomRowTextRed={t('sectionHeader.bottomRowRed')}
                       buttonOnClick={() => navigate('/map')}
                       buttonText={t('sectionHeader.viewMap', { productName })}
                       buttonIcon={<FaArrowRight style={{ marginLeft: '.5rem' }} />}
        />

        <FilterRow direction="row" spacing={1} justifyContent={'flex-end'} useFlexGap flexWrap={'wrap'}>
          <FilterChip
            clickable
            label={t('categories.all')}
            $active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {resourceCategories.map(({ id }) => (
            <FilterChip
              key={id}
              clickable
              label={t(`categories.${id}`)}
              $active={activeCategory === id}
              onClick={() => setActiveCategory(id)}
            />
          ))}
        </FilterRow>

        {visibleCategories?.map((category, catIndex) =>
          <CategorySection key={`resource-category-${catIndex}`}>
            <CategoryTitle $largeScreen={largeScreen}>{t(`categories.${category?.id}`)}</CategoryTitle>
            <Grid container spacing={8} marginBottom={16} alignItems={'start'} rowSpacing={4}>
              {resources?.filter(r => r?.category === category?.id)?.map((resource, resIndex) =>
                <Grid key={'resources-'+resIndex} size={{ xs: 12, md: 3 }} style={{ cursor: 'pointer' }}
                      onClick={() => window.open(resource.url)}
                      justifyItems={'center'}>
                  <Grid container spacing={0} marginY={'1rem'}>
                    <img style={{ marginRight: '2rem' }} src={'/icons/chiair/resources-backlayer.svg'} alt={''} />
                    {/*resource?.icon && <img style={{ position: 'absolute', marginLeft: '2rem' }} src={resource?.icon} alt={''} />*/}
                    {resource?.faIcon && <div style={{ fontSize: '3rem', position: 'absolute', marginLeft: '2rem', color: 'rgb(5, 87, 153)' }}>
                      {resource?.faIcon}
                    </div>}
                  </Grid>
                  <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                    <ResourceLabel $largeScreen={largeScreen}>{t(`cards.${resource?.id}.name`)} <ResourceLinkIcon /></ResourceLabel>
                    <ResourceDescription>{t(`cards.${resource?.id}.description`)}</ResourceDescription>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </CategorySection>
        )}

      </ContentContainer>


      <GradientBackground $largeScreen={largeScreen} style={{ marginBottom: 0, paddingBottom: largeScreen ? '5rem' : '4rem' }}>
      </GradientBackground>

      <NavBar style={{ padding: '4rem' }} asFooter={true} />
    </ResourcesPage>
  );
}
