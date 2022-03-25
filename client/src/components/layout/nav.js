import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function nav() {

    //antd 
    const { Sider } = Layout;
    const { SubMenu } = Menu;

    return (
      <Sider>
          <div className="main-logo"/>
          <Menu theme="dark" defaultOpenKeys={['sub1']} mode="inline">
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to={'/'}>DailyReport</Link>
              </Menu.Item>
              <SubMenu key="sub1" icon={<ProfileOutlined />} title="Board">
                <Menu.Item key="2"><Link to={'/board_list/'}>notice</Link></Menu.Item>
                <Menu.Item key="3"><Link to={'/board_list/'}>utils</Link></Menu.Item>
                <Menu.Item key="4"><Link to={'/board_list/'}>references</Link></Menu.Item>
                <Menu.Item key="5"><Link to={'/board_list/'}>projects</Link></Menu.Item>
              </SubMenu>
              {/* <Menu.Item key="5" icon={<SettingOutlined />}>
                Setting
              </Menu.Item> */}
          </Menu>
       </Sider>
    )
}

export default nav