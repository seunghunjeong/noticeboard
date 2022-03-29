import { Layout, Menu } from 'antd';
import { HomeOutlined, ProfileOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function Nav(props) {

  const categoryList = props.props;
  const admin = props.admin;

  //antd 
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  let tmpUrl = '';

  // nav default tab
  const returnTab = () => {    
    const url = window.location.pathname;
      if(url !== '/') {
        tmpUrl = url.split('/');
        tmpUrl = tmpUrl[tmpUrl.length-1];
      } else {
        tmpUrl = '1';
      }
      return tmpUrl;
    }

  // nav default Sub
  const returnSub = () => {    
  const url = window.location.pathname;
    if(url !== '/') {
      tmpUrl = url.split('/');
      tmpUrl = tmpUrl[tmpUrl.length-2];
    } else {
      tmpUrl = 'board_list';
    }
    return tmpUrl;
  }



  return (
    <Sider>
      <div className="main-logo" />
      <Menu theme="dark" defaultOpenKeys={returnSub} defaultSelectedKeys={returnTab} mode="inline">
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to={'/'}>HOME</Link>
        </Menu.Item>
        <SubMenu key="board_list" icon={<ProfileOutlined />} title="Board">
          {
            categoryList.map((e) =>
              <Menu.Item key={e.category}><Link to={`/board_list/${e.category}`}>{e.category}</Link></Menu.Item>
            )
          }
        </SubMenu>
        {admin === true ? <SubMenu key="sub2" icon={<SettingOutlined />} title="Setting">
                            <Menu.Item key="approve_signup"><Link to={`/approve_signup`}>가입승인</Link></Menu.Item>   
                            <Menu.Item key="setting_page"><Link to={`/setting_page`}>게시판관리</Link></Menu.Item>   
                          </SubMenu> : null
        }

      </Menu>
    </Sider>
  )
}

export default Nav