import { Layout } from 'antd';

const { Footer } = Layout;

function footer() {
    return (
        <Footer style={{ textAlign: 'center', fontSize : "11px" }}> 08505 서울시 금천구 가산디지털로2로 101, 1705호 <br/>
        Tel : 02-578-5101 | Fax : 02-578-5191 
        <br/>©2022. CmWorld INC all right reserved.</Footer>
    )
}

export default footer