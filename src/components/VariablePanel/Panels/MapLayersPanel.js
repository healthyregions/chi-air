import Grid from "@mui/material/Grid";
import {FaArrowCircleLeft} from "react-icons/fa";
import VariablesDropdown from "../VariablesDropdown";
import OverlaysDropdown from "../OverlaysDropdown";
import VariableDescriptionDisplay from "../VariableDescriptionDisplay";
//import {LButton, LHeader, SensorValueLabelTooltip, SGBody} from "../common";
import {LButton, LHeader, SGBody} from "../common";
//import Tooltip from "@mui/material/Tooltip";



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
        <LHeader>Add Community Context</LHeader>

        <SGBody style={{ margin: '0.5rem 0' }}>
          Customize your view to see how air quality intersects with
          your community. Explore different indicators, resources, and boundaries.
        </SGBody>

        

        <Grid size={9}>
          
          <LHeader style={{ fontSize: '18px' }}>Neighborhood Indicators</LHeader><br></br>

          <SGBody style={{ fontSize: '12px' }}>Choose the main measure you want to view on the map. You may only choose one.</SGBody>

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

          <LHeader style={{ fontSize: '18px' }}>Overlay Additional Resources</LHeader><br></br>

          <SGBody style={{ fontSize: '12px' }}>Add boundaries, resources, & infrastructure. 
            We recommend selecting only one option from each category, to avoid clutter.</SGBody>
          <OverlaysDropdown></OverlaysDropdown>
        </Grid>
      </Grid>}
    </Grid>
  );
}
