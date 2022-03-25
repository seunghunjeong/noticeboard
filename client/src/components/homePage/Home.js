import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios';
import { Calendar, Button, Tag, Divider, Badge } from 'antd';
import { PlusSquareOutlined, EditOutlined, BarsOutlined, FireFilled } from '@ant-design/icons';
import 'antd/dist/antd.less';
import locale from "antd/es/calendar/locale/ko_KR";
import ReportRegisterModal from '../modals/DailyReportRegister';
import ReportUpdateModal from '../modals/DailyReportUpdate';
import ReportViewModal from '../modals/DailyReportView';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import '../../App.css';
import { useSelector } from 'react-redux';
import Auth from '../../hoc/auth'

function Home() {

    // 캘린더 셀 렌더링을 위한 state
    const [state, setState] = useState("first");
    // 일일보고 전체내용을 받기위한 state // 자기 자신것
    const [viewMyDailyReport, setViewMyDailyReport] = useState([]);
    // 일일보고 전체내용을 받기위한 state // 모든 사람것
    const [viewDetailReportList, setViewDetailReportList] = useState([]);
    // 일일보고를 1개씩 보관하기위한 state
    const [dailyReportDetail, setDailyReportDetail] = useState({
        idx: "",
        content: "",
        date: ""
    });
    // 선택한 셀의 날자를 보관하는 state
    const [selectDay, setSelectDay] = useState({
        selectedValue: moment('YYYY-MM-DD')
    });
    // 보고등록 textarea 입력한 값을 보관하는 state
    const [report, setReport] = useState("");
    // modal opne, close 를 위한 상태값을 보관하는 state
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    // 등록창 열고닫기
    const openRegisterModal = () => { setRegisterModalOpen(true); };
    const closeRegisterModal = () => { setRegisterModalOpen(false); };
    // 수정창 열고닫기
    const openUpdateModal = () => { setUpdateModalOpen(true); };
    const closeUpdateModal = () => { setUpdateModalOpen(false); };
    // 조회창 열고닫기
    const openViewModal = () => { setViewModalOpen(true); };
    const closeViewModal = () => { setViewModalOpen(false); };

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    //const getUserId = useSelector(state => setWriter(state.user.userData.id));
    const userId = getUserData === undefined ? null : getUserData.id;
    const userName = getUserData === undefined ? null : getUserData.userName; 
    const isAuth = getUserData === undefined ? null : getUserData.isAuth;

    // 회원관리 기능 완성 후 작성자 id 값 넘겨서 자기가 쓴것만 받아오도록 수정필요
    useEffect(() => {
        console.log(userId);
        const id = userId;
        Axios.get('http://localhost:8000/report/getMyReport', {
            params: {
                id : id
            }
        }
        ).then((response) => {
            setViewMyDailyReport(response.data);
        }) 
    }, [state, userId])

    // 전체 일일보고 데이터 불러오기
    useEffect(() => {
        Axios.get('http://localhost:8000/report/getReportDetail'
        ).then((res) => {
            setViewDetailReportList(res.data);
        })
    }, [state])

    // 월 단위 캘린더 랜더링할 내용
    const getListData = (value) => {

        const reportData = viewMyDailyReport;

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
    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                <li className='bogo'>
                    {
                        listData.length === 1 ?
                            <Button className="bogo_update" onClick={openUpdateModal}><EditOutlined /></Button> :
                            <Button className="bogo_register" onClick={openRegisterModal}><PlusSquareOutlined /></Button>
                    }
                    <Button className="bogo_view" onClick={openViewModal}><BarsOutlined /></Button>
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


    // 클릭한 셀이 표시하는 일자, 데이터를 받아서 저장
    const onSelect = value => {
        setState("");
        const reportData = viewMyDailyReport;
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
    }

    // 일일보고 등록
    const submitReport = () => {
        const id = userId; 
        if (report === "") {
            alert("내용을 입력해주세요.");
            return;
        }
        Axios.post('http://localhost:8000/report/insert', {
            report: report,
            writer: userName,
            date: selectDay.selectedValue.format('YYYY-MM-DD'),
            id: id
        }).then(() => {
            alert("등록완료");
            closeRegisterModal();
            setReport("");
            setState("insert");
        })
    }

    // 수정시 기존에 있던 report 값을 새로운 입력을 받는 report state 에다가 셋팅
    useEffect(() => {
        setReport(dailyReportDetail.content);
    }, [dailyReportDetail.content])


    // 보고 수정
    const updateReport = () => {
        if (report === "") {
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
    // 보고 삭제
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


    useEffect(() => {
        GetDetailReport();
    }, [viewModalOpen])
    let detailReport = [];
    const GetDetailReport = () => {

        const day = moment(selectDay.selectedValue).format('YYYY-MM-DD');
        const detailReportList = viewDetailReportList;

        for (let i in detailReportList) {
            let regist_date = moment(detailReportList[i].regist_date).format('YYYY-MM-DD');

            if (day === regist_date) {
                detailReport.push(detailReportList[i]);
            }

        }

        const reportList = detailReport.map((item) => (
            <div key={item.idx} >
                <pre style={{ font: 'initial', fontSize: '12px' }}>
                    <Badge status='success' text={item.writer} />
                    <br></br><br></br>
                    {item.report}
                    <Divider></Divider>
                </pre>
            </div>
        ));
        return (
            <>
                {reportList}
            </>
        )
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
                <Tag style={{ marginBottom: '5px' }}>작성자 : {userId}</Tag>
                <Tag style={{ marginBottom: '5px' }}>작성일 : {selectDay.selectedValue.format('YYYY-MM-DD')}</Tag>
                <TextArea style={{ height: '300px' }} onChange={getReport} defaultValue="◎"></TextArea>
            </ReportRegisterModal>

            {/* 수정팝업 */}
            <ReportUpdateModal display={updateModalOpen} close={closeUpdateModal} header="일일보고 수정" update={updateReport} del={deleteReport}>
                <Tag style={{ marginBottom: '5px' }}>작성자 : {userId}</Tag>
                <Tag style={{ marginBottom: '5px' }}>작성일 : {selectDay.selectedValue.format('YYYY-MM-DD')}</Tag>
                <TextArea style={{ height: '300px' }} onChange={getReport} defaultValue={dailyReportDetail.content}></TextArea>
            </ReportUpdateModal>

            {/* 조회팝업 */}
            <ReportViewModal display={viewModalOpen} close={closeViewModal} header="일일보고 조회" day={selectDay.selectedValue.format('YYYY-MM-DD')}>
                <GetDetailReport />
            </ReportViewModal>

        </Fragment>
    )
}

export default Auth(Home, true)