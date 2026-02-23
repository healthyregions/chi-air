import Grid from "@mui/material/Grid";
import {FaArrowCircleLeft} from "@react-icons/all-files/fa/FaArrowCircleLeft";
import VariablesDropdown from "../VariablesDropdown";
import OverlaysDropdown from "../OverlaysDropdown";
import OverlaysColorLegend from "../OverlaysColorLegend";
import {Button} from "@mui/material";
import VariableDescriptionDisplay from "../VariableDescriptionDisplay";
import {LButton, LHeader, LinkText, SensorValueLabelTooltip, SGBody} from "../common";



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
            <Button variant={'text'} onClick={() => push(['Overlays / Community Context'])}>
              <SensorValueLabelTooltip />
            </Button>
          </SGBody>
          <VariablesDropdown></VariablesDropdown>

          <SGBody>
            Boundaries
            <Button variant={'text'} onClick={() => push(['Overlays / Boundaries'])}>
              <SensorValueLabelTooltip />
            </Button>
          </SGBody>
          <OverlaysDropdown></OverlaysDropdown>
          <OverlaysColorLegend></OverlaysColorLegend>
        </Grid>
      </Grid>}


      {currentPage === 'Overlays / Community Context' && <Grid size={11}>
        <LHeader><LinkText onClick={() => pop('Map Layers')}>Map Layers</LinkText> / Overlays / Community Context</LHeader>
        <SGBody>
          <VariablesDropdown></VariablesDropdown>
          <VariableDescriptionDisplay style={{ marginTop: '1.5rem' }}></VariableDescriptionDisplay>
        </SGBody>
      </Grid>}

      {currentPage === 'Overlays / Boundaries' && <Grid size={11}>
        <LHeader><LinkText onClick={() => pop('Map Layers')}>Map Layers</LinkText> / Overlays / Boundaries</LHeader>
        <SGBody>
          <OverlaysDropdown></OverlaysDropdown>
          <OverlaysColorLegend></OverlaysColorLegend>
          <div style={{ marginTop: '1.5rem' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </SGBody>
      </Grid>}
    </Grid>
  );
}
