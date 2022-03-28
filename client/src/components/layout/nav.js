import { Layout, Menu } from 'antd';
import { HomeOutlined, ProfileOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function Nav(props) {

  const categoryList = props.props;
  const admin = props.admin;
  console.log(categoryList);
  console.log(admin);
  
  //antd 
  const { Sider } = Layout;
  const { SubMenu } = Menu;

  return (
    <Sider>
      
      <div className="main-logo" />
      <Menu theme="dark" defaultOpenKeys={['sub1']} mode="inline">
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to={'/'}>HOME</Link>
        </Menu.Item>
        <SubMenu key="sub1" icon={<ProfileOutlined />} title="Board">
          {
            categoryList.map((e)=>
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