import React from 'react';
import ReactDOM from 'react-dom';
import App from './webpages/App'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {HashRouter} from 'react-router-dom';


// all the information regarding student info and textbook info etc will be stored in the state within app.jsx
// acts as the "controller" of all the data and other components

ReactDOM.render((
  <HashRouter >
    <App />
  </HashRouter>),
  document.getElementById('root'),
);
