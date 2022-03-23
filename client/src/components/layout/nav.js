import React from 'react';
import { Axios } from 'axios';
import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function nav() {

    //antd 
    const { Sider } = Layout;
    const { SubMenu } = Menu;

    //페이지이동
    const navigate = useNavigate();

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
      <Sider>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to={'/'}>Home</Link>
              </Menu.Item>
              {/* <Menu.Item key="2" icon={<TeamOutlined />}>
                Team
              </Menu.Item> */}
              <SubMenu key="sub" icon={<ProfileOutlined />} title="Board">
                <Menu.Item key="3">notice</Menu.Item>
                <Menu.Item key="4"><Link to={'/board_list/'}>project</Link></Menu.Item>
              </SubMenu>
              {/* <Menu.Item key="5" icon={<SettingOutlined />}>
                Setting
              </Menu.Item> */}
          </Menu>
          <div style={{ width : '100%', textAlign : 'center', position : 'absolute', bottom : '10px', left : '0' }}>
            <Button type="primary" danger style={{ width : '90%' }}>
              <Link to={'/login'}>login</Link>
            </Button>
            <Button type="primary" danger style={{ width : '90%' }} onClick={onLogoutHandler}>
                로그아웃
            </Button>
          </div>
       </Sider>
    )
}

export default nav