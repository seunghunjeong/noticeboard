import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// components views
import BoardingListPage from '../boardingPage/Board_list';
import BoardingDetailPage from '../boardingPage/Board_detail';
import BoardingRegisterPage from '../boardingPage/Board_register';
import BoardingUpdatePage from '../boardingPage/Board_update';
import AdminSetting from '../admin/Setting_page';
import ApproveSignup from '../admin/Approve_signup';

import HomePage from '../homePage/Home';
import LoginPage from '../loginPage/Login';
import JoinPage from '../joinPage/Join';

// components layout
import MainLayout from './MainLayout';
// divide Browser, Mobile
import {BrowserView} from "react-device-detect";

const BrowserComponent = () => {

    return(
        <BrowserView>
            <BrowserRouter>   
                <Routes>
                <Route element = {<MainLayout/>}>
                    <Route path="/" element = {<HomePage/>}/>
                    <Route path="/board_list/:category" element = {<BoardingListPage/>}/>
                    <Route path="/board_register/:category" element = {<BoardingRegisterPage/>}/>
                    <Route path="/board_detail/:idx/:category" element = {<BoardingDetailPage/>}/>
                    <Route path="/board_update/:idx/:category" element = {<BoardingUpdatePage/>}/>
                    <Route path="/setting/setting_page" element={<AdminSetting/>}/>
                    <Route path="/setting/approve_signup" element={<ApproveSignup/>}/>
                </Route>
                <Route path="/login" element = {<LoginPage/>}/>
                <Route path="/sign-up" element = {<JoinPage/>}/>
                </Routes>
            </BrowserRouter>
        </BrowserView>
    )
}

export default BrowserComponent;