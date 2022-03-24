import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios';
import 'antd/dist/antd.less';
import { Calendar, Badge, Tag } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import locale from "antd/es/calendar/locale/ko_KR";
import Modal from '../../components/modals/DailyReportPopup_mobile';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';

import MobileStyle from '../../App_mobile.module.css';

function Home() {
    
    // 유저 아이디 들어갈곳
    const userId = "123";

    // dailyReport 정보
    const [dailyReport, setDailyReport] = useState(
        {
            id: userId,
            writer: '임시작성자',
            report: '',
            regist_date: ''
        }
    );
    const [state, setState] = useState();

    // 일일보고 전체내용을 받기위한 state // 자기 자신것
    const [viewMyDailyReport, setViewMyDailyReport] = useState([]);
    const [viewDailyReport, setViewDailyReport] = useState([]);

    const [readBogoArr, setReadBogoArr] = useState();


    // 회원관리 기능 완성 후 작성자 id 값 넘겨서 자기가 쓴것만 받아오도록 수정필요
    useEffect(() => {
        const id = userId; // 임시 id 
        Axios.get('http://localhost:8000/report/getMyReport', {
            params: {
                id: id
            }
        }
        ).then((response) => {
            setViewMyDailyReport(response.data);
        })
    }, [state])

    // 전체 일일보고 데이터 불러오기
    useEffect(() => {
        Axios.get('http://localhost:8000/report/getReportDetail'
        ).then((res) => {
            setViewDailyReport(res.data);
        })
    }, [state])


    // 월 단위 캘린더 랜더링할 내용
    function getListData(value) {

        const reportData = viewMyDailyReport;
        let listData;
        let calendarMoment;
        let type = "success";
        for (let i in reportData) {
            calendarMoment = moment(reportData[i].regist_date).format("YYYY-MM-DD");

            if (calendarMoment === value.format("YYYY-MM-DD")) {
                listData = [
                    {
                        key: reportData[i].idx,
                        content: reportData[i].report,
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
                {/* 데이터에 따른 버튼 변경 */}
                {listData.length === 0 ?
                    <PlusOutlined className={MobileStyle.bogo} onClick={openModal} state='insertModal' />
                    : <EditOutlined className={MobileStyle.bogo} onClick={openModal} state='updateModal' />}
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
    const openModal = (e) => {
        setModalOpen(true);
        // 버튼 상태 가져오기
        setState(e.currentTarget.getAttribute('state'));
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    // 클릭한 셀이 표시하는 일자를 받아옴
    const onSelect = value => {
        // 등록일 저장
        setDailyReport({
            ...dailyReport,
            regist_date: value.format('YYYY-MM-DD')
        })
    };

    // 일보 내용 저장
    const textAreaHandleChange = (event) => {
        setDailyReport({
            ...dailyReport,
            report: event.target.value
        })
    }

    // 일보 저장
    const insertBogo = () => {
        console.log(dailyReport);
        Axios.post('http://localhost:8000/api/insertR', dailyReport
        ).then(() => {
            alert('일일보고가 작성되었습니다.');
            closeModal();
            setState('insert');
        })
    }

    const updateReport = () => {
        if (dailyReport.report === "") {
            alert("내용을 입력해주세요");
            return;
        }

        Axios.post('http://localhost:8000/report/update', {
            idx: readBogoArr.idx,
            // 수정 확인용
            content: dailyReport.report,
            date: dailyReport.regist_date
        }).then(() => {
            alert("수정완료");
            closeModal();
            setState("update");
        })

    }

    const deleteReport = () => {
        Axios.post('http://localhost:8000/report/delete', {
            idx: readBogoArr.idx,
        }).then(() => {
            alert("삭제완료");
            closeModal();
            setState("delete");
        })
    }



    // 일보 읽기
    const readBogo = () => {
        let resultTxt;
        if (state === 'updateModal') {
            resultTxt = viewMyDailyReport.filter(
                (node) => moment(node.regist_date).format("YYYY-MM-DD") === dailyReport.regist_date
            )
            setReadBogoArr(resultTxt[0]);
        }
        return resultTxt ? resultTxt[0].report : ' @'
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
            <Modal state={state} display={modalOpen} close={closeModal} header="일일 보고" insert={insertBogo} update={updateReport} del={deleteReport}>
                <Tag style={{ marginBottom: '5px' }}>작성자 :이름</Tag>
                <Tag style={{ marginBottom: '5px' }}>작성일 :{dailyReport.regist_date}</Tag>
                <TextArea style={{ height: '300px' }} onChange={textAreaHandleChange} defaultValue={readBogo}></TextArea>
            </Modal>
        </Fragment>
    )
}

export default Home