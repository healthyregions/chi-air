import styled from 'styled-components';
import { NavBar } from '../../components';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {GradientBackground, platformName, productName, WhiteBackground} from "../VariablePanel/common";
import {useEffect, useState} from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {FaCaretDown, FaCaretRight} from "react-icons/fa";
import {SectionHeader} from "../VariablePanel/SectionHeader";
import { useTranslation, Trans } from "react-i18next";

const AboutPage = styled.div`
    background:white;
`;

const AboutBodyText = styled(Grid)`
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

const FAQTopDivider = styled.hr`
    padding: 2.75rem 0 5.375rem;
    border: 0;
    border-top: 1px solid #41B6E6;
`;

const FAQFilterRow = styled(Stack)`
    margin: 3rem 0 2.5rem;
`;

const FAQFilterChip = styled(Chip)`
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

const FAQCategorySection = styled.section`
    margin-bottom: 1rem;
`;

const FAQCategoryTitle = styled.h3`
    margin: 0 0 1rem;
    color: #444444;
    font-family: Lexend,sans-serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '24px' : '20px'};
    font-weight: 400;
    line-height: 1.2;
`;

const FAQAccordion = styled(Accordion)`
    && {
        background: transparent;
        box-shadow: none;
        border: 0;
        margin: 0;
    }

    &&:before {
        display: none;
    }

    &&.Mui-expanded {
        margin: 0;
    }
`;

const FAQAccordionSummary = styled(AccordionSummary)`
    && {
        padding: 0;
        min-height: 0;
        flex-direction: row-reverse;
        align-items: flex-start;
        gap: 0.5rem;
    }

    && .MuiAccordionSummary-content {
        margin: 0;
    }

    && .MuiAccordionSummary-content.Mui-expanded {
        margin: 0;
    }

    && .MuiAccordionSummary-expandIconWrapper {
        color: #005899;
        font-size: 18px;
        margin-top: 0.375rem;
    }
`;

const FAQAccordionDetails = styled(AccordionDetails)`
    && {
        padding: 1rem 0 1rem 1.5rem;
    }
`;

const FAQQuestion = styled.span`
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '24px' : '20px'};
    font-weight: 400;
    line-height: 1.2;
`;

const FAQAnswer = styled.div`
    max-width: 860px;
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: ${({ $largeScreen }) => $largeScreen ? '18px' : '16px'};
    font-weight: 400;
    line-height: 1.45;
`;

const ExtLink = ({ href, children }) => (
  <a href={href}
     style={{ textDecoration: 'none', color: '#005899', fontWeight: 700 }}
     target={'_blank'} rel="noreferrer noopener">
    {children}
  </a>
);

// Labels are translated at render time via `faq.categories.<id>`.
const faqCategories = [
    { id: 'protocol' },
    { id: 'data' },
    { id: 'parameters' },
    { id: 'map' }
];

// Question/answer text lives in src/locales/<lng>/about.json under `faq.items.<key>`.
// `links` are the components referenced by named tags inside the translated answer.
const faqs = [
  {
    id: 'map-data-access',
    key: 'mapDataAccess',
    category: 'data',
    links: {
      portalLink: <ExtLink href={'https://data.cityofchicago.org/Health-Human-Services/Open-Air-Chicago-Individual-Measurements/xfya-dxtq/about_data'} />,
      clarityLink: <ExtLink href={'https://map.clarity.io/open-air-chicago'} />
    }
  },
  {
    id: 'map-data-details',
    key: 'mapDataDetails',
    category: 'map'
  },
  {
    id: 'map-colors',
    key: 'mapColors',
    category: 'map',
    links: {
      aqiLink: <ExtLink href={'https://www.airnow.gov/aqi/aqi-basics/'} />
    }
  },
  {
    id: "data-use-protection",
    key: 'dataUseProtection',
    category: 'data',
    links: {
      epaLink: <ExtLink href={'https://www.epa.gov/wildfire-smoke-course/strategies-reduce-exposure-outdoors'} />
    }
  },
  {
    id: 'data-source',
    key: 'dataSource',
    category: 'data',
    links: {
      cdphLink: <ExtLink href={'https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html'} />
    }
  },
  {
    id: 'protocol-sensor-owner',
    key: 'sensorOwner',
    category: 'protocol'
  },
  {
    id: 'protocol-sensor-maintenance',
    key: 'sensorMaintenance',
    category: 'protocol'
  },
  {
    id: 'data-update-frequency',
    key: 'dataUpdateFrequency',
    category: 'data'
  },
  {
    id: 'data-raw-data',
    key: 'dataRawData',
    category: 'data',
    links: {
      portalLink: <ExtLink href={'https://data.cityofchicago.org/Health-Human-Services/Open-Air-Chicago-Individual-Measurements/xfya-dxtq/about_data'} />
    }
  },
  {
    id: 'data-quality',
    key: 'dataQuality',
    category: 'data',
    links: {
      fasmLink: <ExtLink href={'https://fire.airnow.gov/'} />,
      airnowLink: <ExtLink href={'https://www.airnow.gov/'} />
    },
    listItems: ['item1', 'item2']
  },
  {
    id: 'data-regulations',
    key: 'dataRegulations',
    category: 'data'
  },
  {
    id: 'parameters-air-quality-metrics',
    key: 'airQualityMetrics',
    category: 'parameters'
  },
  {
    id: 'parameters-ozone',
    key: 'ozone',
    category: 'parameters'
  },
  {
    id: 'parameters-black carbon',
    key: 'blackCarbon',
    category: 'parameters'
  }
];

