/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { Layout } from 'antd';
import {/* BarsOutlined, */ LoginOutlined  } from '@ant-design/icons';

import { Link } from 'react-router-dom';
import { logout} from '../../_actions/user_action';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import MobileStyle from '../../App_mobile.module.css';

// 사용자 정보 가져오기
import { useSelector } from 'react-redux';
import Auth from '../../hoc/auth'

function header() {
    const { Header } = Layout;
    
     //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userName = getUserData === undefined ? null : getUserData.userName;
    const isAuth = getUserData === undefined ? null : getUserData.isAuth;
    
    //페이지이동
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //로그아웃 클릭
    const onLogoutHandler = (event) => {
        event.preventDefault();

        dispatch(logout())
        .then(response => {
            if(response.payload.logoutSuccess === true){
                alert("로그아웃 완료");
                navigate("/login");
            }
            else { 
                alert(response.payload.logoutSuccess);
            }
        });
    }
    
    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className={MobileStyle.mainLogo} />
            {
                isAuth === true ? <div className={MobileStyle.logoutM}>
                                    <span >{userName}님 환영합니다!  </span>
                                    
                                    <LoginOutlined key="userKsy" onClick={onLogoutHandler}>
                                        로그아웃 
                                    </LoginOutlined>
                                    </div> : ''
            }
            
            
            {/* <BarsOutlined className={MobileStyle.btnHeader} /> */}
        </Header>
    )
}

export default header