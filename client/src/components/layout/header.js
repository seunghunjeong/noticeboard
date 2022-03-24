import React from 'react';
import { Layout, Button } from 'antd';
import '../../App.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

//antd 
const { Header } = Layout;

function header(props) {

    const isAuth = props.props;
    //console.log(isAuth);

    //페이지이동
    //const navigate = useNavigate();

    //로그아웃버튼 클릭
    const onLogoutHandler = (event) => {
      event.preventDefault(); //안하면 페이지가 refresh되므로 막아주려고 사용.

      // Axios.get("/api/logout")
      // .then(response => {
      //     if(response.data.success){
      //         navigate("/");
      //     }else{
      //         alert("로그아웃 하는데 실패했습니다.");
      //     }
      // })
     
    }

    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className="main-logo"/>
            {
                {isAuth} === false ? <Button type="primary" danger style={{ width : '150px', float : "right", margin : "15px 20px" }}>
                <Link to={'/login'}>login</Link>
                </Button> :
                <Button type="primary" danger style={{ width : '150px', float : "right", margin : "15px 20px" }} 
                    onClick={onLogoutHandler}>
                    로그아웃
                </Button>
            }
            
          
        </Header>
    )
}

export default header