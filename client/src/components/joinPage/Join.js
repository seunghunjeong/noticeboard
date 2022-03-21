import { Axios } from 'axios';
import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";


function Join() {

    const navigate = useNavigate();

    const [Id, setId] = useState("");
    const [Password, setPassword] = useState("");
    const [Name, setName] = useState("");

    const onIdHandler = (event) => {  
        setId(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onNameHandler = (event) => {
      setName(event.currentTarget.value)
  }

    const onSubmitHandler = (event) => {
        event.preventDefault(); //안하면 페이지가 refresh되므로 막아주려고 사용.
     
        // dispatch(loginUser(body))
        // .then(response => {
        //     if(response.payload.loginSuccess){
        //         navigate("/");
        //         //props.history.push("/") //페이지 이동
        //     }
        //     else { 
        //         alert("error");
        //     }
        // });

        Axios.post('http://localhost:8000/api/sign-up', {
            id : Id,
            password : Password,
            username: Name
        })
        .then(response => {
          console.log(response)

          if(Response.data.err){
              navigate("/");
              //props.history.push("/") //페이지 이동
          }
          else { 
              alert("error");
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