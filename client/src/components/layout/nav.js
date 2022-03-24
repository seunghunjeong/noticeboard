import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function nav() {

    //antd 
    const { Sider } = Layout;
    const { SubMenu } = Menu;

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
       </Sider>
    )
}

export default nav