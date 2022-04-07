import axios from "axios";
import {
    LOGIN_USER, 
    REGISTER_USER,
    AUTH_USER,
    LOGOUT
} from "./types";

import { message } from 'antd';

axios.defaults.withCredentials = true //세션관리를 위한 옵션

//로그인 action
export function loginUser(dataToSubmit){

    const request = axios.post('/api/login', dataToSubmit)
    .then(response => response.data)

    return {
        type : LOGIN_USER,
        payload : request
    }

}

//회원가입 action
export function registerUser(dataToSubmit){//post는 바디부분이 필요하다

    const request = axios.post('/api/standby-signup', dataToSubmit)
    .then(response => response.data)

    return {
        type : REGISTER_USER,
        payload : request
    }

}

//사용자별 권한 action
export function auth(dataToSubmit){
                              
    const request = axios.post('/api/auth', dataToSubmit)
    .then(response => response.data)

    return {
        type : AUTH_USER,
        payload : request
    }

}

//로그아웃 action
export function logout(){
                            
   

    if (sessionStorage.getItem("userId") === null){
        message.error("로그아웃 실패")
        return false;
    }
    else {
        
        sessionStorage.removeItem("userId"); 
        
        const request = axios.get('/api/logout')
        .then(response => response.data)
        
        return {
            type : LOGOUT,
            payload : request
        }
    }
  
   

}
