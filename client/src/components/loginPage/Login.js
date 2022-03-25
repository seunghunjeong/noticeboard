import React, {useState} from 'react';
import { useDispatch } from "react-redux";
import { loginUser } from '../../_actions/user_action';
import { useNavigate } from "react-router-dom";
import Auth from '../../hoc/auth'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from "axios";

function Login() {

    //antd

    //페이지이동
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //inform
    const [Id, setId] = useState("");
    const [Password, setPassword] = useState("");

    const onIdHandler = (event) => {  
        setId(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (value) => {
        //event.preventDefault(); //안하면 페이지가 refresh되므로 막아주려고 사용.

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
                const accessToken = response.payload.accessToken;
                console.log(accessToken);

                // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
		        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
               
                navigate("/");
            }
            else { 
                alert(response.payload.msg);
            }
        });
    
    }

    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
        
            <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onSubmitHandler}>
                <Form.Item name="username" rules={[{ required: true, message: '아이디를 입력하세요.'}]}>
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="ID" value={Id} onChange={onIdHandler}/>
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '비밀번호를 입력하세요.'}]}>
                    <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" value={Password} onChange={onPasswordHandler}/>
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>아이디/비밀번호 저장</Checkbox>
                    </Form.Item>
                        <Link to={'/sign-up'} className="login-form-forgot"> 비밀번호찾기(임시)</Link>
                    </Form.Item>
                    <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{marginRight : "10px"}}>
                        로그인
                    </Button>
                        Or <Link to={'/sign-up'}>회원가입</Link>
                </Form.Item>
            </Form>
        
        </div>
    )
}

//export default Auth(LoginPage, null);
export default Auth(Login, false);