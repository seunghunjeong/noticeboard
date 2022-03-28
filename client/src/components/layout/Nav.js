import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, ProfileOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Axios from 'axios';

function Nav() {

  const [boardCategory, setBoardCategory] = useState([]);
  useEffect(() => {
    Axios.post('http://localhost:8000/nav/getCategory')
    .then((res) => {
      setBoardCategory(res.data);
    })
  },[]);

  // const [state, setState] = useState();

  // const handleClick = (e) => {
  //   console.log(e);
  //   setState(e.key);
  // }
  
  //antd 
  const { Sider } = Layout;
  const { SubMenu } = Menu;

  return (
    <Sider>
      
      <div className="main-logo" />
      <Menu theme="dark" defaultOpenKeys={['sub1']} mode="inline">
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to={'/'}>DailyReport</Link>
        </Menu.Item>
        <SubMenu key="sub1" icon={<ProfileOutlined />} title="Board">
          {
            boardCategory.map((e)=>
              <Menu.Item key={'board_'+e.idx}><Link to={`/board_list/${e.category}`}>{e.category}</Link></Menu.Item>
            )
          }
        </SubMenu>
        <Menu.Item key="3" icon={<SettingOutlined />}>
          <Link to={`/setting_page`}>Setting</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default Nav