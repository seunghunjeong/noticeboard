import { Layout, Menu } from 'antd';
import { HomeOutlined, ProfileOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function Nav(props) {

  const categoryList = props.props;
  console.log(categoryList);
  
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
        <Menu.Item key="3" icon={<SettingOutlined />}>
          <Link to={`/setting_page`}>Setting</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default Nav