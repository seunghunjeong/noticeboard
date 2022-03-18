import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// components views
import BoardingListPage from './components/boardingPage/Board_list';
import BoardingDetailPage from './components/boardingPage/Board_detail';
import BoardingRegisterPage from './components/boardingPage/Board_register';
import BoardingUpdatePage from './components/boardingPage/Board_update';

import HomePage from './components/homePage/Home';
import LoginPage from '../src/components/loginPage/Login';

// components layout
//import Nav from './components/layout/nav';
//import Header from './components/layout/header';
//import Footer from './components/layout/footer';
import MainLayout from './components/layout/MainLayout';

function App() {
  // 화면 표시부분
  return ( 
    <div> 
      <BrowserRouter>   
          <Routes>
            <Route element = {<MainLayout/>}>
              <Route path="/" element = {<HomePage/>}/>
              <Route path="/board_list" element = {<BoardingListPage/>}/>
              <Route path="/board_register" element = {<BoardingRegisterPage/>}/>
              <Route path="/board_detail/:idx" element = {<BoardingDetailPage/>}/>
              <Route path="/board_update/:idx" element = {<BoardingUpdatePage/>}/>
            </Route>
            <Route path="/login" element = {<LoginPage/>}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;