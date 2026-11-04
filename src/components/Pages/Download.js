import styled from 'styled-components';
import { NavBar } from '..';
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {GradientBackground, WhiteBackground} from "../VariablePanel/common";
import {SectionHeader} from "../VariablePanel/SectionHeader";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {FaMagnifyingGlassArrowRight} from "react-icons/fa6";
import {useSelector} from "react-redux";
import {selectSensorLocations} from "../../store/slices/sensorDataSlice";
import {Checkbox, FormControlLabel, FormLabel, ListItemText, Paper, Radio, RadioGroup, Switch} from "@mui/material";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {DateTimePicker} from "@mui/x-date-pickers";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {useState} from "react";
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

dayjs.extend(utc);
dayjs.extend(timezone);

const DownloadPage = styled.div`
    background:white;
`;

const ContentContainer = styled.div`
    max-width: 1200px; /* Standard container width */
    margin: 0 auto;    /* Centering the container */
    padding: 0 2rem;   /* Prevents text from touching edges */
    width: 100%;
    box-sizing: border-box;
`;

const DownloadBodyText = styled(Grid)`
    color: #444444;
    font-family: Space Grotesk,serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    text-align: right;
`;

const Download = () => {
  const largeScreen = useMediaQuery('(min-width: 600px)');

  const locations = useSelector(selectSensorLocations);

  const seen = new Set();
  const uniqueLocations = locations.filter(loc => {
    if (seen.has(loc.name)) {
      return false;
    }
    seen.add(loc.name);
    return true;
  });
  const sorted = [...uniqueLocations].sort((a, b) => a.name.localeCompare(b.name));

  const ALL_METRICS = ['PM2.5', 'NO2', 'AQI'];
  const ALL_SENSORS = ['Sensor-01', 'Sensor-02', 'Sensor-03', 'Sensor-04'];
  const TIME_TYPES = ['Hour', 'Day', 'Week', 'Month', 'Season', 'Year'];

  // 1. Metrics (AQI checked by default)
  const [selectedMetrics, setSelectedMetrics] = useState(['AQI']);

  // 2. Sensors/Locations (Empty => all sensors)
  const [selectedSensors, setSelectedSensors] = useState([]);

  // 3. Type (Multi-select dropdown)
  const [selectedTypes, setSelectedTypes] = useState(['Day']);

  // 4. Format (Radio buttons: GeoJSON or CSV)
  const [format, setFormat] = useState('CSV');

  // 5. Separate states for Start and End DateTimes (MUI Free DateTimePickers)
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);

  // 6. Timezone Localization toggle for America/Chicago
  const [localizeChicago, setLocalizeChicago] = useState(true);

  const toggleMetric = (metric) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const handleTypeChange = (event) => {
    const { target: { value } } = event;
    setSelectedTypes(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const effectiveSensors = selectedSensors.length === 0 ? ALL_SENSORS : selectedSensors;

    // Strict validation to ensure user doesn't pick an end date prior to start date
    if (startDateTime && endDateTime && endDateTime.isBefore(startDateTime)) {
      alert("End date/time cannot be before start date/time.");
      return;
    }

    // DST-aware transformation via Day.js plugins
    const processedStart = startDateTime
      ? localizeChicago
        ? startDateTime.tz('America/Chicago', true).format()
        : startDateTime.utc().format()
      : null;

    const processedEnd = endDateTime
      ? localizeChicago
        ? endDateTime.tz('America/Chicago', true).format()
        : endDateTime.utc().format()
      : null;

    const payload = {
      metrics: selectedMetrics,
      sensors: effectiveSensors,
      types: selectedTypes,
      format,
      dateRange: { start: processedStart, end: processedEnd },
      timezone: localizeChicago ? 'America/Chicago' : 'UTC',
    };

    console.log('Export Payload:', payload);
  };


  const scrollTo = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DownloadPage>
        <NavBar />

        <WhiteBackground $largeScreen={largeScreen}>
          <ContentContainer>
            <Grid container spacing={3} justifyContent={'right'} textAlign={'right'}>
              <Grid size={6} style={{ fontFamily: 'Lexend', fontSize: '48px', fontWeight: 700, color: '#005899' }}>
                Data
              </Grid>
            </Grid>
            <Grid container spacing={3} textAlign={'right'} marginTop={'2rem'}>
              <DownloadBodyText size={12}>
                This is the subheader for the page
              </DownloadBodyText>
            </Grid>
          </ContentContainer>
        </WhiteBackground>

        <WhiteBackground $largeScreen={largeScreen}>
          <ContentContainer>
            <hr />
            <SectionHeader imgSrc={'/icons/chiair/aq-network.svg'}
                           topRowText={'Customize your'}
                           bottomRowTextBlack={'Data'}
                           bottomRowTextRed={'Download'}
                           buttonOnClick={() => scrollTo()}
                           buttonText={'About the Format'}
                           buttonIcon={<FaMagnifyingGlassArrowRight style={{ marginLeft: '.5rem' }} />}
            />

              <Paper elevation={3} sx={{ p: 4, maxWidth: 650, mx: 'auto', my: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Air Quality Data Export
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  {/* Metrics as Chips */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                      Metrics (AQI checked by default)
                    </FormLabel>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {ALL_METRICS.map((metric) => {
                        const isSelected = selectedMetrics.includes(metric);
                        return (
                          <Chip
                            key={metric}
                            label={metric}
                            onClick={() => toggleMetric(metric)}
                            color={isSelected ? 'primary' : 'default'}
                            variant={isSelected ? 'filled' : 'outlined'}
                          />
                        );
                      })}
                    </Stack>
                  </FormControl>

                  {/* Sensors/Locations as Chips (empty => all sensors) */}
                  {/* New Multi-Select Autocomplete for 250+ Sensors */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Sensors / Locations</FormLabel>
                    <Autocomplete
                      multiple
                      id="sensor-selector"
                      options={sorted}
                      value={selectedSensors}
                      onChange={(event, newValue) => setSelectedSensors(newValue)}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      filterSelectedOptions // Hides already selected sensors from the menu dropdown
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={selectedSensors.length === 0 ? "All Sensors (Default)" : "Add sensor..."}
                        />
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            label={option.name.split(' - ')[0]} // Truncates display label slightly inside text fields
                            size="small"
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                    />
                  </FormControl>


                  {/* Granularity Type as Multiselect Dropdown */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                      Data Granularity Type
                    </FormLabel>
                    <Select
                      multiple
                      value={selectedTypes}
                      onChange={handleTypeChange}
                      renderValue={(selected) => selected.join(', ')}
                      variant={'filled'}>
                      {TIME_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          <Checkbox checked={selectedTypes.indexOf(type) > -1} />
                          <ListItemText primary={type} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Format as Radio Buttons */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                      Download Format
                    </FormLabel>
                    <RadioGroup
                      row
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                    >
                      <FormControlLabel
                        value="CSV"
                        control={<Radio />}
                        label="CSV"
                      />
                      <FormControlLabel
                        value="GeoJSON"
                        control={<Radio />}
                        label="GeoJSON"
                      />
                    </RadioGroup>
                  </FormControl>

                  {/* Community Range Strategy: Two Side-by-Side DateTimePickers */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Timeframe Filter</FormLabel>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <DateTimePicker
                        label="Start Date & Time"
                        value={startDateTime}
                        onChange={(newValue) => setStartDateTime(newValue)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                      <DateTimePicker
                        label="End Date & Time"
                        value={endDateTime}
                        onChange={(newValue) => setEndDateTime(newValue)}
                        minDateTime={startDateTime || undefined} // Prevents picking an end date prior to start date
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Stack>
                  </FormControl>

                  <Divider sx={{ my: 2 }} />

                  {/* Timezone Localization Toggle */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={localizeChicago}
                          onChange={(e) => setLocalizeChicago(e.target.checked)}
                        />
                      }
                      label="Localize downloaded data to America/Chicago timezone (handles Daylight Saving Time)"
                    />
                  </FormControl>

                  <Button type="submit" variant="contained" size="large" fullWidth>
                    Export Data
                  </Button>
                </Box>
              </Paper>

          </ContentContainer>
        </WhiteBackground>


        <GradientBackground $largeScreen={largeScreen} style={{ marginBottom: 0, paddingBottom: largeScreen ? '5rem' : '4rem' }}>
          <ContentContainer>
            <SectionHeader imgSrc={'/icons/chiair/aq-faq.svg'}
                           topRowText={'Downloaded'}
                           bottomRowTextBlack={'Data'}
                           bottomRowTextRed={'Format'}
            />

          </ContentContainer>
        </GradientBackground>

        <NavBar style={{ padding: '4rem' }} asFooter={true} />
      </DownloadPage>
    </LocalizationProvider>
  );
}

export default Download;
