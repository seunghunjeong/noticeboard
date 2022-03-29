import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// components views
import LoginPage from '../src/components/loginPage/Login';
import JoinPage from '../src/components/joinPage/Join';

import MainLayoutMobile from '../layout/MainLayout_mobile';
import HomePageMobile from '../homePage/Home_mobile';

// components layout
import {MobileView} from "react-device-detect";

const MobileViewComponent = ({children}) =>{

    return(
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
    )
}

export default MobileViewComponent;