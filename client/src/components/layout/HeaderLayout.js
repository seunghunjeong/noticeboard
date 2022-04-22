import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../_actions/user_action';
import { useDispatch, useSelector  } from "react-redux";
import { Layout, Button, message, Avatar, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import '../../App.css';

function HeaderLayout(props) {

    //antd 
    const { Header } = Layout;
    const { stanbyList } = props;
    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userName = getUserData === undefined ? null : getUserData.userName;
    const isAuth = getUserData === undefined ? null : getUserData.isAuth;
    const isAdmin = getUserData === undefined ? null : getUserData.admin;

    //페이지이동
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //로그아웃 클릭
    const onLogoutHandler = (event) => {
        event.preventDefault();

        dispatch(logout())
            .then(response => {
                if (response.payload.logoutSuccess === true) {
                    message.success("로그아웃 완료");
                    navigate("/");
                }
                else {
                    message.error(response.payload.logoutSuccess);
                }
            });
    }

    const dot = stanbyList.filter(i => i.status === 'N').length === 0 ? false : true;

    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            {/* <div className="main-logo"/> */}

            {
                isAuth === true ? <div>
                    <Button type="primary" danger style={{ width: '150px', float: "right", margin: "15px 20px" }}
                        onClick={onLogoutHandler}>
                        로그아웃
                    </Button>
                    <span style={{ color: "white", float: "right" }}>
                        {
                            isAdmin?
                                <Badge dot={dot}>
                                    <Avatar onClick={()=>{if(dot)navigate('/setting/approve_signup')}} style={{ background: 'none', cursor:'pointer' }} shape="square" icon={<BellOutlined />} />
                                </Badge>
                                :
                                null
                        }
                        {userName}님 환영합니다!
                    </span>
                </div> : null
            }
            {
                isAuth === false || isAuth === null ? <div>
                    <Button type="primary" danger style={{ width: '150px', float: "right", margin: "15px 20px" }}>
                        <Link to={'/'}>로그인</Link>
                    </Button>
                    <span style={{ color: "white", float: "right" }}>로그인을 해주세요.</span>
                </div> : null
            }
        </Header>
    )
}

export default HeaderLayout