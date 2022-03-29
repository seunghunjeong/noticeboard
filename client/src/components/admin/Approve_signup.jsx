import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import { List, Layout, Button, Input, Table, Radio, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Auth from '../../hoc/auth'
import Axios from 'axios';


const Approve_signup = () => {

    // antd
    const { Content } = Layout;

    // 가입대기열 불러오기
    const [stanbyList, setStanbyList] = useState([]);
    useEffect(() => {
        Axios.get('http://localhost:8000/api/getStandby_signup')
        .then((response) => {
            setStanbyList(response.data);
        })
    },[stanbyList])
    
    //가입수락 클릭
    const approveHandler = (event, value) => {  
        event.preventDefault();
        const userId = value;

        Axios.post('http://localhost:8000/api/approve-sign-up', {id : userId})
        .then((response) => {
            if(response.data.msg === "success"){
                alert("가입승인완료");
            }
            else{
                alert(response.data.msg);
            }
        })
    }

    //가입거절 클릭
    const rejectHandler = (event, value) => {  
        event.preventDefault();
        const userId = value;
        const confirmAction = window.confirm("가입을 거절하시겠습니까? 해당 사용자는 가입승인 대기열에서 삭제됩니다.");
        
        if(confirmAction) { //yes 선택
            Axios.post('http://localhost:8000/api/reject-sign-up', {id : userId})
            .then((response) => {
                if(response.data.msg === "success"){
                    alert("가입거절 완료");
                }
                else{
                    alert(response.data.msg);
                }
            })
        }
        else {
            event.preventDefault();
        }  
    }

     //관리자지정 클릭
     const adminAppointHandler = (event, value) => {  
        event.preventDefault();
        const userId = value;
        const confirmAction = window.confirm("해당 유저를 관리자로 지정하시겠습니까?");
        
        if(confirmAction) { //yes 선택
            Axios.post('http://localhost:8000/api/admin-appoint', {id : userId})
            .then((response) => {
                if(response.data.msg === "success"){
                    alert("관리자 지정 완료");
                }
                else{
                    alert(response.data.msg);
                }
            })
        }
        else {
            event.preventDefault();
        }  
    }

    //관리자해지 클릭
    const adminRemoveHandler = (event, value) => {  
        event.preventDefault();
        const userId = value;
        const confirmAction = window.confirm("해당 관리자를 해지하시겠습니까?");
        
        if(confirmAction) { //yes 선택
            Axios.post('http://localhost:8000/api/admin-remove', {id : userId})
            .then((response) => {
                if(response.data.msg === "success"){
                    alert("관리자 해지 완료");
                }
                else{
                    alert(response.data.msg);
                }
            })
        }
        else {
            event.preventDefault();
        }  
    }

    // table columns
    const columns = [
        {   
            title: '신청인 이름',
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
        {   title: '가입승인일', 
            dataIndex: 'tmp', 
            key: 'tmp',
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
        {
            title: '권한부여',
            dataIndex: 'y',
            key: 'y',
            align : 'center',
            width : 150,
            render : (title, row) => 
            (  
                <>
                {row.status === 'N' ? <Button disabled>관리자지정</Button> : 
                                      (row.auth === "관리자" ? <Button onClick={e => adminRemoveHandler(e, row.id)}>관리자해지</Button> 
                                      : <Button onClick={e => adminAppointHandler(e, row.id)}>관리자지정</Button>)
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