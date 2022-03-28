import { Layout } from 'antd';
import '../../App.css';
import { Outlet } from 'react-router-dom'; //보여져야할 화면
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Axios from 'axios';
// components layout
import NavLayout from './Nav';
import HeaderLayout from './HeaderLayout';
import FooterLayout from './footer';


function MainLayout(props) {

  const [state, setState] = useState('');
  const [boardCategory, setBoardCategory] = useState([]);

  useEffect(() => {
    Axios.post('http://localhost:8000/nav/getCategory')
      .then((res) => {
        setBoardCategory(res.data);
      })
  }, [state]);

  //사용자 정보 받아오기
  const userState = useSelector(state => state.user.userData);
  const isAuth = userState === undefined ? null : userState.isAuth;
  const userName = userState === undefined ? null : userState.userName;
  const admin = userState === undefined ? null : userState.admin;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <NavLayout props={[boardCategory, admin]}/>
      {/* 본문 */}
      <Layout className="site-layout">
        <HeaderLayout props={[isAuth, userName]} />
        <Outlet context={[state,setState]}/>
        <FooterLayout />
      </Layout>
    </Layout>
  )
}

export default MainLayout

