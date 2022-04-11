import React, { useState, useEffect } from 'react'
import { Layout, Button, Table, message } from 'antd';
import Auth from '../../_hoc/auth'
import Axios from 'axios';
import UserModal from '../modals/UserManagement'

// modal confirm
import confirmModal from '../modals/ConfirmModal_mobile';

import { Select, Descriptions } from 'antd';

const { Option } = Select;

const User_management = () => {

    // antd
    const { Content } = Layout;

    // 렌더링을 위한 state
    const [state, setState] = useState();

    // 직급부여 modal
    const [userModal, setUserModal] = useState(false);
    const openModal = (idx, d, p, n) => {
        setUserModal(true);
        setManagemanet({
            idx: idx,
            department: d,
            position: p,
            name: n
        });
    };
    const closeModal = () => { setUserModal(false); };

    // 부서 직급 정보
    const [manageMent, setManagemanet] = useState({
        department: '',
        position: '',
        idx: '',
        n: ''
    })


    // confirm param object
    let confirmParam = {
        txt: '',
        action: '',
        content: ''
    }

    // 가입대기열 불러오기
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        Axios.get('/admin/getUserList')
            .then((response) => {
                setUserList(response.data);
            })
    }, [state])

    const deleteUser = (id) => {
        const actionDelUser = () => {
            Axios.post('/admin/delete_user', { id: id })
                .then((res) => {
                    message.success("삭제완료");
                    setState(res);
                })
        }
        confirmParam.txt = '삭제'
        confirmParam.action = actionDelUser
        confirmParam.content = '해당유저를 삭제하시겠습니까?'
        confirmModal(confirmParam);
    }

    // table columns
    const columns = [
        {
            title: '가입일',
            dataIndex: 'registered',
            key: 'registered',
            align: 'center',
            width: 300
        },
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: '부서',
            dataIndex: 'department',
            key: 'department',
            align: 'center'
        },
        {
            title: '직급',
            dataIndex: 'position',
            key: 'position',
            align: 'center',
            render: (title, row) => {
                let str = row.position;
                return (
                    <>
                        <div>
                            {str = str !== null ? str.substring(2) : null}
                        </div>
                    </>
                )
            }


        },
        {
            title: '직급부여',
            dataIndex: 'y',
            key: 'y',
            align: 'center',
            render: (title, row) =>
            (
                <>
                    {
                        row.department === null ?
                            <Button onClick={() => { openModal(row.id, row.department, row.position, row.name); }}>부여</Button>
                            :
                            <Button onClick={() => {
                                openModal(row.id, row.department, row.position, row.name);
                            }}>수정</Button>
                    }
                </>
            )
        },
        {
            title: '관리자지정',
            dataIndex: 'y',
            key: 'y',
            align: 'center',
            width: 200,
            render: (title, row) =>
            (
                <>
                    {
                        row.auth === 1 ? <Button danger onClick={e => adminRemoveHandler(e, row.id)}>관리자해지</Button>
                            : <Button onClick={e => adminAppointHandler(e, row.id)}>관리자지정</Button>
                    }
                </>
            )
        },
        {
            title: '회원삭제',
            dataIndex: 'x',
            key: 'x',
            align: 'center',
            width: 150,
            render: (title, row) =>
            (
                <>
                    <div>
                        <Button danger onClick={() => { deleteUser(row.id); }}>삭제</Button>
                    </div>
                </>
            )
        },
    ];

    //date format 수정
    let moment = require('moment');

    //table rows
    const data = [];
    userList.map(element => {
        if (element.id !== 'admin') {
            data.push({
                key: element.id,
                id: element.id,
                name: element.username,
                registered: moment(element.registered).format('YYYY-MM-DD, HH:mm:ss'),
                department: element.department,
                position: element.position,
                auth: element.auth
            });
        }
        return data;
    });

    // 부서 선택
    const departmentSelect = value => {
        console.log(value);
        setManagemanet({
            ...manageMent,
            department: value
        })
        console.log(manageMent);

    }
    // 직급 선택
    const positionSelect = value => {
        console.log(value);
        setManagemanet({
            ...manageMent,
            position: value
        })
        console.log(manageMent);
    }
    // 부여 , 수정 모달 확인창 클릭
    const modalSubmit = () => {
        console.log(manageMent);

        Axios.post('/admin/insert_management', {
            department: manageMent.department,
            position: manageMent.position,
            id: manageMent.idx
        }).then(res => {
            setState(res);
            setUserModal(false);
        })

    }

    // 관리자지정 클릭
    const adminAppointHandler = (event, value) => {
        event.preventDefault();
        const userId = value;
        console.log(value);
        const actionAuth = () => {
            Axios.post('/api/admin-appoint', { id: userId })
                .then((response) => {
                    if (response.data.msg === "success") {
                        message.success("관리자 지정 완료");
                        setState(response);
                    }
                    else {
                        message.error(response.data.msg);
                    }
                })
        }

        confirmParam.txt = '지정';
        confirmParam.action = actionAuth;
        confirmParam.content = "해당 유저를 관리자로 지정하시겠습니까?";
        confirmModal(confirmParam);
    }

    // 관리자해지 클릭
    const adminRemoveHandler = (event, value) => {
        event.preventDefault();
        const userId = value;
        console.log(value);

        const actionAuthFire = () => {
            Axios.post('/api/admin-remove', { id: userId })
                .then((response) => {
                    if (response.data.msg === "success") {
                        message.success("관리자 해지 완료");
                        setState(response);
                    }
                    else {
                        message.error(response.data.msg);
                    }
                })
        }

        confirmParam.txt = '해지';
        confirmParam.action = actionAuthFire;
        confirmParam.content = "해당 관리자를 해지하시겠습니까?";
        confirmModal(confirmParam);
    }

    //render
    return (
        <>
            <Content style={{ margin: '16px 16px 0 16px', height: 'calc(100% - 134px)' }}>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>유저 관리</p>
                <Table
                    columns={columns}
                    dataSource={data}
                />
            </Content>
            <UserModal display={userModal} close={closeModal} header={'직급부여'} insert={() => { modalSubmit(); }}>
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
            </UserModal>

        </>
    )
}

export default Auth(User_management, true)