import { Axios } from 'axios';
import React, {useState} from 'react';
import { useDispatch } from "react-redux";
import { loginUser } from '../../_actions/user_action';
import { useNavigate } from "react-router-dom";
import Auth from '../../hoc/auth'

function LoginPage() {

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

    const onSubmitHandler = (event) => {
        event.preventDefault(); //안하면 페이지가 refresh되므로 막아주려고 사용.

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
                alert("로그인 성공");
                //sessionStorage.setItem('user_id', Id)
                navigate("/");
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
                <input type="text" value={Id} onChange={onIdHandler}/>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <br/>
                <button>
                    로그인
                </button>

            </form>

        </div>
    
    )
}

//export default Auth(LoginPage, null);
export default Auth(LoginPage, false);