const allFaqIds = faqs.map(({ id }) => id);

export default function About() {
    const { t } = useTranslation('about');
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedFaqIds, setExpandedFaqIds] = useState([]);
    const largeScreen = useMediaQuery('(min-width: 600px)');
    const visibleCategories = activeCategory === 'all'
      ? faqCategories
      : faqCategories.filter(({ id }) => id === activeCategory);
    const areAllFaqsExpanded = allFaqIds.every((id) => expandedFaqIds.includes(id));

    const toggleAllFaqs = () => {
      setExpandedFaqIds(areAllFaqsExpanded ? [] : allFaqIds);
    };

    const toggleFaq = (faqId, shouldExpand) => {
      setExpandedFaqIds((currentIds) => {
        const nextIds = new Set(currentIds);

        if (shouldExpand) {
          nextIds.add(faqId);
        } else {
          nextIds.delete(faqId);
        }

        return [...nextIds];
      });
    };

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
       <AboutPage>
         <NavBar />

         <WhiteBackground $largeScreen={largeScreen}>
           <ContentContainer>
             <Grid container spacing={3} justifyContent={'right'} textAlign={'right'}>
               <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '48px', fontWeight: 700, color: '#005899' }}>
                 {t('title')}
               </Grid>
             </Grid>
             <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'}>
               <AboutBodyText size={12}>
                 <Trans t={t} i18nKey="intro" values={{ productName }} components={{ b: <b /> }} />
               </AboutBodyText>
             </Grid>
           </ContentContainer>
         </WhiteBackground>

         <WhiteBackground $largeScreen={largeScreen}>
            <Grid container spacing={3} justifyContent={'center'} textAlign={'center'}>
              <div className="item"><img src="/img/sensor-calibration.jpg" alt={''} /></div>
            </Grid>
         </WhiteBackground>


         <WhiteBackground $largeScreen={largeScreen}>
           <ContentContainer>
             <Grid container spacing={3} justifyContent={'left'} textAlign={'left'}>
               <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '24px', fontWeight: 700, color: '#005899' }}>
                 {t('background.title', { platformName })}
               </Grid>
             </Grid>
             <Grid container spacing={3} justifyContent={'left'} textAlign={'left'} marginTop={'2rem'}>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 <Trans t={t} i18nKey="background.network" components={{
                   partnersLink: <ExtLink href="https://www.chicago.gov/city/en/depts/cdph/supp_info/Environment/open-air-chicago.html" />
                 }} />
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 <Trans t={t} i18nKey="background.design" components={{
                   designLink: <ExtLink href={'https://www3.epa.gov/ttnamti1/files/ambient/pm25/qa/vol2sec06.pdf'} />,
                   ciaLink: <ExtLink href="https://www.chicago.gov/city/en/depts/env/supp_info/cumulative-impact-assessment.html" />
                 }} />
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 {t('background.communityInput')}
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 <Trans t={t} i18nKey="background.leadership" components={{
                   erdalLink: <ExtLink href="https://publichealth.uic.edu/profiles/serap-erdal/" />
                 }} />
               </Grid>
             </Grid>
           </ContentContainer>
         </WhiteBackground>

         <GradientBackground $largeScreen={largeScreen} style={{ marginBottom: 0, paddingBottom: largeScreen ? '5rem' : '4rem' }}>
           <ContentContainer>
             <FAQTopDivider />
             <SectionHeader imgSrc={'/icons/chiair/aq-resources-icon.svg'}
                            topRowText={t('faq.header.top')}
                            bottomRowTextBlack={t('faq.header.bottomBlack')}
                            bottomRowTextRed={t('faq.header.bottomRed')}
                            style={{ marginBottom: '6rem' }}
                            buttonOnClick={toggleAllFaqs}
                            buttonText={areAllFaqsExpanded ? t('faq.collapseAll') : t('faq.expandAll')}
             />

             <FAQFilterRow direction="row" spacing={1} justifyContent={'flex-end'} useFlexGap flexWrap={'wrap'}>
               <FAQFilterChip
                 clickable
                 label={t('faq.categories.all')}
                 $active={activeCategory === 'all'}
                 onClick={() => setActiveCategory('all')}
               />
               {faqCategories.map(({ id }) => (
                 <FAQFilterChip
                   key={id}
                   clickable
                   label={t(`faq.categories.${id}`)}
                   $active={activeCategory === id}
                   onClick={() => setActiveCategory(id)}
                 />
               ))}
             </FAQFilterRow>

             {visibleCategories.map(({ id }) => (
               <FAQCategorySection key={id}>
                 <FAQCategoryTitle $largeScreen={largeScreen}>{t(`faq.categories.${id}`)}</FAQCategoryTitle>
                 {faqs
                   .filter((faq) => faq.category === id)
                   .map((faq) => {
                     const isExpanded = expandedFaqIds.includes(faq.id);

                     return (
                       <FAQAccordion
                         key={faq.id}
                         expanded={isExpanded}
                         onChange={(_, shouldExpand) => toggleFaq(faq.id, shouldExpand)}
                       >
                         <FAQAccordionSummary
                           expandIcon={isExpanded ? <FaCaretDown /> : <FaCaretRight />}
                         >
                           <FAQQuestion $largeScreen={largeScreen}>{t(`faq.items.${faq.key}.question`)}</FAQQuestion>
                         </FAQAccordionSummary>
                         <FAQAccordionDetails>
                           <FAQAnswer $largeScreen={largeScreen}>
                             <Trans
                               t={t}
                               i18nKey={`faq.items.${faq.key}.answer`}
                               values={{ productName }}
                               components={faq.links || {}}
                             />
                             {faq.listItems && (
                               <ul>
                                 {faq.listItems.map((item) => (
                                   <li key={item}>{t(`faq.items.${faq.key}.list.${item}`)}</li>
                                 ))}
                               </ul>
                             )}
                           </FAQAnswer>
                         </FAQAccordionDetails>
                       </FAQAccordion>
                     );
                   })}
               </FAQCategorySection>
             ))}
           </ContentContainer>
         </GradientBackground>

         <WhiteBackground  style={{ margin: 0, backgroundColor: '#41B6E633' }} >
           <ContentContainer>
             <FAQTopDivider/>
           </ContentContainer>
         </WhiteBackground>

         <GradientBackground $direction={'to top'} $largeScreen={largeScreen} style={{ marginBottom: 0, paddingBottom: largeScreen ? '5rem' : '4rem' }}>
           <ContentContainer>
             <SectionHeader imgSrc={'/icons/chiair/aq-team-collab.svg'}
                            topRowText={t('funders.header.top')}
                            bottomRowTextBlack={t('funders.header.bottomBlack')}
                            bottomRowTextRed={t('funders.header.bottomRed')}
                            style={{ marginBottom: '6rem' }}
             />

             <Grid container spacing={2} textAlign={'left'}>
               <Grid size={12} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 {t('funders.nistGrant')}
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 {t('funders.comedGrant')}
               </Grid>
               <Grid size={12} marginTop={'1rem'} style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#444444' }}>
                 {t('funders.thanks')}
                </Grid>
             </Grid>

           </ContentContainer>
         </GradientBackground>




         <NavBar style={{ padding: '4rem' }} asFooter={true} />
       </AboutPage>
    );
}
