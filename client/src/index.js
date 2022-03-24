import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd'; //css framwork
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import Reducer from "./_reducers";
import reportWebVitals from './reportWebVitals';

const createStoreWithMiddlewear = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

ReactDOM.render(
  <Provider
    store={createStoreWithMiddlewear(Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__&& //redux_extension 설치
        window.__REDUX_DEVTOOLS_EXTENSION__()
      )}>
   
    <App />
  </Provider>
  , document.getElementById('root')
);

reportWebVitals();