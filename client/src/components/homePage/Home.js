import React, { Fragment, useState } from 'react'
import Axios from 'axios';
import 'antd/dist/antd.less';
import '../../App.css';
import { Card, Layout, Calendar, Badge, Button, Tag, Tabs } from 'antd';
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, Link, useParams } from "react-router-dom"
import ReactHtmlParser from 'react-html-parser';
import locale from "antd/es/calendar/locale/ko_KR";
import Modal from './DailyReportPopup';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';





function Home() {

    // 월 단위 캘린더 랜더링할 내용
    function getListData(value) {
        let listData;
        let i = 1
        let content = "test";
        let type = "success";
        let index = [1, 2];
        // switch (value.date()) {
        //     case i:
        //         listData = [
        //             { index: index[0], type: type, content: content },
        //             { index: index[1], type: type, content: content }
        //         ];
        //         break;

        //     default:
        // }
        return listData || [];
    }

    // 월 단위 캘린더 랜더링하는 함수 
    function dateCellRender(value) {
        const listData = getListData(value);

        return (
            <ul className="events">
                <Button className="bogo" onClick={openModal}>+</Button>
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
    };

    const [report, setReport] = useState("");
    const [writer, setWriter] = useState("임시작성자");
    // 일일보고 등록
    const getReport = e => {
        const {value} = e.target;
        setReport(value);
    }
    const submitReport = () => {

        if(report === ""){
            alert("내용을 입력해주세요.");
            return;
        }
        Axios.post('http://localhost:8000/report/insert',{
                report: report,
                writer: writer,
                date: selectDay.selectedValue.format('YYYY-MM-DD')
        }).then(() => {
            alert("등록완료");
            closeModal();
        })
    }


    return (
        <Fragment>
            <Calendar style={{
                margin: '16px 16px 0 16px',
                height: 'calc(100% - 134px)'
            }}
                locale={locale}
                fullscreen={true}
                // onPanelChange={onPanelChange}
                dateCellRender={dateCellRender}
                // monthCellRender={monthCellRender}
                onSelect={onSelect}
            />
            <Modal display={modalOpen} close={closeModal} header="일일 보고" insert={submitReport}>
                <Tag style={{ marginBottom: '5px' }}>작성자 :이름</Tag>
                <Tag style={{ marginBottom: '5px' }}>작성일 :{selectDay.selectedValue.format('YYYY-MM-DD')}</Tag>
                <TextArea style={{ height: '300px' }} onChange={getReport}></TextArea>
            </Modal>
        </Fragment>
    )
}

export default Home