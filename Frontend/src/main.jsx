import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './store/store';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap your app in the Provider */}
    <Provider store={store}>
      {/* BrowserRouter should be inside Provider or outside, not App */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);