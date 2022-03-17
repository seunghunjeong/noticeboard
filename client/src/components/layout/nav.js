import { Layout, Menu } from 'antd';

import { HomeOutlined, ProfileOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';

const { Sider } = Layout;

const { SubMenu } = Menu;

function nav() {
    return (
      <Sider>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<HomeOutlined />}>
                  Home
                </Menu.Item>
                <Menu.Item key="2" icon={<ProfileOutlined />}>
                  Board
                </Menu.Item>
                <SubMenu key="sub" icon={<TeamOutlined />} title="Team">
                  <Menu.Item key="3">Team 1</Menu.Item>
                  <Menu.Item key="4">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="5" icon={<SettingOutlined />}>
                  Setting
                </Menu.Item>
            </Menu>
          </Sider>
    )
}

export default nav