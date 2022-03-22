import { Axios } from 'axios';
import React, {useState} from 'react';
import { useDispatch } from "react-redux";
import { registerUser } from '../../_actions/user_action';
import { useNavigate } from "react-router-dom";


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

    const onSubmitHandler = (event) => {   
        event.preventDefault(); //안하면 페이지가 refresh되므로 막아주려고 사용.

        console.log(Id, Password, Name);

        //password와 confirm password가 일치할때만 가입승인
        if(Password !== ConfirmPassword){
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.")
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
                alert("회원가입 성공");
                navigate("/login");
            }
            else { 
                alert(response.payload.msg);
            }
        });

    }

    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            
            <form style={{display:'flex', flexDirection:'column'}}
                  onSubmit={onSubmitHandler}>
                <label>ID</label>
                <input type="text" value={Id} placeholder="id를 입력하세요." onChange={onIdHandler}/>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler}/>

                <br/>
                <button>
                    회원가입
                </button>

            </form>

        </div>
    
    )
}

export default Join