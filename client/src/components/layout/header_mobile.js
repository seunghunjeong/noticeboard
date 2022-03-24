import { Layout } from 'antd';
import {BarsOutlined } from '@ant-design/icons';

import MobileStyle from '../../App_mobile.module.css';

const { Header } = Layout;

function header() {
    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className={MobileStyle.mainLogo} />
            <BarsOutlined className={MobileStyle.btnHeader} />
        </Header>
    )
}

export default header