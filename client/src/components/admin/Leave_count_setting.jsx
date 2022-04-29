import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import Auth from '../../_hoc/auth'

// modal 
import ListModal from '../modals/LeaveManagementList'
import {Layout, Button, Table, message, Input,  List, Typography} from 'antd';

// antd
const { Content } = Layout;
const Leave_count_setting = () => {

    // 렌더링을 위한 state
    const [state, setState] = useState();
    // 연차일수 변경값 
    const [leave_count_update, setLeave_count_update] = useState(null);

    // modal상태값
    const [listModal, setListModal] = useState(false);
    const openModal = (id) => {
        setListModal(true);
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
        console.log(leave_count_update)
    }
    const updateLeaveCount = (id) => {
        //연차개수 수정
        Axios.post('/home/updateLeaveCount', {
            userid: id,
            count : leave_count_update
        }).then((res) => {
            if (res.data !== "err" ) {
                message.success("수정완료");
                setState(res);
            }
            else message.error("수정오류. 알맞은 값을 입력하세요.");
        })
    }
    const dataList = [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
        'Man charged over missing wedding girl.',
        'Los Angeles battles huge wildfires.',
      ];

    //render
    return (
        <>
            <Content style={{ margin: '16px 16px 0 16px', height: 'calc(100% - 134px)' }}>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>연차 관리</p>
                <Table 
                    columns={columns} bordered  
                    dataSource={data}
                />
            </Content>
            <ListModal display={listModal} close={closeModal} header={'사용목록'}>
                <List
                    header={<div>Header</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={dataList}
                    renderItem={item => (
                        <List.Item>
                        <Typography.Text mark>[ITEM]</Typography.Text> {item}
                    </List.Item>
                )}
                />
            </ListModal>    
        </>
    )
}

export default Auth(Leave_count_setting, true, true)