import styled from 'styled-components';
import { NavBar } from '../../components';
import {Container, Snackbar} from "@mui/material";
import {GradientBackground, LButton, SGBody} from "../VariablePanel/common";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import {useState} from "react";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import {FaPaperPlane} from "@react-icons/all-files/fa/FaPaperPlane";
import { useTranslation } from "react-i18next";

const ContactPageContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    background:white;
    min-height:100vh;
    text-align:left;
`;

// The English `value` is what gets submitted to the Google Sheet / Slack, so it must stay English;
// only the displayed label is translated (via `key`).
const messageTypes = [
  { key: 'general', value: 'General' },
  { key: 'bugReport', value: 'Bug Report or Error' },
  { key: 'dataQuestion', value: 'Data Question' },
  { key: 'featureRequest', value: 'Feature Request' },
  { key: 'technical', value: 'Technical or Open Source Questions' },
  { key: 'press', value: 'Press or Media' },
];

const Contact = () => {
  const { t } = useTranslation('contact');
  const largeScreen = useMediaQuery('(min-width: 600px)');

  const googleFormUrl = `${process.env.REACT_APP_EMAIL_FORM_URL}`
  const slackFormUrl = `${process.env.REACT_APP_SLACK_FORM_SUBMISSION_URL}`

  // Form state
  const [formData, setFormData] = useState({
    Category: 'General',
    Contact_Name: '',
    Contact_Email: '',
    Contact_Phone: '',
    Message: ''
  });
  const handleChange = (e) => {
    const propName = e.target.name;
    const propValue = e.target.value;
    setFormData({ ...formData, [propName]: propValue });
    isValid(formData, propName, propValue);
  };

  // Success confirmation
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleClose = () => {
    setSubmitted(false);
    setSubmitting(false);
  }

  // Error state + Validation
  // formErrors holds translation keys (e.g. 'errors.nameRequired'), translated at render time.
  const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegexPattern = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const [formErrors, setFormErrors] = useState({
    Category: '',
    Contact_Name: '',
    Contact_Email: '',
    Contact_Phone: '',
    Message: ''
  });

  const isValidName = (propValue) => {
    if (!propValue) {
      setFormErrors({ ...formErrors, Contact_Name: 'errors.nameRequired' });
      return false;
    }
    setFormErrors({ ...formErrors, Contact_Name: '' });
    return true;
  }

  const isValidEmail = (propValue) => {
    if (!propValue) {
      setFormErrors({...formErrors, Contact_Email: 'errors.emailRequired'});
      return false;
    } else if (!emailRegexPattern.test(propValue)) {
      setFormErrors({...formErrors, Contact_Email: 'errors.emailInvalid'});
      return false;
    }
    setFormErrors({...formErrors, Contact_Email: ''});
    return true;
  }

  const isValidPhone = (propValue) => {
    if (!propValue) {
      // Empty is a valid case for phone (which is optional)
      setFormErrors({...formErrors, Contact_Phone: ''});
      return true;
    } else if (!phoneRegexPattern.test(propValue)) {
      setFormErrors({...formErrors, Contact_Phone: 'errors.phoneInvalid'});
      return false;
    }
    setFormErrors({...formErrors, Contact_Phone: ''});
    return true;
  }

  const isValidMessage = (propValue) => {
    if (!propValue) {
      setFormErrors({...formErrors, Message: 'errors.messageRequired'});
      return false;
    }
    setFormErrors({...formErrors, Message: ''});
    return true;
  }

  const isValid = (formState, propName, propValue) => {
    switch(propName) {
      // If no propName is provided, then we validate entire form
      default: {
        let valid = true;
        ['Contact_Name', 'Contact_Email', 'Contact_Phone', 'Message'].forEach((propName) => {
            const propValue = formState[propName];
            if (!isValid(formState, propName, propValue)) {
              valid = false;
            }
          }
        );
        return valid;
      }
      case 'Category': {
        return !!propValue;
      }
      case 'Contact_Name': {
        return isValidName(propValue);
      }
      case 'Contact_Email': {
        return isValidEmail(propValue);
      }
      case 'Contact_Phone': {
        return isValidPhone(propValue);
      }
      case 'Message': {
        return isValidMessage(propValue);
      }
    }
  }

  const generateURL = async (data, googleFormUrl) => {
    let returnURL = `${googleFormUrl}?Date=${encodeURIComponent(new Date().toISOString().slice(0,10))}`
    for (const property in data){
      returnURL += `&${encodeURIComponent(property)}=${encodeURIComponent(data[property])}`
    }
    return returnURL
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid(formData)) {
      try {
        setSubmitting(true);

        // Send feedback to Google Sheet
        const gSheetURL = await generateURL(formData, googleFormUrl);
        await fetch(gSheetURL, {method: 'GET'});

        // Send feedback notification to Slack channel
        let slackText = `Submission from ${window.location.href}`
        slackText += `\n*Name:* ${formData.Contact_Name}`
        slackText += `\n*Email:* ${formData.Contact_Email}`
        slackText += `\n*Phone:* ${formData.Contact_Phone}`
        slackText += `\n*Message Category:* ${formData.Category}`
        slackText += `\n---\n${formData.Message}`
        await fetch(slackFormUrl, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          body: JSON.stringify({text: slackText})
        });

        // Clear out the form and notify the user
        setFormData({Category: 'General', Contact_Name: '', Contact_Email: '', Message: '', Contact_Phone: ''});

        // Notify the user of success
        setSubmitted(true);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <ContactPageContent>
      <NavBar />

      <GradientBackground $largeScreen={largeScreen} style={{ maxHeight: '100vh', flexGrow: 1, marginBottom: 0 }}>
        <Container maxWidth="sm">
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={1} justifyContent={'center'} textAlign={'center'} marginTop={'2rem'}>
              <Grid size={12} style={{ fontFamily: 'Lexend', fontSize: '48px', fontWeight: 700, color: '#005899' }}>
                {t('title')}
              </Grid>
            </Grid>
            <Grid container spacing={3} textAlign={'center'} marginTop={'0.5rem'}>
              <Grid size={12}>
                <SGBody>{t('intro')}</SGBody>
              </Grid>
            </Grid>

            <FormControl fullWidth style={{ marginTop: '2rem' }}>
              <InputLabel id="message-type-select-label">{t('form.messageType')}</InputLabel>
              <Select
                variant={'filled'}
                labelId="message-type-select-label"
                id="message-type-select"
                label={t('form.messageType')}
                name="Category"
                value={formData.Category}
                //error={!!formErrors.Category}
                //helperText={formErrors.type}
                onChange={handleChange}
              >
                {messageTypes.map((type) =>
                  <MenuItem key={`select-option-${type.key}`} value={type.value}>{t(`messageTypes.${type.key}`)}</MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField label={t('form.name')} name="Contact_Name" placeholder={t('form.namePlaceholder')} error={!!formErrors.Contact_Name} helperText={formErrors.Contact_Name && t(formErrors.Contact_Name)} value={formData.Contact_Name} onChange={handleChange} required fullWidth />
            <TextField label={t('form.email')} name="Contact_Email" type="email" placeholder="greetings@you.com" error={!!formErrors.Contact_Email} helperText={formErrors.Contact_Email && t(formErrors.Contact_Email)} value={formData.Contact_Email} onChange={handleChange} required fullWidth />
            <TextField label={t('form.phone')} name="Contact_Phone" type="phone" placeholder="111-867-5309" error={!!formErrors.Contact_Phone} helperText={formErrors.Contact_Phone && t(formErrors.Contact_Phone)} value={formData.Contact_Phone} onChange={handleChange} fullWidth />
            <TextField label={t('form.message')} name="Message" placeholder={t('form.messagePlaceholder')} error={!!formErrors.Message} helperText={formErrors.Message && t(formErrors.Message)} value={formData.Message} onChange={handleChange} multiline minRows={5} maxRows={10} required fullWidth />

            <LButton type="submit" variant="outlined" loading={submitting}>{t('form.send')} <FaPaperPlane style={{ marginLeft: '0.5rem' }} /></LButton>
          </Box>

          <Snackbar
            open={submitted}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={6000}
            onClose={handleClose}
            message={t('form.sentConfirmation')}
          />
        </Container>
      </GradientBackground>
    </ContactPageContent>
  );
}

export default Contact;
