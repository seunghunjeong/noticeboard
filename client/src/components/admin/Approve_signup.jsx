import React, { useState, useEffect } from 'react'
import { Layout, Button, Table, message } from 'antd';
import Auth from '../../_hoc/auth'
import Axios from 'axios';

// modal confirm
import confirmModal from '../modals/ConfirmModal_mobile';

const Approve_signup = () => {

    // antd
    const { Content } = Layout;

    // 렌더링을 위한 state
    const [state, setState] = useState();

    // confirm param object
    let confirmParam = {
        txt : '',
        action : '',
        content : ''
    }

    // 가입대기열 불러오기
    const [stanbyList, setStanbyList] = useState([]);
    useEffect(() => {
        Axios.get('/api/getStandby_signup')
        .then((response) => {
            setStanbyList(response.data);
        })
    }, [state])
    
    // 가입수락 클릭
    const approveHandler = (event, value) => {  
        event.preventDefault();
        const userId = value;
        console.log(value);

        Axios.post('/api/approve-sign-up', {id : userId})
        .then((response) => {
            if(response.data.msg === "success"){
                message.success("가입승인완료");
                setState(response);
            }
            else{
                message.error(response.data.msg);
            }
        })
    }

    // 가입거절 클릭
    const rejectHandler = (event, value) => {
        const userId = value;
        console.log(value);

        const actionDel = () => {
            Axios.post('/api/reject-sign-up', {id : userId})
            .then((response) => {
                if(response.data.msg === "success"){
                    message.success("가입거절 완료");
                    setState(response);
                }
                else{
                    message.error(response.data.msg);
                }
            })
        }

        confirmParam.txt = '거절';
        confirmParam.action = actionDel;
        confirmParam.content = "해당 사용자는 가입승인 대기열에서 삭제됩니다.";
        confirmModal(confirmParam);
    }

    // table columns
    const columns = [
        {   
            title: '가입신청일',
            dataIndex: 'registered', 
            key: 'registered',
            align : 'center' 
        },
        {   
            title: '신청인 이름',
            dataIndex: 'name', 
            key: 'name',
            align : 'center'
        },
        {   
            title: '권한상태', 
            dataIndex: 'auth', 
            key: 'auth',
            align : 'center'
        },
        {   title: '가입승인여부', 
            dataIndex: 'status', 
            key: 'status',
            align : 'center'
        },
        {   title: '가입승인일', 
            dataIndex: 'approved', 
            key: 'approved',
            align : 'center'
        },
        {
            title: '가입승인',
            dataIndex: 'x',
            key: 'x',
            align : 'center',
            width : 300,
            render : (title, row) => 
            (  
                <>
                {row.status === 'N' ? 
                    <div>
                        <Button danger onClick={e => approveHandler(e, row.id)}>가입수락</Button>
                        <Button onClick={e => rejectHandler(e, row.id)}>가입거절</Button>
                    </div> : <Button disabled>승인완료</Button>
                } 
                </>
            )
        },
      ];
      
    //date format 수정
    let moment =  require('moment');

    //table rows
    const data = [];
    stanbyList.map(element => {
        data.push({
          key : element.id,
          id : element.id,
          name : element.username,
          auth : element.auth === 1 ? "관리자" : null,
          registered : moment(element.registered).format('YYYY-MM-DD, HH:mm:ss'),
          status : element.status,
          approved : element.approved !==null ? moment(element.approved).format('YYYY-MM-DD, HH:mm:ss') : null
        });
        return data;
    });

    //render
    return (
        <Content style={{ margin : '16px 16px 0 16px', height : 'calc(100% - 134px)' }}>
            <p style={{fontSize : "20px", fontWeight : "bold"}}>가입승인 대기열</p>
            <Table
                columns={columns}
                dataSource={data}
            />
        </Content>
    )
}

export default Auth(Approve_signup, true)