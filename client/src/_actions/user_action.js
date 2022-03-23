import axios from "axios";
import {
    LOGIN_USER, 
    REGISTER_USER,
    AUTH_USER,
    LOGOUT
} from "./types";

//로그인 action
export function loginUser(dataToSubmit){

    const request = axios.post('http://localhost:8000/api/login', dataToSubmit)
    .then(response => response.data)

    return {
        type : LOGIN_USER,
        payload : request
    }

}

//회원가입 action
export function registerUser(dataToSubmit){//post는 바디부분이 필요하다

    const request = axios.post('http://localhost:8000/api/sign-up', dataToSubmit)
    .then(response => response.data)

    return {
        type : REGISTER_USER,
        payload : request
    }

}

//사용자별 권한 action
export function auth(){
                                //get은 바디부분이 필요없다
    const request = axios.get('http://localhost:8000/api/auth')
    .then(response => response.data)

    return {
        type : AUTH_USER,
        payload : request
    }

}

//logout
export function logout(){
        //get은 바디부분이 필요없다
    const request = axios.get('http://localhost:8000/api/logout')
    .then(response => response.data)

    return {
    type : LOGOUT,
    payload : request
    }

}