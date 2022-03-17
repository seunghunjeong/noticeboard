import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import 'antd/dist/antd';
import { Layout, Menu } from 'antd';
import { HomeOutlined, ProfileOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// components views
import BoardingListPage from '../src/components/BoardingPage/Board_list';
import BoardingDetailPage from '../src/components/BoardingPage/Board_detail';
import BoardingRegisterPage from '../src/components/BoardingPage/Board_register';

// components layout
import Nav from './components/layout/nav';
import Header from './components/layout/header';
import Footer from './components/layout/footer';

function App() {
  // 화면 표시부분
  return ( 
    <div> 
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <Nav />
          {/* 본문 */}
          <Layout className="site-layout">
            <Header />
            <Routes>
                <Route exact path="/" element = {<BoardingListPage/>}/>
                <Route exact path="/board_list" element = {<BoardingListPage/>}/>
                <Route exact path="/board_register" element = {<BoardingRegisterPage/>}/>
                <Route exact path="/board_detail/:id" element = {<BoardingDetailPage/>}/>
            </Routes>
            <Footer />
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;