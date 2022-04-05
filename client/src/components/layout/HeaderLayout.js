import React from 'react';
import { Layout, Button } from 'antd';
import '../../App.css';
import { Link } from 'react-router-dom';
import { logout} from '../../_actions/user_action';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// 사용자 정보 가져오기
import { useSelector } from 'react-redux';


function HeaderLayout() {
    
    //antd 
    const { Header } = Layout;

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userName = getUserData === undefined ? null : getUserData.userName;
    const isAuth = getUserData === undefined ? null : getUserData.isAuth;

    //페이지이동
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //로그아웃 클릭
    const onLogoutHandler = (event) => {
        event.preventDefault();

        dispatch(logout())
        .then(response => {
            if(response.payload.logoutSuccess === true){
                alert("로그아웃 완료");
                navigate("/");
            }
            else { 
                alert(response.payload.logoutSuccess);
            }
        });
    }

    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            {/* <div className="main-logo"/> */}
          
            {
                isAuth === true ?  <div>
                                        <Button type="primary" danger style={{ width : '150px', float : "right", margin : "15px 20px" }}
                                            onClick={onLogoutHandler}>
                                            로그아웃 
                                        </Button>
                                        <span  style={{color : "white", float : "right"}}>{userName}님 환영합니다!</span>
                                    </div> : null
            }
            {
                isAuth === false || isAuth === null ? <div>
                                        <Button type="primary" danger style={{ width : '150px', float : "right", margin : "15px 20px" }}>
                                            <Link to={'/'}>로그인</Link>
                                        </Button>
                                        <span  style={{color : "white", float : "right"}}>로그인을 해주세요.</span>
                                    </div> : null 
            }
        </Header>
    )
}

export default HeaderLayout