import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth'

import moment from 'moment';
import 'moment/locale/ko'
import {Layout, Table} from 'antd';
import { CloseOutlined } from '@ant-design/icons';

// antd
const { Content } = Layout;

//마이페이지 -> 휴가사용목록 페이지
const LeaveManagement = () => {

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userId = getUserData === undefined ? null : getUserData.id;
    
    // 나의 연차 사용목록 가져오기
    const [myLeaveList, setMyLeaveList] = useState([]);
    // 잔여 연차일수
    const [leaveCount, setLeaveCount] = useState("");

    useEffect(() => {
        Axios.post('/mypage/getMyleaveList', {id : userId})
            .then((response) => {
                
                //console.log(response)
                setMyLeaveList(response.data);
        })

        // 잔여 휴가일수 가져오기
        Axios.post(('/home/getLeaveCount'), {
            id : userId
        }).then((res) => {
            if (res.data.message === "success" ) {
                if(res.data.result.length > 0 ){
                    setLeaveCount(res.data.result[0].leave_count);
                }
            }
            else {
                setLeaveCount("");
            }
        })
    }, [userId])

    // table columns
    const columns = [
        {
            title: '날짜',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            width : 500,
            filters: [
                {   //년도 filter값 moment로 배열만들어야함
                  text: '2022',
                  value: '2022',
                },
                {  
                    text: '2021',
                    value: '2021',
                }
            ],
            defaultFilteredValue : ["2022"],
            filterResetToDefaultFilteredValue : "true",
            onFilter: (value, record) => record.date.indexOf(value) === 0
        },
        {
            title: '종류',
            dataIndex: 'leave_type',
            key: 'leave_type',
            align: 'center',
            width : 500
        },
        {
            title: '비고',
            dataIndex: 'memo',
            key: 'memo',
            align: 'center'
        }
        // {
        //     title: '삭제',
        //     dataIndex: 'auth',
        //     key: 'auth',
        //     align: 'center',
        //     width: '15%',
        //     render: (title, row) => (
        //         <>
        //         {
        //             <CloseOutlined style={{ marginLeft: "4px", color: 'red' }} onClick={() => {
        //                 deleteMyleaveList(row.idx);
        //             }}/> 
        //         }
        //         </>
        //     )
        // }
    ];

    //table rows
    const data = [];
    myLeaveList.map(element => {
        data.push({
            key : element.idx,
            date : moment(element.leave_start).format('YYYY년 MM월 DD일 dddd'),
            leave_type : element.leave_type,
            memo : element.memo
        });
        return data;
    });

    // confirm param object
    let confirmParam = {
        txt : '',
        action : ''
    }

    // 나의 일정 삭제
    const deleteMyleaveList = (idx) => {
    }

    //render
    return (
        <>
            <Content style = {{ margin: '16px 16px 0 16px', height: 'calc(100% - 134px)' }}>
                <p style = {{ fontSize: "20px", fontWeight: "bold" }}>휴가사용목록</p>
                <Table 
                    columns = {columns} 
                    dataSource = {data}
                    bordered  
                    footer = {() => '잔여휴가일수 : ' + leaveCount + "개"}
                    pagination={{position: ["bottomCenter"]}} 
                />
            </Content>
        </>
    )
}

export default Auth(LeaveManagement, true)