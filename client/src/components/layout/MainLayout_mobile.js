import { Layout } from 'antd';
import '../../App.css';
import { Outlet } from 'react-router-dom'; //보여져야할 화면

// components layout
import HeaderLayout from './header_mobile';
import FooterLayout from './footer';
import { MobileView } from "react-device-detect";


function MainLayout() {
    return (
      <MobileView>
        <Layout style={{ minHeight: '100vh' }}>
            {/* 본문 */}
            <Layout className="site-layout">
              <HeaderLayout />
                <Outlet /> 
              <FooterLayout />
            </Layout>
        </Layout>
      </MobileView>
    )
}

export default MainLayout