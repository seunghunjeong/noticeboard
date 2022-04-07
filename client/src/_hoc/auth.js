import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'
import { useNavigate } from "react-router-dom";

import { message } from 'antd';

// eslint-disable-next-line import/no-anonymous-default-export
export default function(SpecificComponent, option, adminRoute = null) {

    // option 설명
    // null => 아무나 출입이 가능한 페이지
    // true => 로그인한 유저만 출입이 가능한 페이지
    // false => 로그인한 유저는 출입 불가능한 페이지

    function AuthenticatorAssertionCheck(props) {

        const navigate = useNavigate();
        const dispatch = useDispatch();
        const userId = sessionStorage.getItem("userId");

        let body = {
            userId : userId
        }
        
        useEffect(() => {

            dispatch(auth(body))
            .then(response => {
                //로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    //로그인한 유저만 출입이 가능한 페이지
                    if(option){
                        message.warning("로그인을 해야합니다.");
                        navigate("/");
                    }
                    //아무나출입
                    else{
                        
                    }
                }
                //로그인 한 상태 
                else { 
                    //로그인한 유저는 출입 불가능한 페이지
                    if(!option && option !== null){
                        message.warning("이미 로그인한 상태입니다.");
                        navigate("/home")
                    }
                    //로그인한 유저만 
                    else{
                        //관리자페이지
                        if(adminRoute && !response.payload.isAdmin){
                            navigate("/home")
                        } 
                     }
                }
            })           
        }, []) //[] 한번만호출

        return (
            <SpecificComponent/>
        )

    }
    
    
    return AuthenticatorAssertionCheck
}