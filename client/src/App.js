import React from 'react';

// components views
import BrowserComponent from './components/layout/BrowserComponent';
import MobileComponent from './components/layout/BrowserComponent';

function App() {

  // 화면 표시부분
  return ( 
    <>
      <BrowserComponent /> 
      <MobileComponent /> 
    </>
  );
}

export default App;