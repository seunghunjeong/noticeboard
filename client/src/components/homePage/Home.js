import React from 'react'
import Axios from 'axios';
import 'antd/dist/antd.less';
import '../../App.css';
import { Card, Layout, Calendar, Badge, Button, Tag, Tabs } from 'antd';
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, Link, useParams } from "react-router-dom"
import ReactHtmlParser from 'react-html-parser';

function onPanelChange(value, mode) {
    console.log(value.format('YYYY-MM-DD'), mode);
}

function Home() {
    // antd 
    const { Content } = Layout;
    const { TabPane } = Tabs;


    function getListData(value) {
        let listData;
        let i = 1
        let content = "test";
        let type = "success";
        let index = [1, 2];
        switch (value.date()) {
            case i:
                listData = [
                    { index: index[0], type: type, content: content },
                    { index: index[1], type: type, content: content },
                ];
                break;

            default:
        }
        return listData || [];
    }

    function dateCellRender(value) {
        const listData = getListData(value);
        //console.log(value);
        return (
            <ul className="events">
                <Button className="bogo">+</Button>
                {listData.map(item => (
                    <li key={item.index}>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    }

    function getMonthData(value) {
        if (value.month() === 5) {
            return 1394;
        }
    }

    function monthCellRender(value) {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    }



    return (

        <Calendar style={
            {
                margin: '16px 16px 0 16px',
                height: 'calc(100% - 134px)'
            }
        }
        fullscreen={true} 
        onPanelChange={onPanelChange}
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
        onClick={() => {
            console.log("click!");
        }}/>


    )
}

export default Home