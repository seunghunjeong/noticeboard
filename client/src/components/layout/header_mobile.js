import { Layout, Button } from 'antd';
import '../../App.css';


const { Header } = Layout;

function header() {
    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className="main-logo"/>
            <Button type = "primary">버튼</Button>
        </Header>
    )
}

export default header