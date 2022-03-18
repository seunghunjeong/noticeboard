import React from 'react'
import Axios from 'axios';
import 'antd/dist/antd.less';
import '../../App.css';
import { Card, Layout, Calendar, Badge, Button, Tag, Tabs } from 'antd';
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, Link, useParams  } from "react-router-dom"
import ReactHtmlParser from 'react-html-parser';

function onPanelChange(value, mode) {
    console.log(value.format('YYYY-MM-DD'), mode);
}
  
function Home() {
    // antd 
    const { Content } = Layout;
    const { TabPane } = Tabs;

    return (
        
            <Calendar style={{ margin : '16px 16px 0 16px', height : 'calc(100% - 134px)' }} fullscreen={true} onPanelChange={onPanelChange} />
       
 
  )
}

export default Home