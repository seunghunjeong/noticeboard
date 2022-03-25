import { Layout } from 'antd';
import '../../App.css';
import { Outlet } from 'react-router-dom'; //보여져야할 화면
import { useSelector } from 'react-redux';

// components layout
import NavLayout from './nav';
import HeaderLayout from './HeaderLayout';
import FooterLayout from './footer';


function MainLayout(props) {

    //사용자 정보 받아오기
    const userState = useSelector(state => state.user.userData);
    const isAuth = userState === undefined ? null : userState.isAuth;
    const userName = userState === undefined ? null : userState.userName;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <NavLayout />
            {/* 본문 */}
            <Layout className="site-layout">
              <HeaderLayout props={[isAuth, userName]}/>
                <Outlet /> 
              <FooterLayout />
            </Layout>
        </Layout>
    )
}

export default MainLayout