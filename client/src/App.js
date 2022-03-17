import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import 'antd/dist/antd';
import { Layout, Menu } from 'antd';
import { HomeOutlined, ProfileOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// components views
import BoardingPage from '../src/components/BoardingPage/Board_list';
import Board_register from './components/BoardingPage/Board_register';

function App() {
  //antd 변수
  const { Header, Footer, Sider } = Layout;
  const { SubMenu } = Menu;
  // 화면 표시부분
  return ( 
    <div> 
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="2" icon={<HomeOutlined />}>
                  <Link to={'/a'}>Home</Link>
                </Menu.Item>
                <Menu.Item key="1" icon={<ProfileOutlined />}>
                  <Link to={'/'}>Board</Link>
                </Menu.Item>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                  <Menu.Item key="6">Team 1</Menu.Item>
                  <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<SettingOutlined />}>
                  Setting
                </Menu.Item>
            </Menu>
          </Sider>
            {/* 본문 */}
            <Layout className="site-layout">
              <Header className="site-layout-background" style={{ padding: 0 }} />
              <Routes>
                  <Route exact path="/" element = {<BoardingPage/>}/>
                  <Route exact path="/board" element = {<BoardingPage/>}/>
                  <Route exact path="/Board_register" element = {<Board_register/>}/>
              </Routes>
              <Footer style={{ textAlign: 'center' }}> 게시판 이름 미정ㅎ.ㅎ ©2022 Created by Cmworld</Footer>
            </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;