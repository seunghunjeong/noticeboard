/* eslint-disable jsx-a11y/alt-text */
import React, {useEffect, useState} from 'react';
import { useDispatch } from "react-redux";
import { loginUser } from '../../_actions/user_action';
import { useNavigate } from "react-router-dom";
import Auth from '../../_hoc/auth'

import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useCookies } from 'react-cookie';
import crypto from 'crypto-js';

function Login() {

    const [ isRemember, setIsRemember ] = useState(false);
    const [ cookies, setCookie, removeCookie ] = useCookies(['rememberId','rememberPassword']);

    //페이지이동
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //inform
    const [Id, setId] = useState("");
    const [Password, setPassword] = useState("");

    useEffect(()=>{
        if(cookies.rememberId !== undefined && cookies.rememberPassword !== undefined ){
            let bytes = crypto.AES.decrypt(cookies.rememberPassword, 'cookiePassword');
            let rememberPassword = bytes.toString(crypto.enc.Utf8);
            setId(cookies.rememberId);
            setPassword(rememberPassword)
            setIsRemember(true);
        }
    },[]);


    const onIdHandler = (event) => {  
        setId(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (value) => {
        //event.preventDefault(); //안하면 페이지가 refresh되므로 막아주려고 사용.

        if(isRemember){
            setCookie('rememberId', Id , {maxAge:30000000});
            setCookie('rememberPassword', crypto.AES.encrypt(Password, 'cookiePassword').toString() , {maxAge:30000000});
        } else {
            removeCookie('rememberId');
            removeCookie('rememberPassword');
        }

        let body = {
            id : Id,
            password : Password
        }
       
        //redux를 사용함으로 axios는 사용안한다.
        //Axios.post('/api/user/register', body)
        //.then(response => {});

        dispatch(loginUser(body))
        .then(response => {
            if(response.payload.loginSuccess === true){
                //const accessToken = response.payload.accessToken;
                // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
		        //axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                const userId = response.payload.userId
                sessionStorage.setItem("userId", userId);
                navigate("/home");
            }
            else { 
                message.error(response.payload.msg);
            }
        });
    
    }

    const handleOnChange = (e) => {
        setIsRemember(e.target.checked);
    }

    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh', background: '#001529', color: '#fff'}}>
            <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onSubmitHandler}>
                <div className='login-logo' style={{marginBottom : "50px"}}>
                    <p style={{color:'white'}}>로고자리</p>
                </div>
                {/* <div className="login-title" style={{fontSize : "30px", textAlign : 'center', marginBottom : "20px", color : 'white'}}>LOGIN</div> */}
                <Form.Item rules={[{ required: true, message: '아이디를 입력하세요.'}]} initialValue={{id : Id}}> 
                    <Input name='id' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="ID" value={Id} onChange={onIdHandler}/>
                </Form.Item>
                <Form.Item rules={[{ required: true, message: '비밀번호를 입력하세요.'}]} initialValue={{remPw : Password}}>
                    <Input name='remPw' prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" value={Password} onChange={onPasswordHandler}/>
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" noStyle>
                        <Checkbox style={{color : 'white'}} onChange={handleOnChange} checked={isRemember}>아이디/비밀번호 저장</Checkbox>
                    </Form.Item>
                        {/* <Link to={'/sign-up'} className="login-form-forgot"> 비밀번호찾기(임시)</Link> */}
                </Form.Item>
                <Form.Item style={{textAlign : "center"}}>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{marginRight : "10px"}}>
                        로그인
                    </Button>
                    <Button type="dashed" href='/sign-up'> 회원가입</Button>
                </Form.Item>
            </Form>
        
        </div>
    )
}

//export default Auth(LoginPage, null);
export default Auth(Login, false);