import { Layout } from 'antd';
import '../../App.css';
import { Outlet } from 'react-router-dom'; //보여져야할 화면
import { useSelector } from 'react-redux';

// components layout
import NavLayout from './Nav';
import HeaderLayout from './HeaderLayout';
import FooterLayout from './footer';


function MainLayout(props) {

    //사용자 정보 받아오기
    const userState = useSelector(state => state.user.userData);
    const isAuth = userState === undefined ? null : userState.isAuth;
    console.log(isAuth);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <NavLayout />
            {/* 본문 */}
            <Layout className="site-layout">
              <HeaderLayout props={isAuth}/>
                <Outlet /> 
              <FooterLayout />
            </Layout>
        </Layout>
    )
}

export default MainLayout