import React, {useState} from 'react';
import { useDispatch } from "react-redux";
import { registerUser } from '../../_actions/user_action';
import { useNavigate } from "react-router-dom";
import Auth from '../../_hoc/auth'

import { Form, Input, Button, message } from 'antd';

function Join() {

    //페이지이동
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //inform
    const [Id, setId] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [Name, setName] = useState("");

    const onIdHandler = (event) => {  
        setId(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onConfirmPasswordHandler = (event) => {   
        setConfirmPassword(event.currentTarget.value)
      }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onSubmitHandler = (value) => {   
        //event.preventDefault(); //안하면 페이지가 refresh되므로 막아주려고 사용.

        //password와 confirm password가 일치할때만 가입승인
        if(Password !== ConfirmPassword){
            return message.warning("비밀번호와 비밀번호 확인은 같아야 합니다.")
        }

        let body = {
            id : Id,
            username : Name,
            password : Password,
            comfirmPassword : ConfirmPassword
        }

        //redux를 사용함으로 axios는 사용안한다.
        //Axios.post('/api/user/register', body)
        //.then(response => {});

        dispatch(registerUser(body))
        .then(response => {
            if(response.payload.msg === "success"){
                message.success("회원가입 신청완료");
                navigate("/");
            }
            else { 
                message.error(response.payload.msg);
            }
        });

    }

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return (
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh', background:'#001529'}}>
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            //initialValues={{ remember: true }}
            onFinish={onSubmitHandler}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
          <div className='login-logo'>
              <p style={{color:'white'}}>로고자리</p>
          </div>
          <div className="signup-title" style={{fontSize : "30px", textAlign : 'center', marginBottom : "50px", color : 'white'}}>회원가입</div>
          <Form.Item
            label="아이디"
            name="ID"
            rules={[{ required: true, message: '아이디를 입력하세요!' }]}
          >
            <Input value={Id} placeholder="아이디를 입력하세요." onChange={onIdHandler} />
          </Form.Item>
          <Form.Item
            label="비밀번호"
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력하세요!' }]}
          >
            <Input.Password value={Password} onChange={onPasswordHandler}/>
          </Form.Item>

          <Form.Item
            label="비밀번호확인"
            name="confirmPassword"
            rules={[{ required: true, message: '비밀번호확인을 입력하세요!' }]}
          >
            <Input.Password value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>
          </Form.Item>
          <Form.Item
            label="사용자이름"
            name="username"
            rules={[{ required: true, message: '사용자이름을 입력하세요!' }]}
          >
            <Input placeholder="사용자이름을 입력하세요." value={Name} onChange={onNameHandler} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="dashed" href='/'> 취소</Button>
            <Button style={{marginLeft : "10px"}} type="primary" htmlType="submit">
              가입신청
            </Button>
          </Form.Item>
        </Form>
      </div>
  )
}

export default Auth(Join, null);