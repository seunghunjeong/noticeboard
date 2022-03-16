import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import 'antd/dist/antd';
import { Layout} from 'antd';
import Nav from './components/layout/nav';
import Header from './components/layout/header';
import Footer from './components/layout/footer';

// components views
import BoardingPage from '../src/components/BoardingPage/Board_list';

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
                  <Route exact path="/" element = {<BoardingPage/>}/>
                  <Route exact path="/board" element = {<BoardingPage/>}/>
                  </Routes>
              <Footer />
            </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;