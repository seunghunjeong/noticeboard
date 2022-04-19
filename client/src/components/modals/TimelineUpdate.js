import React from 'react';
import './DailyReport.css'
import { Button, Card, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Loader from '../modals/Loader';

//antd
const { Title } = Typography;

const TimelineUpdate = (props) => {

    // 부모로부터 값을 받아옴
    const { display, close, insert, loading } = props;

    return (
        // 클래스명 변경을 통해 활성화 / 비활성화
        <div className={display ? 'openModal modal' : 'modal'}>
            
            <Card className="Card">
                <header style={{ width : '100%', height : 45 }}>
                    <Title level={3} style={{ float : 'left' }} >일정수정</Title>
                    <Button style={{ float : 'right', fontSize : 18, padding : 0 }} className="closeView" onClick={close}>
                        <CloseOutlined />
                    </Button>
                </header>
                <main>{props.children}</main>
               
                <Button danger style={{float : 'right', marginLeft : 10}} className="delete" onClick={insert}>
                    삭제
                </Button>
                {
                    loading ? <Loader /> :
                            <Button style={{float : 'right'}} className="update" onClick={insert}>
                                수정
                            </Button>
                }
            </Card>
            
        </div>
    );
};

export default TimelineUpdate;