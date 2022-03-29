import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// components views
import LoginPage from '../src/components/loginPage/Login';
import JoinPage from '../src/components/joinPage/Join';

import MainLayoutMobile from '../layout/MainLayout_mobile';
import HomePageMobile from '../homePage/Home_mobile';

const MobileViewComponent = ({children}) =>{

    return(
        <BrowserRouter>
            <Routes>
            <Route element = {<MainLayoutMobile/>}>
                <Route path="/" element = {<HomePageMobile/>}/>
            </Route>
            <Route path="/login" element = {<LoginPage/>}/>
            <Route path="/sign-up" element = {<JoinPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default MobileViewComponent;