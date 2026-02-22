// Initialize React
import { StrictMode } from "react";
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

// Initialize Redux store
import { store } from './store';

// Initialize styles + fonts
import './index.css';
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import WebFont from 'webfontloader';

import App from './App';

WebFont.load({
  google: {
    families: ['Lexend:100,200,300,400,500,600,700,800', 'Space Grotesk:200,300,400,500,600,700,800', 'Big Shoulders:400,600', 'Lora:400,600', 'Roboto:300,500,700', 'sans-serif']
  }
});

const theme = createTheme();
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <Provider store={store}>
      <Router basename={process.env.PUBLIC_URL}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </StyledEngineProvider>
      </Router>
    </Provider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
