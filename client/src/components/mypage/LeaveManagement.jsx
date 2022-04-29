import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth'

import moment from 'moment';
import 'moment/locale/ko'
import {Layout, Table} from 'antd';

// antd
const { Content } = Layout;

const LeaveManagement = () => {

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userId = getUserData === undefined ? null : getUserData.id;
    
    // 나의 연차 사용목록 가져오기
    const [myLeaveList, setMyLeaveList] = useState([]);
    // 잔여 연차일수
    const [leaveCount, setLeaveCount] = useState(0);

    useEffect(() => {
        Axios.post('/mypage/getMyleaveList', {id : userId})
            .then((response) => {
                
                console.log(response)
                setMyLeaveList(response.data);
        })

        // 잔여 휴가일수 가져오기
        Axios.post(('/home/getLeaveCount'), {
            userid : userId
        }).then((res) => {
            console.log(res)
            if(res.data !== undefined)
            setLeaveCount(res.data[0].leave_count);
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
            title: '종류',
            dataIndex: 'leave_type',
            key: 'leave_type',
            align: 'center'
        }
    ];

    //table rows
    const data = [];
    myLeaveList.map(element => {
        data.push({
            key : element.idx,
            date : moment(element.leave_start).format('YYYY년 MM월 DD일 dddd'),
            leave_type : element.leave_type
        });
        return data;
    });

    //render
    return (
        <>
            <Content style={{ margin: '16px 16px 0 16px', height: 'calc(100% - 134px)' }}>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>휴가사용목록</p>
                <Table 
                    columns={columns} bordered  
                    dataSource={data}
                    footer={() => '잔여휴가일수 : ' + leaveCount + "개"}
                />
            </Content>
        </>
    )
}

export default Auth(LeaveManagement, true)