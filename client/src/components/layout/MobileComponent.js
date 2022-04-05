import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BoardingListPage from '../boardingPage/Board_list';
import BoardingDetailPage from '../boardingPage/Board_detail';

// components views
import LoginPage from '../loginPage/Login';
import JoinPage from '../joinPage/Join';

import MainLayoutMobile from '../layout/MainLayout_mobile';
import HomePageMobile from '../homePage/Home_mobile';

const MobileViewComponent = ({children}) =>{

    return(
        <BrowserRouter>
            <Routes>
            <Route element = {<MainLayoutMobile/>}>
            <Route path="/home" element = {<HomePageMobile/>}/>
            </Route>
            <Route path="/" element = {<LoginPage/>}/>
            <Route path="/sign-up" element = {<JoinPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default MobileViewComponent;