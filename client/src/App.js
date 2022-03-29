import React from 'react';

// components views
import BrowserComponent from './components/layout/BrowserComponent';
import MobileComponent from './components/layout/BrowserComponent';

// divide Browser, Mobile
import {BrowserView, MobileView} from "react-device-detect";

function App() {

  // 화면 표시부분
  return ( 
    <>
     <BrowserView>
        <BrowserComponent /> 
     </BrowserView>
     <MobileView>
        <MobileComponent /> 
     </MobileView> 
    </>
  );
}

export default App;