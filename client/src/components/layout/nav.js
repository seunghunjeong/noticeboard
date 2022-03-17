import { Layout, Menu, Button } from 'antd';

import { HomeOutlined, ProfileOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';

//antd 
const { Sider } = Layout;
const { SubMenu } = Menu;



function nav() {

    return (
      <Sider>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to={'/'}>Home</Link>
              </Menu.Item>
              {/* <Menu.Item key="2" icon={<TeamOutlined />}>
                Team
              </Menu.Item> */}
              <SubMenu key="sub" icon={<ProfileOutlined />} title="Board">
                <Menu.Item key="3">notice</Menu.Item>
                <Menu.Item key="4"><Link to={'/board_list/'}>project</Link></Menu.Item>
              </SubMenu>
              {/* <Menu.Item key="5" icon={<SettingOutlined />}>
                Setting
              </Menu.Item> */}
          </Menu>
          <div style={{ width : '100%', textAlign : 'center', position : 'absolute', bottom : '10px', left : '0' }}>
            <Button type="primary" danger style={{ width : '90%' }}>로그인</Button>
            <Button type="primary" danger style={{ width : '90%' }}>로그아웃</Button>
          </div>
       </Sider>
    )
}

export default nav