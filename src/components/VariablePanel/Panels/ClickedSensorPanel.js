import Grid from "@mui/material/Grid";
import {
  selectClickedSensor, selectMetricData,
  selectSelectedSensors, selectSensorGeojsonData,
  selectSensorLocations, selectSensorParameter,
  setClickedSensor
} from "../../../store/slices/sensorDataSlice";
import {FaArrowLeft} from "react-icons/fa";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import {FaCheckCircle} from "react-icons/fa";
import {FaLink} from "react-icons/fa";
import {LastUpdatedDisplay} from "../LastUpdatedDisplay";
import {FaChevronCircleLeft} from "react-icons/fa";
import {FaChevronCircleRight} from "react-icons/fa";
import {SensorValueDisplay} from "../SensorValueDisplay";
import {SensorBarChart} from "../SensorBarChart";
import {getMetadata, LButton, LHeader, SensorValueLabelTooltip} from "../common";
import {useSearchParams} from "react-router-dom";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

const CopyLinkToClipboard = () => {
  const [linkCopied, setLinkCopied] = useState(false);
  const handleTooltipOpen = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
  };
  const handleTooltipClose = () => {
    setLinkCopied(false);
  };

  return(
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          open={linkCopied}
          onClose={handleTooltipClose}
          onOpen={handleTooltipOpen}
          placement={'left'}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          arrow={true}
          title={<Grid container alignItems={'center'}>
            <FaCheckCircle style={{ marginRight: '.5rem' }} />
            Link copied
          </Grid>}
          slotProps={{
            popper: {
              disablePortal: true,
            },
          }}
          slots={{ transition: Zoom }}
        >
          <LButton onClick={handleTooltipOpen}>
            <FaLink style={{ width: '15px', height: '15px' }} />
          </LButton>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}

export const ClickedSensorPanel = ({ push, pop }) => {
  const dispatch = useDispatch();
  const [, setSearchParams] = useSearchParams();

  const locations = useSelector(selectSensorLocations);
  const selectedSensors = useSelector(selectSelectedSensors);
  const clickedSensor = useSelector(selectClickedSensor);
  const selectedParameter = useSelector(selectSensorParameter);
  const metricData = useSelector(selectMetricData);
  const geojsonData = useSelector(selectSensorGeojsonData);

  // Grab our previously-fetched data to determine some stats
  // TODO: we can do better for this logic, but for now this should work alright
  const {clickedLocation, latest, firstHourlyRow, recentValueCount} = getMetadata(clickedSensor, locations, geojsonData, metricData);

  // Page backward by one, if our clicked sensor is in the list of selected sensors
  const prevSensor = () => {
    const index = selectedSensors?.indexOf(clickedSensor);
    if (index === -1) { return; }
    const newIndex = index === 0 ? selectedSensors?.length - 1 : index - 1;
    dispatch(setClickedSensor(selectedSensors[newIndex]));
  };

  // Page forward by one, if our clicked sensor is in the list of selected sensors
  const nextSensor = () => {
    const index = selectedSensors?.indexOf(clickedSensor);
    if (index === -1) { return; }
    const newIndex = index === (selectedSensors?.length - 1) ? 0 : index + 1;
    dispatch(setClickedSensor(selectedSensors[newIndex]));
  };

  return(
    <>
      <Grid container spacing={0} alignItems={'center'} marginTop={'2rem'}>
        <Grid size={2}>
          <LButton onClick={() => dispatch(setClickedSensor()) && setSearchParams({})} >
            <FaArrowLeft style={{ width: '15px', height: '15px' }} />
          </LButton>
        </Grid>

        <Grid size={8}>
          <LHeader>{clickedLocation?.name}</LHeader>
        </Grid>

        <Grid size={2} alignItems={'end'}>
          <CopyLinkToClipboard />
        </Grid>
      </Grid>

      <Grid container spacing={0} alignItems={'center'}>
        <Grid offset={2} size={7}>
          <LastUpdatedDisplay datasourceId={clickedSensor}></LastUpdatedDisplay>
        </Grid>
        <Grid size={3}>
          <LButton onClick={() => push(['Details'])}>Details &rarr;</LButton>
        </Grid>
      </Grid>

      {selectedSensors?.includes(clickedSensor) && <Grid container spacing={0} justifyContent={"space-between"}>
        <Grid size={6}>
          <LButton style={{ position: 'absolute', left: '-2rem', marginTop: '2rem', fontSize: '28px',  width: '36px', height: '36px' }}
                   onClick={() => prevSensor()}>
            <FaChevronCircleLeft style={{ border: '2px solid white', borderRadius: '100px', backgroundColor: 'white',color: 'rgba(0, 88, 153, 1)' }} />
          </LButton>
        </Grid>
        <Grid size={6}>
          <LButton style={{ position: 'absolute', right: '-2rem', marginTop: '2rem', fontSize: '28px',  width: '36px', height: '36px' }}
                   onClick={() => nextSensor()}>
            <FaChevronCircleRight style={{ border: '2px solid white', borderRadius: '100px', backgroundColor: 'white',color: 'rgba(0, 88, 153, 1)' }} />
          </LButton>
        </Grid>
      </Grid>}

      {firstHourlyRow && Object.keys(firstHourlyRow)?.length > 2 && recentValueCount > 0 && <Grid container spacing={0} alignItems={'center'}>
        <Grid offset={2} size={8}>
          <SensorValueDisplay scale={'μg/m³'} value={latest?.latest_mean_pm25}></SensorValueDisplay>
        </Grid>
        <Grid size={2} onClick={() => push(['Color Coding Air Quality'])}><SensorValueLabelTooltip /></Grid>
      </Grid>}

      <Grid container spacing={0} justifyContent={'space-between'} alignItems={'center'}>
        <Grid size={10}>
          {firstHourlyRow && Object.keys(firstHourlyRow)?.length <= 2 && <>Loading, Please Wait...</>}
          {firstHourlyRow && Object.keys(firstHourlyRow)?.length > 2 && recentValueCount === 0 && <Grid>No recent readings found.</Grid> }
        </Grid>
      </Grid>

      <Grid container alignItems={'center'}>
        <Grid offset={1} size={11}>
          {recentValueCount > 0 && <>
            <SensorBarChart pageSize={40}
                            averageType={'hour'}
                            selectedParameter={selectedParameter}
                            metricData={metricData?.filter(d => d.type === 'hour')?.map(r =>
                              ({ type: r.type, date: r.date, [selectedParameter]:  r[clickedSensor] })
                            )} />
          </>}
        </Grid>
      </Grid>
    </>
  );
}
