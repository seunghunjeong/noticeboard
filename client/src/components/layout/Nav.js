import { Layout, Menu } from 'antd';
import { HomeOutlined, ProfileOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isMobile } from "react-device-detect";

function Nav(props) {

  const categoryList = props.props;
  const admin = props.admin;
  

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

  // nav Component divide
  const NavDiv = () => {
    return(
      <>
      {  !isMobile ?
        <Link to={'/home'}> <div className="main-logo" onClick={logoHome}/></Link> : null
      }
        <Menu className='menu_nav' selectedKeys={state} onClick={handleClick} theme='dark' defaultOpenKeys={returnSub} mode="inline">
          <Menu.Item key="home" icon={<HomeOutlined />}>
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