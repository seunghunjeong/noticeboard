import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import Auth from '../../_hoc/auth'

import { Layout, Button, Table, message, Input } from 'antd';

// antd
const { Content } = Layout;

const Leave_count_setting = () => {

    // 렌더링을 위한 state
    const [state, setState] = useState();
    // 연차일수 변경값 
    const [leave_count_update, setLeave_count_update] = useState(0);

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
            dataIndex: 'y',
            key: 'y',
            align: 'center',
            render: (title, row) =>
            (
                <>
                    <Input style={{width: 50, textAlign : 'right'}} value = {row.leave_count} onChange = {countValue}/>
                    <Button onClick={() => {updateLeaveCount(row.id)}}>수정</Button>    
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

    const countValue = value => {
        setLeave_count_update(value)
    }
    const updateLeaveCount = (id) => {
        //연차개수 수정
        Axios.post('/home/updateLeaveCount', {
            userid: id,
            count : leave_count_update
        }).then((res) => {
            if (res.status === 200) {
                message.success("수정완료");
                setState(res);
            }
            else message.error("수정오류");
        })
    }

    //render
    return (
        <>
            <Content style={{ margin: '16px 16px 0 16px', height: 'calc(100% - 134px)' }}>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>연차 관리</p>
                <Table
                    columns={columns}
                    dataSource={data}
                />
            </Content>
        </>
    )
}

export default Auth(Leave_count_setting, true, true)