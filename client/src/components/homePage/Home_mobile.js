import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios';
import 'antd/dist/antd.less';
import { Calendar, Badge, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import locale from "antd/es/calendar/locale/ko_KR";
import Modal from '../../components/modals/DailyReportPopup';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';

import MobileStyle from '../../App_mobile.module.css';

function Home() {

    // 회원관리 기능 완성 후 작성자 id 값 넘겨서 자기가 쓴것만 받아오도록 수정필요
    useEffect(() => {
        Axios.get('http://localhost:8000/report/getReportList'
        ).then((response) => {
            setViewDailyReport(response.data);
        })
    }, [])

    // dailyReport 정보
    const [dailyReport, setDailyReport] = useState(
        {
            id : 'test',
            writer : '임시작성자',
            report : '',
            regist_date : ''
        }
    );

    const [viewDailyReport, setViewDailyReport] = useState([]);
    const [state, setState] = useState("");

    // 월 단위 캘린더 랜더링할 내용
    function getListData(value) {

        const reportData = viewDailyReport;
        let listData;
        let calendarMoment;
        let type = "success";
        for (let i in reportData) {
            calendarMoment = moment(reportData[i].regist_date).format("YYYY-MM-DD");

            if (calendarMoment === value.format("YYYY-MM-DD")) {
                listData = [
                    {
                        key: reportData[i].idx,
                        type: type
                    },
                ];
            }

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

    // 클릭한 셀이 표시하는 일자를 받아옴
    const onSelect = value => {
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
            <Modal display={modalOpen} close={closeModal} header="일일 보고" insert={insertBogo}>
                <Tag style={{ marginBottom: '5px' }}>작성자 :이름</Tag>
                <Tag style={{ marginBottom: '5px' }}>작성일 :{dailyReport.regist_date}</Tag>
                <TextArea style={{ height: '300px' }} onChange={textAreaHandleChange}></TextArea>
            </Modal>
        </Fragment>
    )
}

export default Home