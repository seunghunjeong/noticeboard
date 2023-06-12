import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import Auth from '../../_hoc/auth'

// modal 
import ListModal from '../modals/LeaveManagementList'

import moment from 'moment';
import 'moment/locale/ko'
import {Layout, Button, Table, message, Input} from 'antd';

// antd
const { Content } = Layout;

//관리자설정 -> 연차관리 페이지
const Leave_count_setting = () => {

    // 렌더링을 위한 state
    const [state, setState] = useState();
    // 연차일수 변경값 
    const [leave_count_update, setLeave_count_update] = useState("");
    // 연차사용목록 리스트
    const [usedLeaveList, setUsedLeaveList] = useState({});

    // modal상태값
    const [listModal, setListModal] = useState(false);
    const openModal = (id) => {

        //선택한 사용자의 연차사용목록 불러오기
        Axios.post('/mypage/getMyleaveList', {id : id})
        .then((res) => {
            if (res.data.message === "success") {
                if(res.data.result.length > 0 ){
                    setUsedLeaveList(res.data.result);
                    setListModal(true);
                }
            }
            else message.error("데이터를 불러오지 못했습니다.")

        })
    };
    const closeModal = () => { setListModal(false); };

    // 유저목록 불러오기
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        Axios.get('/admin/getUserList')
            .then((response) => {
                setUserList(response.data);
            })
    }, [state])


    // table columns
    const columns = [
        {
            title: '부서',
            dataIndex: 'department',
            key: 'department',
            align: 'center'
        },
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: '잔여연차일수',
            dataIndex: 'leave_count',
            key: 'leave_count',
            align: 'center',
            render: (title, row) =>
            (
                <>
                    <Input style={{width: 50, textAlign : 'right'}} defaultValue={row.leave_count} onChange = {countValue}/>
                    <Button onClick={() => {updateLeaveCount(row.id)}}>수정</Button>    
                </>
            )
        },
        {
            title: '연차사용내역보기',
            dataIndex: 'leave_count',
            key: 'leave_count',
            align: 'center',
            render: (title, row) =>
            (
                <>
                    <Button onClick={() => {openModal(row.id)}}>보기</Button>    
                </>
            )
        }
    ];

    //table rows
    const data = [];
    userList.map(element => {
        if (element.id !== 'admin' && element.status !== 'N') {
            data.push({
                key: element.id,
                id: element.id,
                name: element.username,
                department: element.department,
                leave_count : element.leave_count
            });
        }
        return data;
    });

    const countValue = e => {
        const {value} = e.target;
        setLeave_count_update(value)
        //console.log(leave_count_update)
    }

    const updateLeaveCount = (id) => {
        //연차개수 수정
        Axios.post('/home/updateLeaveCount', {
            userid: id,
            count : leave_count_update
        }).then((res) => {
            //console.log(res)
            if (res.data.message === "success" ) {
                message.success("수정완료");
                setState(res.data.result);
            }
            else message.error("수정오류. 알맞은 값을 입력하세요.");
        })
    }

    // modal table columns
    const columnsList = [
        {
            title: '날짜',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            filters: [
                {   //년도 filter값 moment로 배열만들어야함
                    text: '2023',
                    value: '2023',
                },
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
            align: 'center'
        }
    ];

    // 연차사용목록보기 클릭시 모달에 데이터 넣기
    const usedLeaveData = [];
    if(usedLeaveList.length > 0){
        //console.log(usedLeaveList)
        usedLeaveList.map(element => {
            usedLeaveData.push({
                key : element.idx,
                date : moment(element.leave_start).format('YYYY년 MM월 DD일 dddd'),
                leave_type : element.leave_type
            });
            return usedLeaveData;
        });
    
    }

    //render
    return (
        <>
            <Content style={{ margin: '16px 16px 0 16px', height: 'calc(100% - 134px)' }}>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>연차 관리</p>
                <Table 
                    columns={columns}
                    dataSource={data} 
                    bordered 
                />
            </Content>
            <ListModal display={listModal} close={closeModal} header={'사용목록'}>
                 <Table 
                    columns={columnsList} bordered  
                    dataSource={usedLeaveData}
                    size="small"
                    pagination={{position: ["bottomCenter"]}} 
                />
            </ListModal>    
        </>
    )
}

export default Auth(Leave_count_setting, true, true)