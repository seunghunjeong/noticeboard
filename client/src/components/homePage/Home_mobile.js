import React, { Fragment, useState } from 'react'
import Axios from 'axios';
import 'antd/dist/antd.less';
import { Calendar, Badge, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import locale from "antd/es/calendar/locale/ko_KR";
import Modal from './DailyReportPopup';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';

import MobileStyle from '../../App_mobile.module.css';

function Home() {
    
    // dailyReport 정보
    const [dailyReport, setDailyReport] = useState(
        {
            id : 'test',
            writer : '임시작성자',
            report : '',
            regist_date : ''
        }
    );

    // 월 단위 캘린더 랜더링할 내용
    function getListData(value) {
        let listData;
        let i = 1
        let type = "success";
        switch (value.date()) {
            case i:
                listData = [
                    { type: type }
                ];
                break;

            default:
        }
        return listData || [];
    }

    // 월 단위 캘린더 랜더링하는 함수 
    function dateCellRender(value) {
        const listData = getListData(value);

        return (
            <ul className='events'>
                <PlusOutlined className={MobileStyle.bogo} onClick={openModal} />
                {listData.map(item => (
                    <li key={item.index}>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    }


    // 년 단위 캘린더 랜더링 할 내용 
    function getMonthData(value) {
        if (value.month() === 5) {
            return 1394;
        }
    }

    // 년 단위 캘린더 랜더링 위한 함수
    function monthCellRender(value) {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    }

    // 팝업창 열고 닫기위한 상태값 , 열고닫는 함수
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    // 선택일 담기위한 state
    const [selectDay, setSelectDay] = useState({
        selectedValue: moment('')
    })


    // 클릭한 셀이 표시하는 일자를 받아옴
    const onSelect = value => {
        setSelectDay({
            selectedValue: value,
        });

        // 등록일 저장
        setDailyReport({
            ...dailyReport,
            regist_date : value.format('YYYY-MM-DD')
        })
    };

    // 일보 내용 저장
    const textAreaHandleChange = (event) => {
        setDailyReport({
            ...dailyReport,
            report : event.target.value
        })
    }

    // 일보 저장
    const insertBogo = () => {
        console.log(dailyReport);
        Axios.post('http://localhost:8000/api/insertR', dailyReport
        ).then(() => {
        alert('일일보고가 작성되었습니다.');
        })
    }

    return (
        <Fragment>
            <Calendar style={{
                margin: '16px 16px 0 16px',
                height: 'calc(80vh)'
            }}
                locale={locale}
                fullscreen={true}
                // onPanelChange={onPanelChange}
                dateCellRender={dateCellRender}
                // monthCellRender={monthCellRender}
                onSelect={onSelect}
            />
            <Modal open={modalOpen} close={closeModal} header="일일 보고" insert={insertBogo}>
                <Tag style={{ marginBottom: '5px' }}>작성자 :이름</Tag>
                <Tag style={{ marginBottom: '5px' }}>작성일 :{selectDay.selectedValue.format('YYYY-MM-DD')}</Tag>
                <TextArea style={{ height: '300px' }} onChange={textAreaHandleChange}></TextArea>
            </Modal>
        </Fragment>
    )
}

export default Home