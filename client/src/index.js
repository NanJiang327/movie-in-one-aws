import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Router from './Router.js';

import store from './store/configureStore.js'
import 'antd/dist/antd.css'
import './styles/main.scss'


ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>
, document.getElementById('root'))
