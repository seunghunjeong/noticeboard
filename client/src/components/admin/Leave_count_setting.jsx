import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import Auth from '../../_hoc/auth'

// modal 
//import ListModal from '../modals/LeaveManagementList'
import {Layout, Button, Table, message, Input} from 'antd';

// antd
const { Content } = Layout;
const Leave_count_setting = () => {

    // 렌더링을 위한 state
    const [state, setState] = useState();
    // 연차일수 변경값 
    const [leave_count_update, setLeave_count_update] = useState(null);

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
                    <Button onClick={() => {updateLeaveCount(row.id)}}>보기</Button>    
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
            console.log(res)
            if (res.data !== "err" ) {
                message.success("수정완료");
                setState(res);
            }
            else message.error("수정오류. 알맞은 값을 입력하세요.");
        })
    }

    //render
    return (
        <>
            <Content style={{ margin: '16px 16px 0 16px', height: 'calc(100% - 134px)' }}>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>연차 관리</p>
                <Table 
                    columns={columns} bordered  
                    dataSource={data}
                />
                {/* <Card style={{width : '49%', float:'left', marginLeft : 16, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'}}>
                    <p>연차사용목록</p>
                </Card>
                 */}
            </Content>
            {/* <ListModal display={userModal} close={closeModal} header={'직급부여'}>
                <Descriptions
                    bordered
                    column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                >
                    <Descriptions.Item label="이름">{manageMent.name}</Descriptions.Item>
                    <Descriptions.Item label="부서">
                        <Select placeholder={'부서선택'} onChange={departmentSelect} defaultValue={manageMent.department}>
                            <Option key={'ICT 사업부'}>ICT 사업부</Option>
                            <Option key={'연구소'}>연구소</Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="직급">
                        <Select placeholder={'직급선택'} onChange={positionSelect} defaultValue={manageMent.position}>
                            <Option key={'1,사장'}>사장</Option>
                            <Option key={'2,이사'}>이사</Option>
                            <Option key={'3,부장'}>부장</Option>
                            <Option key={'4,차장'}>차장</Option>
                            <Option key={'5,과장'}>과장</Option>
                            <Option key={'6,대리'}>대리</Option>
                            <Option key={'7,사원'}>사원</Option>
                        </Select>
                    </Descriptions.Item>
                </Descriptions>
            </ListModal> */}
        </>
    )
}

export default Auth(Leave_count_setting, true, true)