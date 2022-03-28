import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// components views
import BoardingListPage from './components/boardingPage/Board_list';
import BoardingDetailPage from './components/boardingPage/Board_detail';
import BoardingRegisterPage from './components/boardingPage/Board_register';
import BoardingUpdatePage from './components/boardingPage/Board_update';
import AdminSetting from './components/admin/Setting_page';

import HomePage from './components/homePage/Home';
import LoginPage from '../src/components/loginPage/Login';
import JoinPage from '../src/components/joinPage/Join';

// components layout
//import Nav from './components/layout/nav';
//import Header from './components/layout/header';
//import Footer from './components/layout/footer';
import MainLayout from './components/layout/MainLayout';

// components layout mobile
import MainLayoutMobile from './components/layout/MainLayout_mobile';
// divide Browser, Mobile
import {
  BrowserView,
  MobileView
} from "react-device-detect";

// mobile
import HomePageMobile from './components/homePage/Home_mobile';

function App() {

  // 화면 표시부분
  return ( 
    <div>
      <BrowserView>
        <BrowserRouter>   
            <Routes>
              <Route element = {<MainLayout/>}>
                <Route path="/" element = {<HomePage/>}/>
                <Route path="/board_list/:category" element = {<BoardingListPage/>}/>
                <Route path="/board_register/:category" element = {<BoardingRegisterPage/>}/>
                <Route path="/board_detail/:idx/:category" element = {<BoardingDetailPage/>}/>
                <Route path="/board_update/:idx/:category" element = {<BoardingUpdatePage/>}/>
                <Route path="/setting_page" element={<AdminSetting/>}/>
              </Route>
              <Route path="/login" element = {<LoginPage/>}/>
              <Route path="/sign-up" element = {<JoinPage/>}/>
            </Routes>
        </BrowserRouter>
      </BrowserView>
      <MobileView>
        <BrowserRouter>
            <Routes>
              <Route element = {<MainLayoutMobile/>}>
                <Route path="/" element = {<HomePageMobile/>}/>
              </Route>
              <Route path="/login" element = {<LoginPage/>}/>
              <Route path="/sign-up" element = {<JoinPage/>}/>
            </Routes>
        </BrowserRouter>
      </MobileView>
    </div>
  );
}

export default App;