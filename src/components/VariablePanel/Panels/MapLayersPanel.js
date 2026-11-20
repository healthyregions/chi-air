import Grid from "@mui/material/Grid";
import {FaArrowCircleLeft} from "react-icons/fa";
import VariablesDropdown from "../VariablesDropdown";
import OverlaysDropdown from "../OverlaysDropdown";
import VariableDescriptionDisplay from "../VariableDescriptionDisplay";
//import {LButton, LHeader, SensorValueLabelTooltip, SGBody} from "../common";
import {LButton, LHeader, SGBody} from "../common";
import OverlaysDescriptionDisplay from "../OverlaysDescriptionDisplay";
import {useTranslation} from "react-i18next";
//import Tooltip from "@mui/material/Tooltip";



export const MapLayersPanel = ({ push, pop, breadcrumbs }) => {

  const { t } = useTranslation('panel');

  // Page selector logic for navigating the panel via breadcrumbs and links
  const currentPage = breadcrumbs[breadcrumbs.length - 1];

  return (
    <Grid container spacing={0} marginTop={'1rem'} maxHeight={'60vh'} overflow={'auto'}>
      <Grid size={1}><LButton variant={'text'} onClick={() => pop()}
               style={{ marginLeft: '-1.25rem' }}>
        <FaArrowCircleLeft style={{ width: '19px', height: '19px' }} />
      </LButton></Grid>

      {currentPage === 'Map Layers' && <Grid size={11}>
        <LHeader>{t('mapLayers.title')}</LHeader>

        <SGBody style={{ margin: '0.5rem 0' }}>
          {t('mapLayers.intro')}
        </SGBody>



        <Grid size={9}>

          <LHeader style={{ fontSize: '18px' }}>{t('mapLayers.indicators.title')}</LHeader><br></br>

          <SGBody style={{ fontSize: '12px' }}>{t('mapLayers.indicators.help')}</SGBody>

          {/* <SGBody> */}

            {/*<Tooltip title={'Check out the legend on the left side of the map for more data details.'}>
              <SensorValueLabelTooltip />
            </Tooltip>*/}
            {/*<Button variant={'text'} onClick={() => push(['Overlays / Community Context'])}>*/}
            {/*  <SensorValueLabelTooltip />*/}
            {/*</Button>*/}
          {/* </SGBody> */}

          <VariablesDropdown></VariablesDropdown>
          <VariableDescriptionDisplay style={{ marginTop: '1.5rem' }}></VariableDescriptionDisplay>

          <br/>

          {/* <SGBody> */}
{/*             Additional Resources & Context
            <Tooltip title={'A set of composable map overlays that allow you to stack, toggle, and analyze different geographical, administrative, and infrastructural data points. These overlays generally include administrative boundaries, residential areas, and transportation networks, which can be visualized independently or together to analyze relationships between them.'}>
              <SensorValueLabelTooltip />
            </Tooltip> */}
            {/*<Button variant={'text'} onClick={() => push(['Overlays / Boundaries'])}>*/}
            {/*  <SensorValueLabelTooltip />*/}
            {/*</Button>*/}
          {/* </SGBody> */}

          <LHeader style={{ fontSize: '18px' }}>{t('mapLayers.overlays.title')}</LHeader><br></br>

          <SGBody style={{ fontSize: '12px' }}>{t('mapLayers.overlays.help')}</SGBody>
          <OverlaysDropdown></OverlaysDropdown>
          <OverlaysDescriptionDisplay style={{ marginTop: '1.5rem' }}></OverlaysDescriptionDisplay>
        </Grid>
      </Grid>}
    </Grid>
  );
}
