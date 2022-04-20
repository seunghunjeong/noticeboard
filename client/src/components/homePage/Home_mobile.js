import React, { Fragment } from 'react'

// 사용자 정보 가져오기
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth';

// 캘랜더 가져오기
import CalenderMobile from './Calender_mobile';

function Home() {

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userId = getUserData === undefined ? null : getUserData.id;
    const userName = getUserData === undefined ? null : getUserData.userName; 
    const department = getUserData === undefined ? null : getUserData.department;
    const isAdmin = getUserData === undefined ? null : getUserData.admin;

    return (
        <Fragment>
           <CalenderMobile userData={getUserData} />
        </Fragment>
    )
}

export default Auth(Home, true)