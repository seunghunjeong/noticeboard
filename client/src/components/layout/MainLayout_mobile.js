import { Layout } from 'antd';
import { Outlet } from 'react-router-dom'; //보여져야할 화면
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Axios from 'axios';
// components layout
import HeaderLayout from './Header_mobile';
import FooterLayout from './footer_mobile';
import { MobileView } from "react-device-detect";
import '../../App_mobile.css';

function MainLayout() {
  
  const [state, setState] = useState('');
  const [boardCategory, setBoardCategory] = useState([]);

  useEffect(() => {
    Axios.post('/nav/getCategory')
      .then((res) => {
        setBoardCategory(res.data);
      })
  }, [state]);

  //사용자 정보 받아오기
  const userState = useSelector(state => state.user.userData);
  const admin = userState === undefined ? null : userState.admin;

    return (
      <MobileView>
        <Layout style={{ minHeight: '100vh' }}>
            {/* 본문 */}
            <Layout className="site-layout">
              <HeaderLayout props={boardCategory} admin={admin} state={state}/>
                <Outlet /> 
              <FooterLayout />
            </Layout>
        </Layout>
      </MobileView>
    )
}

export default MainLayout