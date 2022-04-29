import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth'

import moment from 'moment';
import 'moment/locale/ko'
import {Layout, Button, Table, message, Input, Card} from 'antd';

// antd
const { Content } = Layout;

const LeaveManagement = () => {

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userId = getUserData === undefined ? null : getUserData.id;
    
    // 나의 연차 사용목록 가져오기
    const [myLeaveList, setMyLeaveList] = useState([]);

    useEffect(() => {
        Axios.post('/mypage/getMyleaveList', {id : userId})
            .then((response) => {
                
                console.log(response)
                setMyLeaveList(response.data);
            })
    }, [userId])

    // table columns
    const columns = [
        {
            title: '날짜',
            dataIndex: 'date',
            key: 'date',
            align: 'center'
        },
        {
            title: '연차종류',
            dataIndex: 'leave_type',
            key: 'leave_type',
            align: 'center'
        }
    ];

    //table rows
    const data = [];
    myLeaveList.map(element => {
        data.push({
            key : element.userid,
            date : moment(element.leave_start).day(1).format('YYYY년 MM월 DD일 dddd'),
            leave_type : element.leave_type
        });
        return data;
    });

    //render
    return (
        <>
            <Content style={{ margin: '16px 16px 0 16px', height: 'calc(100% - 134px)' }}>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>연차사용목록</p>
                <Table 
                    columns={columns} bordered  
                    dataSource={data}
                />
            </Content>
        </>
    )
}

export default Auth(LeaveManagement, true, true)