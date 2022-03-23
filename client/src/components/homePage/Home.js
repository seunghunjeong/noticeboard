import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios';
import { Calendar, Button, Tag } from 'antd';
import { PlusSquareOutlined, EditOutlined, BarsOutlined } from '@ant-design/icons';
import 'antd/dist/antd.less';
import locale from "antd/es/calendar/locale/ko_KR";
import ReportRegisterModal from '../../components/modals/DailyReportPopup';
import ReportUpdateModal from '../../components/modals/DailyReportUpdate';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import '../../App.css';
import Auth from '../../hoc/auth'

function Home() {
    const [state, setState] = useState("");
    const [writer, setWriter] = useState("임시작성자");
    const [viewDailyReport, setViewDailyReport] = useState([]);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectDay, setSelectDay] = useState({
        selectedValue: moment('')
    });
    const [report, setReport] = useState("");
    // 등록창 열고닫기
    const openRegisterModal = () => {
        setRegisterModalOpen(true);
    };
    const closeRegisterModal = () => {
        setRegisterModalOpen(false);
    };
    // 수정창 열고닫기
    const openUpdateModal = () => {
        setUpdateModalOpen(true);
    };
    const closeUpdateModal = () => {
        setUpdateModalOpen(false);
    };



    // 회원관리 기능 완성 후 작성자 id 값 넘겨서 자기가 쓴것만 받아오도록 수정필요
    useEffect(() => {
        Axios.get('http://localhost:8000/report/getReportList'
        ).then((response) => {
            setViewDailyReport(response.data);
        })
    }, [state])




    // 월 단위 캘린더 랜더링할 내용
    function getListData(value) {

        const reportData = viewDailyReport;
        let listData;
        let calendarMoment;
        for (let i in reportData) {
            calendarMoment = moment(reportData[i].regist_date).format("YYYY-MM-DD");

            if (calendarMoment === value.format("YYYY-MM-DD")) {
                listData = [
                    {
                        key: reportData[i].idx,
                        content: reportData[i].report
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
            <ul className="events">
                <li className='bogo'>
                    {
                        listData.length === 1 ? null : <Button className="bogo_register" onClick={openRegisterModal}><PlusSquareOutlined /></Button>
                    }
                    {
                        listData.length === 0 ? null : <Button className="bogo_update" onClick={openUpdateModal}><EditOutlined /></Button>
                    }
                    <Button className="bogo_view" onClick={() => { alert("상세보기창") }}><BarsOutlined /></Button>
                </li>
                {listData.map(item => (
                    <li key={"report" + item.idx}>
                        <textarea className='reportView' style={{
                            border: 'none',
                            background: 'none',
                            resize: 'none',
                            cursor: 'pointer',
                            width: '100%',
                            height: '80px'
                        }} readOnly defaultValue={item.content}>
                        </textarea>
                    </li>
                ))}
            </ul>
        );
    }


    // 년 단위 캘린더 랜더링 할 내용 
    // function getMonthData(value) {
    //     if (value.month() === 5) {
    //         return 1394;
    //     }
    // }

    // 년 단위 캘린더 랜더링 위한 함수
    // function monthCellRender(value) {
    //     const num = getMonthData(value);
    //     return num ? (
    //         <div className="notes-month">
    //             <section>{num}</section>
    //             <span>Backlog number</span>
    //         </div>
    //     ) : null;
    // }


    const [dailyReportDetail, setDailyReportDetail] = useState({
        idx: "",
        content: "",
        date: ""
    });


    // 클릭한 셀이 표시하는 일자, 데이터를 받아서 저장
    const onSelect = value => {
        setState("");
        const reportData = viewDailyReport;
        let calendarMoment;

        for (let i in reportData) {
            calendarMoment = moment(reportData[i].regist_date).format("YYYY-MM-DD");
            if (calendarMoment === value.format("YYYY-MM-DD")) {
                setDailyReportDetail({
                    idx: reportData[i].idx,
                    content: reportData[i].report,
                    date: moment(reportData[i].regist_date).format("YYYY-MM-DD")
                })
            }
        }

        setSelectDay({
            selectedValue: value,
        });

    };


    // 일일보고 textarea value 가져와서 저장
    const getReport = e => {
        const { value } = e.target;
        setReport(value);
        console.log(report);
    }

    // 일일보고 등록
    const submitReport = () => {

        if (report === "") {
            alert("내용을 입력해주세요.");
            return;
        }
        Axios.post('http://localhost:8000/report/insert', {
            report: report,
            writer: writer,
            date: selectDay.selectedValue.format('YYYY-MM-DD')
        }).then(() => {
            alert("등록완료");
            closeRegisterModal();
            setReport("");
            setState("insert");
        })
    }
    // 일일보고 수정

    useEffect(()=>{
        setReport(dailyReportDetail.content);
    },[dailyReportDetail.content])
    


    const updateReport = () => {
        console.log("dailyReportDetail.content : " + dailyReportDetail.content);
        console.log("report : " + report);
        if (report === "") {
            console.log("dailyReportDetail.content : " + dailyReportDetail.content);
            console.log("report : " + report);

            alert("내용을 입력해주세요");
            return;
        }
        Axios.post('http://localhost:8000/report/update', {
            idx: dailyReportDetail.idx,
            content: report,
            date: dailyReportDetail.date
        }).then(() => {
            alert("수정완료");
            closeUpdateModal();
            setReport("");
            setState("update");
        })

    }

    const deleteReport = () => {
        Axios.post('http://localhost:8000/report/delete', {
            idx: dailyReportDetail.idx,
        }).then(() => {
            alert("삭제완료");
            closeUpdateModal();
            setReport("");
            setState("delete");
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

            {/* 등록팝업 */}
            <ReportRegisterModal display={registerModalOpen} close={closeRegisterModal} header="일일보고" insert={submitReport}>
                <Tag style={{ marginBottom: '5px' }}>작성자 : 이름</Tag>
                <Tag style={{ marginBottom: '5px' }}>작성일 : {selectDay.selectedValue.format('YYYY-MM-DD')}</Tag>
                <TextArea style={{ height: '300px' }} onChange={getReport} defaultValue="◎"></TextArea>
            </ReportRegisterModal>

            {/* 수정팝업 */}
            <ReportUpdateModal display={updateModalOpen} close={closeUpdateModal} header="일일보고 수정" update={updateReport} del={deleteReport}>
                <Tag style={{ marginBottom: '5px' }}>작성자 : 이름</Tag>
                <Tag style={{ marginBottom: '5px' }}>작성일 : {selectDay.selectedValue.format('YYYY-MM-DD')}</Tag>
                <TextArea style={{ height: '300px' }} onChange={getReport} defaultValue={dailyReportDetail.content}></TextArea>
            </ReportUpdateModal>

        </Fragment>
    )
}

export default Auth(Home, true)