import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line import/no-anonymous-default-export
export default function(SpecificComponent, option, adminRoute = null) {

    // option 설명
    // null => 아무나 출입이 가능한 페이지
    // true => 로그인한 유저만 출입이 가능한 페이지
    // false => 로그인한 유저는 출입 불가능한 페이지

    function AuthenticatorAssertionCheck(props) {

        const navigate = useNavigate();
        const dispatch = useDispatch();
        const userId = localStorage.getItem("userId");

        let body = {
            userId : userId
        }
        
        useEffect(() => {

            dispatch(auth(body))
            .then(response => {
                //console.log(response);
            
                //회원가입
                if(!response.payload.isAuth && option === null){

                }
                //로그인 하지 않은 상태
                else if(!response.payload.isAuth){
                    if(option)
                    alert("로그인을 해야합니다.");
                    navigate("/login");
                }
                //로그인 한 상태 
                else { 
                    if(adminRoute && !response.payload.isAdmin){
                        navigate("/")
                    } 
                    else {
                        if(!option){
                            alert("이미 로그인한 상태입니다.");
                            navigate("/")
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