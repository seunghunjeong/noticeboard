import { Layout, Menu, Avatar, Image, message } from 'antd';
import { HomeOutlined, ProfileOutlined, SettingOutlined, BellOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isMobile } from "react-device-detect";
import MobileStyle from '../../App_mobile.module.css';
// 사용자 정보 가져오기
import { useSelector } from 'react-redux';
import { logout} from '../../_actions/user_action';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {LoginOutlined } from '@ant-design/icons';

function Nav(props) {

  const categoryList = props.props;
  const admin = props.admin;
  //사용자 정보 받아오기
  const getUserData = useSelector(state => state.user.userData);
  const userName = useSelector(state => state.user.userData.userName);

  //페이지이동
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //로그아웃 클릭
  const onLogoutHandler = (event) => {
     event.preventDefault();

     dispatch(logout())
     .then(response => {
         if(response.payload.logoutSuccess === true){
             message.success("로그아웃 완료");
             navigate("/");
         }
         else { 
             message.error(response.payload.logoutSuccess);
         }
     });
  }

  //antd 
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  
  const [state, setState] = useState();
  const ss = useState(props.state);
  let tmpUrl = '';
  let tmpSub = '';

  useEffect(() => {
    returnTab();
  }, [ss])

  const logoHome = () => {
      setState('home');
  }

  const handleClick = (e) => {
    setState(e.key);
  };

  // nav default tab
  const returnTab = () => {
    const url = window.location.pathname;
    if(url !== '/') {
      tmpUrl = url.split('/');
      tmpUrl = tmpUrl[tmpUrl.length-1];
    } else {
      tmpUrl = 'home';
    }
    tmpUrl = decodeURI(tmpUrl);
    setState(tmpUrl);
    return tmpUrl;
    }

  // nav default Sub
  const returnSub = () => {    
  const url = window.location.pathname;
    if(url !== '/') {
      tmpSub = url.split('/');
      tmpSub = tmpSub[1];
      if(tmpSub.includes('board'))
      tmpSub = 'board'
    }
    return [tmpSub];
  }

  const alert = () => {
    message.info('t');
  }

  const alert1 = () => {
    message.info('f');
  }


  // nav Component divide
  const NavDiv = () => {
    return(
      <>
      {  !isMobile ?
        <Link to={'/home'}> <div className="main-logo" onClick={logoHome}/></Link> : 
        <>
          <table style={{background:'rgb(0, 21, 41)',width:'70vw', height:'64px', color:'whitesmoke'}}>
            <tr style={{fontSize:'1.5em'}}>
              <td rowSpan={2} width={'60vw'} style={{textAlign:'center'}}>
              <Avatar src={<Image src="https://picsum.photos/200/200.jpg" />} size={'large'}/>
              </td>
               <td>
                {userName}            
                <LoginOutlined key="userKsy" onClick={onLogoutHandler} className={MobileStyle.btnHeader}>
                  로그아웃 
                </LoginOutlined>
                <span className={MobileStyle.avtNav}>
                  <BellOutlined onClick={alert} />
                  <FileDoneOutlined className={MobileStyle.avtHeader} onClick={alert1}/>
                </span>
               </td>
            </tr>
            <tr style={{fontSize:'0.7em'}}>
              <td>{getUserData.department} / {getUserData.department !== null ? getUserData.position.substr(2) : navigate("/")}</td>
            </tr>
          </table>
        </>
      }
        <Menu className='menu_nav' selectedKeys={state} onClick={handleClick} theme='dark' defaultOpenKeys={returnSub} mode="inline">
          <Menu.Item key="home" icon={<HomeOutlined />} style={{marginTop:'0px'}} >
            <Link to={'/home'}>홈</Link>
          </Menu.Item>
          <SubMenu key="board" icon={<ProfileOutlined />} title="게시판">
            {
              categoryList.map((e) =>
                <Menu.Item key={e.category}><Link to={`/board_list/${e.category}`}>{e.category}</Link></Menu.Item>
              )
            }
          </SubMenu>
          {admin === true && !isMobile ? <SubMenu key="setting" icon={<SettingOutlined />} title="설정">
                              <Menu.Item key="approve_signup"><Link to={`/setting/approve_signup`}>가입승인</Link></Menu.Item>   
                              <Menu.Item key="user_management"><Link to={`/setting/user_management`}>유저관리</Link></Menu.Item>   
                              <Menu.Item key="setting_page"><Link to={`/setting/setting_page`}>게시판관리</Link></Menu.Item>   
                            </SubMenu> : null
          }
        </Menu>
      </>
    )
  }

  return (
    <>
    { 
      isMobile ? <NavDiv /> :
      <Sider>
        <NavDiv />
      </Sider>
    }
    </>
  )
}

export default Nav