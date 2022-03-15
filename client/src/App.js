import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import 'antd/dist/antd';
import React from 'react';

//컴포넌트 추가
import BoardingPage from './components/views/Board_list';

function App() {

  // 화면 표시부분
  return (
    
    <BrowserRouter>

    <Routes>

      <Route exact path="/" element = {<BoardingPage/>}/>

    </Routes>

    </BrowserRouter>

  );
}

export default App;