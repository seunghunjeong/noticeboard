import { Layout, Menu } from 'antd';
import { HomeOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';

function Nav() {
 
  //antd 
  const { Sider } = Layout;
  const { SubMenu } = Menu;

  const [boardCategory, setBoardCategory] = useState([]);

  useEffect(() => {
    Axios.post('http://localhost:8000/nav/getCategory')
    .then((res) => {
      setBoardCategory(res.data);
    })
  },[]);

  //사용자 정보 받아오기
  const getUserData = useSelector(state => state.user.userData);
  //관리자가 1일때 관리자 메뉴보이기(관리자 : 1 / 나머지 : null)
  const admin = getUserData === undefined ? null : getUserData.admin;
  console.log(admin);

  return (
    <Sider>
      
      <div className="main-logo" />
      <Menu theme="dark" defaultOpenKeys={['sub1']} mode="inline">
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to={'/'}>HOME</Link>
        </Menu.Item>
        <SubMenu key="sub1" icon={<ProfileOutlined />} title="Board">
          {
            boardCategory.map((e)=>
              <Menu.Item key={'board_'+e.idx}><Link to={`/board_list/${e.category}`}>{e.category}</Link></Menu.Item>
            )
          }
        </SubMenu>
        {admin === true ? <SubMenu key="sub2" icon={<ProfileOutlined />} title="Setting">
                        <Menu.Item key="2"><Link to={""}>가입승인</Link></Menu.Item>   
                        <Menu.Item key="3"><Link to={""}>게시판관리</Link></Menu.Item>   
                      </SubMenu> : null
        }
        
      </Menu>
    </Sider>
  )
}

export default Nav