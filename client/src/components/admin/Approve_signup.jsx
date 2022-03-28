import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import { List, Layout, Button, Input, Table, Radio, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Auth from '../../hoc/auth'
import Axios from 'axios';


const Approve_signup = () => {

    // antd 변수
    const { Content } = Layout;

    // 가입대기열 불러오기
    const [stanbyList, setStanbyList] = useState([]);
    useEffect(() => {
        Axios.get('http://localhost:8000/api/getStandby_signup')
        .then((response) => {
            console.log(response)
            setStanbyList(response.data);
        })
    },[])
        
    const approveHandler = (event) =>{  

        event.preventDefault();
        // Axios.post('http://localhost:8000/api/approve-sign-up', {id : key})
        // .then((response) => {
        //     console.log(response)
        // })
    }

    const adminHandler = (event) =>{  

        event.preventDefault();
        // Axios.post('http://localhost:8000/api/approve-sign-up', {id : key})
        // .then((response) => {
        //     console.log(response)
        // })
    }

    // table columns
    const columns = [
        {   
            title: '신청자',
            dataIndex: 'name', 
            key: 'name',
            align : 'center'
        },
        {   
            title: '가입신청일',
            dataIndex: 'registered', 
            key: 'registered',
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
        {
            title: '가입승인',
            dataIndex: 'status',
            key: 'x',
            align : 'center',
            render: (id) => <Button onClick={approveHandler}>가입승인</Button>
        },
        {
            title: '권한부여',
            dataIndex: 'auth',
            key: 'y',
            align : 'center',
            render: (id) => <Button onClick={adminHandler}>관리자지정</Button>
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
          auth : element.auth,
          registered : moment(element.regist_date).format('YYYY-MM-DD'),
          status : element.status
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