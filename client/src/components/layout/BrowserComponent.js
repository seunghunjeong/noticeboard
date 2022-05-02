import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// components views
import BoardingListPage from '../boardingPage/Board_list';
import BoardingDetailPage from '../boardingPage/Board_detail';
import BoardingRegisterPage from '../boardingPage/Board_register';
import BoardingUpdatePage from '../boardingPage/Board_update';
import AdminSetting from '../admin/Setting_page';
import ApproveSignup from '../admin/Approve_signup';
import UserManagement from '../admin/User_management';
import LeaveCountSetting from '../admin/Leave_count_setting';
import LeaveManagement from '../mypage/LeaveManagement';

import HomePage from '../homePage/Home';
import LoginPage from '../loginPage/Login';
import JoinPage from '../joinPage/Join';
import Map from '../modules/Maps';
// components layout
import MainLayout from './MainLayout';


const BrowserComponent = () => {

    return(
        <BrowserRouter>   
            <Routes>
                <Route element = {<MainLayout/>}>
                    <Route path="/home" element = {<HomePage/>}/>
                    <Route path="/map" element = {<Map/>}/>
                    <Route path="/board_list/:category" element = {<BoardingListPage/>}/>
                    <Route path="/board_register/:category" element = {<BoardingRegisterPage/>}/>
                    <Route path="/board_detail/:idx/:category" element = {<BoardingDetailPage/>}/>
                    <Route path="/board_update/:idx/:category" element = {<BoardingUpdatePage/>}/>
                    <Route path="/mypage/leave_management" element = {<LeaveManagement/>}/>
                    <Route path="/setting/setting_page" element={<AdminSetting/>}/>
                    <Route path="/setting/approve_signup" element={<ApproveSignup/>}/>
                    <Route path="/setting/user_management" element={<UserManagement/>}/>
                    <Route path="/setting/leave_count_setting" element={<LeaveCountSetting/>}/>
                </Route>
                <Route path="/" element = {<LoginPage/>}/>
                <Route path="/sign-up" element = {<JoinPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default BrowserComponent;