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
    Axios.post('/nav/getCategory')
      .then((res) => {
        setBoardCategory(res.data);
      })
  }, [state]);

  //사용자 정보 받아오기
  const userState = useSelector(state => state.user.userData);
  const admin = userState === undefined ? null : userState.admin;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <NavLayout props={boardCategory} admin = {admin}/>
      {/* 본문 */}
      <Layout className="site-layout">
        <HeaderLayout />
        <Outlet context={[state, setState, boardCategory]}/>
        <FooterLayout />
      </Layout>
    </Layout>
  )
}

export default MainLayout

