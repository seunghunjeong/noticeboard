import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BoardingListPage from '../boardingPage/Board_list_mobile';
import BoardingDetailPage from '../boardingPage/Board_detail_mobile';
import LeaveManagement from '../mypage/LeaveManagement';

// components views
import LoginPage from '../loginPage/Login';
import JoinPage from '../joinPage/Join';

import MainLayoutMobile from '../layout/MainLayout_mobile';
import HomePageMobile from '../homePage/Home_mobile';

const MobileViewComponent = ({ children }) => {
    function setScreenSize() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      }
      useEffect(() => {
        setScreenSize();
      });

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayoutMobile />}>
                    <Route path="/home" element={<HomePageMobile />} />
                    <Route path="/board_list/:category" element={<BoardingListPage />} />
                    <Route path="/board_detail/:idx/:category" element={<BoardingDetailPage />} />
                    <Route path="/mypage/leave_management" element = {<LeaveManagement/>}/>
                </Route>
                <Route path="/" element={<LoginPage />} />
                <Route path="/sign-up" element={<JoinPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default MobileViewComponent;