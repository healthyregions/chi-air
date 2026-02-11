import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import WebFont from 'webfontloader';

// Initialize Redux store
import { Provider } from 'react-redux';
import { store } from './store';

WebFont.load({
  google: {
    families: ['Lexend', 'Space Grotesk', 'Big Shoulders:400,600', 'Lora:400,600', 'Roboto:300,500,700', 'sans-serif']
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
		  <Router basename={process.env.PUBLIC_URL}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
