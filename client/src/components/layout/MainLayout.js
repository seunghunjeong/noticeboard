import React from 'react';
import { Layout } from 'antd';
import '../../App.css';
import { Outlet } from 'react-router-dom'; //보여져야할 화면

// components layout
import NavLayout from './nav';
import HeaderLayout from './header';
import FooterLayout from './footer';

function MainLayout() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <NavLayout />
            {/* 본문 */}
            <Layout className="site-layout">
              <HeaderLayout />
                <Outlet /> 
              <FooterLayout />
            </Layout>
        </Layout>
    )
}

export default MainLayout