import Grid from "@mui/material/Grid";
import {FaArrowCircleLeft} from "react-icons/fa";
import VariablesDropdown from "../VariablesDropdown";
import OverlaysDropdown from "../OverlaysDropdown";
import OverlaysColorLegend from "../OverlaysColorLegend";
import VariableDescriptionDisplay from "../VariableDescriptionDisplay";
import {LButton, LHeader, SensorValueLabelTooltip, SGBody} from "../common";
import Tooltip from "@mui/material/Tooltip";



export const MapLayersPanel = ({ push, pop, breadcrumbs }) => {

  // Page selector logic for navigating the panel via breadcrumbs and links
  const currentPage = breadcrumbs[breadcrumbs.length - 1];

  return (
    <Grid container spacing={0} marginTop={'1rem'}>
      <LButton as={Grid} size={1} variant={'text'} onClick={() => pop()}
               style={{ cursor: 'pointer', marginTop: '0.4rem' }}>
        <FaArrowCircleLeft style={{ width: '19px', height: '19px' }} />
      </LButton>

      {currentPage === 'Map Layers' && <Grid size={11}>
        <LHeader>Map Layers</LHeader>

        <SGBody style={{ margin: '0.5rem 0' }}>
          Customize your view to see how air quality intersects with
          your community. Use overlays and filters to explore how
          social determinants impact health outcomes in your area.
        </SGBody>

        <LHeader style={{ fontSize: '18px' }}>Overlays</LHeader>

        <Grid size={9}>
          <SGBody>
            Community context
            <Tooltip title={'Choose the main community context you want to view on the map. You may only choose one.'}>
              <SensorValueLabelTooltip />
            </Tooltip>
            {/*<Button variant={'text'} onClick={() => push(['Overlays / Community Context'])}>*/}
            {/*  <SensorValueLabelTooltip />*/}
            {/*</Button>*/}
          </SGBody>
          <VariablesDropdown></VariablesDropdown>
          <VariableDescriptionDisplay style={{ marginTop: '1.5rem' }}></VariableDescriptionDisplay>

          <br/>

          <SGBody>
            Boundaries
            <Tooltip title={'A set of composable map overlays that allow you to stack, toggle, and analyze different geographical, administrative, and infrastructural data points. These overlays generally include administrative boundaries, residential areas, and transportation networks, which can be visualized independently or together to analyze relationships between them.'}>
              <SensorValueLabelTooltip />
            </Tooltip>
            {/*<Button variant={'text'} onClick={() => push(['Overlays / Boundaries'])}>*/}
            {/*  <SensorValueLabelTooltip />*/}
            {/*</Button>*/}
          </SGBody>
          <SGBody style={{ fontSize: '12px' }}>We recommend enabling only one option from each category below</SGBody>
          <OverlaysDropdown></OverlaysDropdown>
          <OverlaysColorLegend></OverlaysColorLegend>
        </Grid>
      </Grid>}
    </Grid>
  );
}
