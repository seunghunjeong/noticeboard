import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom"
import Auth from '../../_hoc/auth'

import '../../App.css';
import {
    Select, Calendar, DatePicker, Button,
    Tag, message, Card, Typography, Layout, Timeline, Badge
} from 'antd';
import {
    PlusSquareOutlined, EditOutlined, BarsOutlined,
    CheckOutlined, SmileTwoTone, PlusOutlined, FieldTimeOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.less';
import locale from "antd/es/calendar/locale/ko_KR";
import ReportRegisterModal from '../modals/DailyReportRegister';
import ReportUpdateModal from '../modals/DailyReportUpdate';
import ReportViewModal from '../modals/DailyReportView';
import TimeLineRegisterModal from '../modals/TimelineRegister';
import TimeLineUpdateModal from '../modals/TimelineUpdate';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';

// modal confirm
import confirmModal from '../modals/ConfirmModal_mobile';

// antd variable
const { Text } = Typography;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

function Home() {
    // 로딩처리를 위한 state
    const [loading, setLoading] = useState(null);
    // 캘린더 셀 렌더링을 위한 state
    const [state, setState] = useState();
    // 일일보고 전체내용을 받기위한 state // 자기 자신것
    const [viewMyDailyReport, setViewMyDailyReport] = useState([]);
    // 일일보고 전체내용을 받기위한 state // 모든 사람것
    const [viewDetailReportList, setViewDetailReportList] = useState([]);
    // 일일보고를 1개씩 보관하기위한 state
    const [dailyReportDetail, setDailyReportDetail] = useState({
        idx: "",
        content: "",
        plan: "",
        date: ""
    });
    // 선택한 셀의 날자를 보관하는 state
    const [selectDay, setSelectDay] = useState({
        selectedValue: moment('YYYY-MM-DD')
    });
    // 보고등록 textarea 입력한 값을 보관하는 state
    const [report, setReport] = useState({
        today: "",
        tomorrow: ""
    });

    //새글 알림
    const [newBoardList, setNewBoardList] = useState([]);

    //이번주 일정 타임라인
    const [timelineThisWeekList, setTimelineThisWeekList] = useState([]);
    //다음주 일정 타임라인
    const [timelineNextWeekList, setTimelineNextWeekList] = useState([]);

    // modal opne, close 를 위한 상태값을 보관하는 state
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [timelineModalOpen, setTimelineModalOpen] = useState(false);
    const [timelineUpdateModalOpen, setTimelineUpdateModalOpen] = useState(false);

    // 등록창 열고닫기
    const openRegisterModal = () => {

        if (department === null && !isAdmin) {
            message.info('부서 정보가 없습니다. 관리자에게 문의하세요')
            return;
        }
        setRegisterModalOpen(true);
    };
    const closeRegisterModal = () => { setRegisterModalOpen(false); setReport({ today: '', tomorrow: '' }); };
    // 수정창 열고닫기
    const openUpdateModal = () => { setUpdateModalOpen(true); };
    const closeUpdateModal = () => { setUpdateModalOpen(false); setReport({ today: '', tomorrow: '' }); };
    // 조회창 열고닫기
    const openViewModal = () => {

        if (department === null && !isAdmin) {
            message.info('부서 정보가 없습니다. 관리자에게 문의하세요')
            return;
        }

        setViewModalOpen(true);
        GetDetailReport();
    };
    const closeViewModal = () => { setViewModalOpen(false); setReport({ today: '', tomorrow: '' }); };

    // 타임라인 등록창 열고닫기
    const openTimelineModal = () => { setTimelineModalOpen(true); };
    const closeTimelineModal = () => { setTimelineModalOpen(false); };
    // 타임라인 수정창 열고닫기
    const openTimelineUpdateModal = () => { setTimelineUpdateModalOpen(true); };
    const closeTimelineUpdateModal = () => { setTimelineUpdateModalOpen(false); };

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userId = getUserData === undefined ? null : getUserData.id;
    const userName = getUserData === undefined ? null : getUserData.userName;
    const department = getUserData === undefined ? null : getUserData.department;
    const isAdmin = getUserData === undefined ? null : getUserData.admin;

    const [selectDept, setSelectDept] = useState('ICT 사업부');

    useEffect(() => {
        //이번주/다음주 날짜 데이터 계산하기
        let this_monday = moment().day(1).format('YYYY-MM-DD');
        let this_sunday = moment().day(7).format('YYYY-MM-DD');
        let next_monday = moment().day(8).format('YYYY-MM-DD');
        let next_sunday = moment().day(14).format('YYYY-MM-DD');

        // 자신이 작성한 전체 일일보고 받아오기
        const id = userId;
        Axios.get('/report/getMyReport', {
            params: {
                id: id,
                department: department
            }
        }
        ).then((response) => {
            setViewMyDailyReport(response.data);
        })

        // 전체 일일보고 데이터 불러오기
        Axios.get('/report/getReportDetail', {
            params: {
                department: department ?? selectDept
            }
        }
        ).then((res) => {
            setViewDetailReportList(res.data);
        })

        // 새 글 목록 가져오기
        Axios.get('/home/getNewBoardList').then((res) => {
            setNewBoardList(res.data);
        })

        // 이번주 타임라인 목록 가져오기
        Axios.post(('/home/getTimelineThisWeekList'), {
            this_monday: this_monday,
            this_sunday: this_sunday
        }).then((res) => {
            setTimelineThisWeekList(res.data);
            //console.log(res.data)
        })

        // 다음주 타임라인 목록 가져오기
        Axios.post(('/home/getTimelineNextWeekList'), {
            next_monday: next_monday,
            next_sunday: next_sunday
        }).then((res) => {
            setTimelineNextWeekList(res.data);
            //console.log(res.data)
        })

        return () => {
            setRegisterModalOpen(false);
            setUpdateModalOpen(false);
            setViewModalOpen(false);
            setTimelineModalOpen(false);
            setTimelineUpdateModalOpen(false);
        }

    }, [state, userId, selectDept, department])

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
                            <>
                                <CheckOutlined style={{ color: 'green', marginRight: '5px' }} />
                                <Button className="bogo_update" onClick={openUpdateModal}><EditOutlined /></Button>
                            </>
                            : <Button className="bogo_register" onClick={openRegisterModal}><PlusSquareOutlined /></Button>
                    }
                    <Button className="bogo_view" onClick={openViewModal}><BarsOutlined /></Button>
                </li>
                {
                    listData.map(item => (
                        <li key={"report" + item.idx}>
                            <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                                {item.content}
                            </pre>
                        </li>
                    ))
                }
            </ul>
        );
    }

    // 클릭한 셀이 표시하는 일자, 데이터를 받아서 저장
    const onSelect = value => {
        const reportData = viewMyDailyReport;
        let calendarMoment;

        for (let i in reportData) {
            calendarMoment = moment(reportData[i].regist_date).format("YYYY-MM-DD");
            if (calendarMoment === value.format("YYYY-MM-DD")) {
                setDailyReportDetail({
                    idx: reportData[i].idx,
                    content: reportData[i].report,
                    plan: reportData[i].plan,
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
        const { name, value } = e.target;
        setReport({
            ...report,
            [name]: value
        });
    }

    // 일일보고 등록
    const submitReport = () => {
        setLoading(true);
        const id = userId;
        if (report.today === "") {
            message.warning("내용을 입력해주세요.");
            setLoading(false);
            return;
        }
        Axios.post('/report/insert', {
            report: report.today,
            plan: report.tomorrow,
            writer: userName,
            date: selectDay.selectedValue.format('YYYY-MM-DD'),
            id: id
        }).then((res) => {
            message.success("등록완료");
            closeRegisterModal();
            setReport({ today: '', tomorrow: '' });
            setState(res);
            setLoading(false);
        })
    }

    // 수정시 기존에 있던 report 값을 새로운 입력을 받는 report state 에다가 셋팅
    useEffect(() => {
        setReport({
            today: dailyReportDetail.content,
            tomorrow: dailyReportDetail.plan
        });
    }, [dailyReportDetail])


    // 보고 수정
    const updateReport = () => {
        setLoading(true);
        if (report === "") {
            message.warning("내용을 입력해주세요");
            return;
        }
        Axios.post('/report/update', {
            idx: dailyReportDetail.idx,
            content: report.today,
            plan: report.tomorrow,
            date: dailyReportDetail.date
        }).then((res) => {
            message.success("수정완료");
            closeUpdateModal();
            setReport({ today: '', tomorrow: '' });
            setState(res);
            setLoading(false);
        })

    }

    // confirm param object
    let confirmParam = {
        txt: '',
        action: ''
    }

    // 보고 삭제
    const deleteReport = () => {
        const delAction = () => {
            setLoading(true);
            Axios.post('/report/delete', {
                idx: dailyReportDetail.idx,
            }).then((res) => {
                message.success("삭제완료");
                closeUpdateModal();
                setReport({ today: '', tomorrow: '' });
                setState(res);
                setLoading(false);
            })
        }

        confirmParam.txt = '삭제';
        confirmParam.action = delAction;
        confirmModal(confirmParam);
    }

    // 일일보고 상세보기
    const GetDetailReport = () => {

        const day = moment(selectDay.selectedValue).format('YYYY-MM-DD');
        const detailReportList = viewDetailReportList;

        return (
            <>
                <table className="type11">
                    <thead>
                        <tr>
                            <th scope="cols" className='title'>이름</th>
                            <th scope="cols" className='today'>금일 실적</th>
                            <th scope="cols" className='tomorrow'>익일 계획</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            detailReportList
                                .filter(item => moment(item.regist_date).format('YYYY-MM-DD') === day)
                                .map((item) => {
                                    let str = item.position;
                                    return (
                                        <tr key={item.idx}>
                                            <td className='writer'>{item.writer} {str = str !== null ? str.substring(2) : null}</td>
                                            <td><pre style={{ whiteSpace: 'pre-wrap' }}>{item.report}</pre></td>
                                            <td><pre style={{ whiteSpace: 'pre-wrap' }}>{item.plan}</pre></td>
                                        </tr>
                                    )
                                })
                        }
                    </tbody>
                </table>
            </>
        )
    }

    // 익일 보고를 금일 보고에 넣기
    const readBogo = () => {
        const dateToday = selectDay.selectedValue;
        const dayCnt = moment(dateToday).weekday();
        let subNumb = 1;
        switch (dayCnt) {
            case 1:
                subNumb = 3;
                break;
            case 6:
            case 7:
                return '◎';
            default:
                subNumb = 1;
                break;
        }
        const yesterday = moment(dateToday).subtract(subNumb, 'days').format("YYYY-MM-DD");
        const resultTxt = viewMyDailyReport.filter(
            (node) => moment(node.regist_date).format("YYYY-MM-DD") === yesterday
        )
        setReport({
            ...report,
            today: resultTxt.length > 0 ? resultTxt[0].plan : ''
        });
        return resultTxt.length > 0 ? resultTxt[0].plan : '◎';
    }

    // 새 글 목록 가져오기
    const GetNewBoardList = () => {

        const newBoard = newBoardList;
        return (
            <>
                {
                    newBoard.filter(e => moment(e.regist_date).format("YYYY-MM-DD") > moment().subtract(7, 'day').format("YYYY-MM-DD"))
                        .map((e) =>
                            <Link to={`/board_detail/${e.idx}/${e.category}`} key={e.title}>
                                <Card hoverable="true"
                                    title={e.title} type="inner"
                                    style={{ width: '100%', marginTop: 30 }} className="newBoardCard">
                                    <span style={{ fontSize: '12px', color: 'gray' }}>게시판 : {e.category}</span>
                                    <span style={{ fontSize: '12px', color: 'gray', marginLeft: 10 }}>작성일 : {moment(e.regist_date).format('YYYY-MM-DD')}</span>
                                </Card>
                            </Link>

                        )
                }
            </>
        )
    }

    // 휴가 선택 유형
    let selectLeaveType = "연차"; //state로 바꿔야할듯
    // 휴가 선택 날짜
    let selectLeaveDateStart = "";
    let selectLeaveDateEnd = "";

    function leaveTypeHandler(value) {
        selectLeaveType = value
        //console.log(`selected ${selectLeaveType}`);
    }

    function leaveDateHandler(dates, dateStrings) {
        selectLeaveDateStart = dateStrings[0]
        selectLeaveDateEnd = dateStrings[1]

        console.log(selectLeaveDateStart);
        console.log(selectLeaveDateEnd);
    }

    // 일정 등록하기
    const timelineRegisterHandler = () => {
        setLoading(true);

        const id = userId;
        const name = userName;

        if (selectLeaveType === "") {
            message.warning("휴가 유형을 선택해 주세요.");
            setLoading(false);
            return;
        }
        else if (selectLeaveDateStart === "") {
            message.warning("휴가 날짜를 선택해 주세요.");
            setLoading(false);
            return;
        }

        Axios.post('/home/timelineRegister', {
            selectLeaveType: selectLeaveType,
            selectLeaveDateStart: selectLeaveDateStart,
            userid: id,
            username: name
        }).then((res) => {
            if (res.status === 200) {
                message.success("일정추가완료");
                closeTimelineModal();
                setState(res);
                setLoading(false);
            }
            else message.error("일정추가오류");
        })
    }

    // 휴가 종류값에 따른 태그색상 변경
    const ChangeTagColor = (props) => {
        let thisColor = "";
        if (props.value === "연차") thisColor = "magenta";
        else if (props.value === "오전반차") thisColor = "gold";
        else if (props.value === "오후반차") thisColor = "green";
        else if (props.value === "출장") thisColor = "lime";
        else if (props.value === "외근") thisColor = "volcano";
        else if (props.value === "병가") thisColor = "cyan";
        else if (props.value === "경조휴가") thisColor = "geekblue";

        return (
            <>
                <Tag style={{ fontSize: '10px' }} color={thisColor}>{props.value}</Tag>
            </>
        )
    }

    // 이번주 타임라인 목록 가져오기
    const GetThisWeekTimeline = () => {

        const thisWeekList = timelineThisWeekList;

        return (
            <>
                {
                    thisWeekList.length !== 0 ? thisWeekList.map((e) =>
                        <p className="hoverable" onClick={openTimelineUpdateModal}>
                            <span style={{ fontSize: '12px', marginRight: '5px' }}>{moment(e.leave_start).format('YYYY-MM-DD ddd')}</span>
                            <ChangeTagColor value={e.leave_type} />
                            <span>{e.username}</span>
                        </p>) : <p><span>일정없음</span></p>
                }
            </>
        )
    }

    // 다음주 타임라인 목록 가져오기
    const GetNextWeekTimeline = () => {

        const nextWeekList = timelineNextWeekList;

        return (
            <>
                {
                    nextWeekList.length !== 0 ? nextWeekList.map((e) =>
                        <p className="hoverable" value={e.idx} onClick={openTimelineUpdateModal}>
                            <span style={{ fontSize: '12px', marginRight: '5px' }}>{moment(e.leave_start).format('YYYY-MM-DD ddd')}</span>
                            <ChangeTagColor value={e.leave_type} />
                            <span>{e.username}</span>
                        </p>) : <p><span>일정없음</span></p>
                }
            </>
        )
    }


    return (
        <Layout style={{ flexDirection: 'row' }}>
            <div>
                {/* 이벤트 타임라인 */}
                <Card style={{
                    margin: '16px 0 0 16px',
                    width: '300px',
                    height: '400px',
                    borderRadius: '10px',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
                }}>
                    <div>
                        <SmileTwoTone style={{ fontSize: '25px', color: '#08c', float: 'left' }} />
                        <Text strong style={{ marginLeft: '5px', fontSize: '16px' }}>이벤트 타임라인 </Text>
                    </div>

                    <Timeline style={{ marginTop: '20px', marginBottom: '20px', paddingTop: '5px', paddingLeft: '7px', overflow: 'auto', width: '100%', height: '260px' }}>
                        {/* 이번주 이벤트 */}
                        <Timeline.Item color="green"><Text strong>이번주 일정</Text>
                            <GetThisWeekTimeline />
                        </Timeline.Item>
                        {/* 다음주 이벤트 */}
                        <Timeline.Item color="gray" style={{ color: 'grey' }}>다음주 일정
                            <GetNextWeekTimeline />
                        </Timeline.Item>
                    </Timeline>
                    <Button
                        type="dashed"
                        onClick={openTimelineModal}
                        style={{ width: '100%' }}
                        icon={<PlusOutlined />}
                    >
                        일정추가하기
                    </Button>
                </Card>
                {/* 새글 알림 */}
                <Card style={{
                    margin: '16px 0 0 16px',
                    width: '300px',
                    height: '49%',
                    borderRadius: '10px',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
                }}>
                    <div>
                        <FieldTimeOutlined style={{ fontSize: '25px', color: '#08c', float: 'left' }} />
                        <Text strong style={{ marginLeft: '5px', fontSize: '16px' }}>새 소식</Text><Badge count={
                            newBoardList.filter(e => moment(e.regist_date).format("YYYY-MM-DD") > moment().subtract(7, 'day').format("YYYY-MM-DD")).length
                        } offset={[5, -5]}></Badge>
                    </div>
                    {/* 새소식 데이터 받아오기 */}
                    <GetNewBoardList />
                    {/* <Link to={`/board_list/공지사항`}>
                        <Button
                            type="dashed"
                            style={{ width: '100%', marginTop: 16 }}
                        >
                            더보기
                        </Button>
                    </Link> */}
                </Card>
            </div>

            <Calendar style={{
                margin: '16px 16px 0 16px',
                width: 'calc(100% - 300px)',
                height: '98%',
                padding: '16px',
                borderRadius: '10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
            }}
                locale={locale}
                fullscreen={true}
                dateCellRender={dateCellRender}
                onSelect={onSelect}
            />

            {/* 등록팝업 */}
            <ReportRegisterModal display={registerModalOpen} close={closeRegisterModal} header={`${department} 일일 업무 보고`} insert={submitReport} loading={loading}>
                <div>
                    <Tag style={{ marginBottom: '5px' }}>작성자 : {userName}</Tag>
                    <Tag style={{ marginBottom: '5px' }}>작성일 : {selectDay.selectedValue.format('YYYY-MM-DD')}</Tag>
                </div>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #d9d9d9', backgroundColor: '#ededed' }}>금일 실적</th>
                            <th style={{ border: '1px solid #d9d9d9', backgroundColor: '#ededed' }}>익일 계획</th>
                        </tr>
                    </thead>
                </table>
                <TextArea style={{ height: '300px', width: '50%', resize: 'none' }} onChange={getReport} defaultValue={readBogo} name="today"></TextArea>
                <TextArea style={{ height: '300px', width: '50%', resize: 'none' }} onChange={getReport} defaultValue="◎" name="tomorrow"></TextArea>
            </ReportRegisterModal>

            {/* 수정팝업 */}
            <ReportUpdateModal display={updateModalOpen} close={closeUpdateModal} header={`${department} 일일 업무 보고`} update={updateReport} del={deleteReport} loading={loading}>
                <div>
                    <Tag style={{ marginBottom: '5px' }}>작성자 : {userName}</Tag>
                    <Tag style={{ marginBottom: '5px' }}>작성일 : {selectDay.selectedValue.format('YYYY-MM-DD')}</Tag>
                </div>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #d9d9d9', backgroundColor: '#ededed' }}>금일 실적</th>
                            <th style={{ border: '1px solid #d9d9d9', backgroundColor: '#ededed' }}>익일 계획</th>
                        </tr>
                    </thead>
                </table>
                <TextArea style={{ height: '300px', width: '50%', resize: 'none' }} onChange={getReport} defaultValue={dailyReportDetail.content} name="today"></TextArea>
                <TextArea style={{ height: '300px', width: '50%', resize: 'none' }} onChange={getReport} defaultValue={dailyReportDetail.plan} name="tomorrow"></TextArea>
            </ReportUpdateModal>

            {/* 조회팝업 */}
            <ReportViewModal display={viewModalOpen} close={closeViewModal} header={`${department} 일일 업무 보고`} day={selectDay.selectedValue.format('YYYY-MM-DD')}>
                <GetDetailReport />
            </ReportViewModal>

            {/* 타임라인 등록 팝업 */}
            <TimeLineRegisterModal display={timelineModalOpen} close={closeTimelineModal} insert={timelineRegisterHandler} loading={loading}>
                <div style={{ height: 32, marginBottom: 12 }}>
                    <span style={{ width: 40, height: 40, marginRight: 20 }}>유형선택</span>
                    {/* <Select mode="tags" style={{ width: '100%' }} placeholder="휴가유형선택" onChange={handleChange}>
                        {leaveTypechildren}
                    </Select> */}
                    {/* <Input placeholder="Borderless" bordered={false} /> */}
                    <Select defaultValue="연차" style={{ width: 200 }} onChange={leaveTypeHandler}>
                        <OptGroup label="기본">
                            <Option value="연차">연차</Option>
                            <Option value="오전반차">오전반차</Option>
                            <Option value="오후반차">오후반차</Option>
                        </OptGroup>
                        <OptGroup label="업무">
                            <Option value="출장">출장</Option>
                            <Option value="외근">외근</Option>
                        </OptGroup>
                        <OptGroup label="기타">
                            <Option value="병가">병가</Option>
                            <Option value="경조휴가">경조휴가</Option>
                        </OptGroup>
                    </Select>
                </div>
                <div style={{ height: 32, marginBottom: 12 }}>
                    {/* 휴가 종류에따라 날짜 데이터 당일인지 시작날짜와 끝날짜 넣을지 고민 */}
                    <span style={{ width: 40, height: 40, marginRight: 20 }}>날짜선택</span>
                    <RangePicker onChange={leaveDateHandler} />
                </div>
                {/* <div style={{height : 32 }}>
                    <span style={{ width : 40, height : 40, marginRight : 20 }}>잔여휴가일수</span>
                    <span>0개</span>
                </div> */}
            </TimeLineRegisterModal>
            {/* 타임라인 수정 팝업 */}
            <TimeLineUpdateModal display={timelineUpdateModalOpen} close={closeTimelineUpdateModal} update={timelineRegisterHandler} del={timelineRegisterHandler} loading={loading}>
                <div style={{ height: 32, marginBottom: 12 }}>
                    <span style={{ width: 40, height: 40, marginRight: 20 }}>유형선택</span>
                    {/* <Select mode="tags" style={{ width: '100%' }} placeholder="휴가유형선택" onChange={handleChange}>
                        {leaveTypechildren}
                    </Select> */}
                    {/* <Input placeholder="Borderless" bordered={false} /> */}
                    <Select defaultValue="연차" style={{ width: 200 }} onChange={leaveTypeHandler}>
                        <OptGroup label="기본">
                            <Option value="연차">연차</Option>
                            <Option value="오전반차">오전반차</Option>
                            <Option value="오후반차">오후반차</Option>
                        </OptGroup>
                        <OptGroup label="업무">
                            <Option value="출장">출장</Option>
                            <Option value="외근">외근</Option>
                        </OptGroup>
                        <OptGroup label="기타">
                            <Option value="병가">병가</Option>
                            <Option value="경조휴가">경조휴가</Option>
                        </OptGroup>
                    </Select>
                </div>
                <div style={{ height: 32, marginBottom: 12 }}>
                    {/* 휴가 종류에따라 날짜 데이터 당일인지 시작날짜와 끝날짜 넣을지 고민 */}
                    <span style={{ width: 40, height: 40, marginRight: 20 }}>날짜선택</span>
                    <RangePicker onChange={leaveDateHandler} />
                </div>
                {/* <div style={{height : 32 }}>
                    <span style={{ width : 40, height : 40, marginRight : 20 }}>잔여휴가일수</span>
                    <span>0개</span>
                </div> */}
            </TimeLineUpdateModal>
        </Layout>
    )
}

export default Auth(Home, true)