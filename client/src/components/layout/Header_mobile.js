/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 사용자 정보 가져오기
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth'

// nav
import NavLayout from './Nav';

import { Layout, Avatar, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import MobileStyle from '../../App_mobile.module.css';


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
            <MenuOutlined onClick={showDrawer} /> 
            <Drawer placement="right" onClose={navClose} visible={visible} closable={false} width={'70vw'} bodyStyle={{padding:0, backgroundColor: 'rgb(0, 21, 41)'}}>
                <NavLayout props={boardCategory} admin={admin} state={ss} user={getUserData}> </NavLayout>
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
                                     <NavDrawer />
                                    </div> : 
                                    <div className={MobileStyle.logoutM}><NavDrawer /></div>
            }
        </Header>
    )
}

export default header