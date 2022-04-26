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


function MainLayout() {

  const [state, setState] = useState('');
  const [boardCategory, setBoardCategory] = useState([]);
  const [stanbyList, setStanbyList] = useState([]);

  useEffect(() => {
    Axios.post('/nav/getCategory')
      .then((res) => {
        setBoardCategory(res.data);
      })

    Axios.get('/api/getStandby_signup')
      .then((response) => {
        setStanbyList(response.data);
      })

    // Axios.get('/api/getNewBoardCategory'), {

    // }.then((response) => {
    //   setStanbyList(response.data);
    // })
  }, [state]);

  //사용자 정보 받아오기
  const userState = useSelector(state => state.user.userData);
  const admin = userState === undefined ? null : userState.admin;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <NavLayout props={boardCategory} admin={admin} state={state}> </NavLayout>
      {/* 본문 */}
      <Layout className="site-layout">
        <HeaderLayout stanbyList={stanbyList}/>
        <Outlet context={[state, setState, boardCategory, stanbyList]} />
        <FooterLayout />
      </Layout>
    </Layout>
  )
}

export default MainLayout

