import { Layout } from 'antd';
import '../../App.css';

const { Header } = Layout;

function header() {
    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className="main-logo"/>
        </Header>
    )
}

export default header