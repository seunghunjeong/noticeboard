/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { Layout, Avatar, Drawer } from 'antd';
import {BarsOutlined, LoginOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';
import { logout} from '../../_actions/user_action';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import MobileStyle from '../../App_mobile.module.css';

// 사용자 정보 가져오기
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth'

// nav
import NavLayout from './Nav';

function header(props) {
    // main에서 받아온 props
    const boardCategory = props.props;
    const admin = props.admin;
    const ss = useState(props.state);

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
                navigate("/");
            }
            else { 
                alert(response.payload.logoutSuccess);
            }
        });
    }

    // nav창 열기
    const NavDrawer = () => {
        // display setState
        const [visible, setVisible] = useState(false);

        // display block
        const showDrawer = (event) => {

            event.preventDefault();

            setVisible(true);
        };
    
        // display none
        const navClose = () => {
            setVisible(false);
        };
    
        return(
        <>
            <BarsOutlined onClick={showDrawer} /> 
            <Drawer placement="right" onClose={navClose} visible={visible} closable={false} width={'70vw'} bodyStyle={{padding:0, backgroundColor: 'rgb(0, 21, 41)'}}>
                <NavLayout props={boardCategory} admin={admin} state={ss}> </NavLayout>
            </Drawer>
        </>
        );
    }


    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
             <Link to={'/home'}><div className={MobileStyle.mainLogo} /></Link>
            {
                isAuth === true ? <div className={MobileStyle.logoutM}>
                                    {/* <span >{userName}님! </span> */}
                                    <Avatar className={MobileStyle.avtHeader}
                                    style={{backgroundColor : '#EE6F57'}}
                                    >{userName.substr(0,1)}</Avatar>
                                    
                                    <LoginOutlined key="userKsy" onClick={onLogoutHandler} className={MobileStyle.btnHeader}>
                                        로그아웃 
                                    </LoginOutlined>
                                     <NavDrawer />
                                    </div> : ''
            }
        </Header>
    )
}

export default header