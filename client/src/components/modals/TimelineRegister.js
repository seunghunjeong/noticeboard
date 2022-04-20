import React from 'react';
import './DailyReport.css'
import { Button, Card, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Loader from '../modals/Loader';

//antd
const { Title } = Typography;

const TimelineRegister = (props) => {
    
    // 부모로부터 값을 받아옴
    const { display, close, insert, loading } = props;

    // 휴가종류
    //const leaveTypechildren = [];

    // db로 관리할지 고민중...
    // leaveTypechildren.push(<Option key={1}>연차</Option>);
    // leaveTypechildren.push(<Option key={2}>오전반차</Option>);
    // leaveTypechildren.push(<Option key={3}>오후반차</Option>);
    // leaveTypechildren.push(<Option key={4}>병가</Option>);
    // leaveTypechildren.push(<Option key={5}>경조휴가</Option>);

    return (
        // 클래스명 변경을 통해 활성화 / 비활성화
        <div className={display ? 'openModal modal' : 'modal'}>
            
            <Card className="Card">
                <header style={{ width : '100%', height : 45 }}>
                    <Title level={3} style={{ float : 'left' }} >일정추가</Title>
                    <Button style={{ float : 'right', fontSize : 18, padding : 0 }} className="closeView" onClick={close}>
                        <CloseOutlined />
                    </Button>
                </header>
                <main>{props.children}</main>
                {
                    loading ? <Loader /> :
                            <Button style={{float : 'right'}} className="insert" onClick={insert}>
                                추가
                            </Button>
                }
            </Card>
            
        </div>
    );
};

export default TimelineRegister;