import React from 'react';
import { Layout, Button } from 'antd';
import '../../App.css';
import { Link } from 'react-router-dom';
import { logout} from '../../_actions/user_action';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";



function HeaderLayout(props) {
    
    //antd 
    const { Header } = Layout;

    //로그인boolen
    const propsValue = props.props;
    
    //props값 그대로 변수로 넣으면 렌더링이 안되서 따로 string값으로 변경해준것
    let isAuth = propsValue === true ? "true" : "false" 
    console.log(isAuth)

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
                navigate("/board_list");
            }
            else { 
                alert(response.payload.logoutSuccess);
            }
        });
    }

    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className="main-logo"/>
            {
                isAuth === "true" ? <Button type="primary" danger style={{ width : '150px', float : "right", margin : "15px 20px" }}
                                    onClick={onLogoutHandler}>
                                    로그아웃 
                                 </Button> : null
    }
            {
                isAuth === "false" ? <Button type="primary" danger style={{ width : '150px', float : "right", margin : "15px 20px" }}>
                                    <Link to={'/login'}>로그인</Link>
                                  </Button> : null 
            }
        </Header>
    )
}

export default HeaderLayout