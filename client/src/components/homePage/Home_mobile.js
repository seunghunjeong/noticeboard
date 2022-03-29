import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios';
import 'antd/dist/antd.less';
import { Calendar, Badge, Tag, Divider } from 'antd';
import { PlusOutlined, EditOutlined,FormOutlined } from '@ant-design/icons';
import locale from "antd/es/calendar/locale/ko_KR";
import Modal from '../../components/modals/DailyReportPopup_mobile';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import ReportViewModal from '../modals/DailyReportView';
import MobileStyle from '../../App_mobile.module.css';

// 사용자 정보 가져오기
import { useSelector } from 'react-redux';
import Auth from '../../hoc/auth'

function Home() {

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userId = getUserData === undefined ? null : getUserData.id;
    const userName = getUserData === undefined ? null : getUserData.userName; 
    const isAuth = getUserData === undefined ? null : getUserData.isAuth;

    // dailyReport 정보 여기다가 사용자 정보 해주면 null이 들어간다.
    const [dailyReport, setDailyReport] = useState(
        {
            id: '',
            writer: '',
            report: '',
            plan: '',
            regist_date: ''
        }
    );
    const [state, setState] = useState();
    
    // 일일보고 전체내용을 받기위한 state // 자기 자신것
    const [viewMyDailyReport, setViewMyDailyReport] = useState([]);
    const [viewDailyReport, setViewDailyReport] = useState([]);

    const [readBogoArr, setReadBogoArr] = useState();

    // 수정 확인
    const [updateBogoArr, setUpdateBogoArr] = useState({
        reportChk: false,
        planChk: false
    })


    // 로그인한 사용자용 일보 가져오기
    useEffect(() => {
        Axios.get('http://localhost:8000/report/getMyReport', {
            params: {
                id: userId
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
                        /* content: reportData[i].report, */
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
        const date = value.format("YYYY-MM-DD");

        return (
            <ul className='events'>
                {/* 데이터에 따른 버튼 변경 */}
                {listData.length === 0 ?
                    <PlusOutlined className={MobileStyle.bogo} onClick={openModal} state='insertModal' date={date}/>
                    : <EditOutlined className={MobileStyle.bogo} onClick={openModal} state='updateModal' date={date}/>}
                {listData.map(item => (
                    <li key={item.index}>
                        <Badge status={item.type} /* text={item.content} */ />
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
        // 이벤트 전파 방지
        e.stopPropagation();
        // 버튼에 저장한 날짜 가져오기.
        const date = e.currentTarget.getAttribute('date');
        // 등록일 저장
        setDailyReport({
            ...dailyReport,
            regist_date: date
        })
        setModalOpen(true);
        // 버튼 상태 가져오기
        setState(e.currentTarget.getAttribute('state'));
    };
    const closeModal = () => {
        setModalOpen(false);
        
        // 업데이트 확인 초기화
        setUpdateBogoArr({
            reportChk:false,
            planChk:false
        })
        
        // 일보 초기화
        setDailyReport({
            ...dailyReport,
            report: '@ ',
            plan: '@ '
        })
    };
    const [viewModalOpen, setViewModalOpen] = useState(false);
    // 조회창 열고닫기
    const openViewModal = () => { setViewModalOpen(true); };
    const closeViewModal = () => {
        setViewModalOpen(false);
    };

    // 클릭한 셀이 표시하는 일자를 받아옴
    const onSelect = value => {
        // 등록일 저장
        setDailyReport({
            ...dailyReport,
            regist_date: value.format('YYYY-MM-DD')
        })
        openViewModal();
    };

    // 일보 내용 저장
    const textAreaHandleChange = (event) => {
        const textAreaName = event.currentTarget.name;
        switch(textAreaName) {
            case 'today' :
                setDailyReport({
                    ...dailyReport,
                    report: event.target.value
                })
                setUpdateBogoArr({
                    ...updateBogoArr,
                    reportChk: true
                })
                break;
            case 'tomorrow' :         
                setDailyReport({
                    ...dailyReport,
                    plan: event.target.value
                })

                setUpdateBogoArr({
                    ...updateBogoArr,
                    planChk: true
                })
                break;
            default : 
            break;
        } 
    }

    // 일보 저장
    const insertBogo = () => {
        if (dailyReport.report === "@ ") {
            alert("금일 실적을 입력해주세요");
            return;
        }
        
        Axios.post('http://localhost:8000/report/insertM',
        {
            report: dailyReport.report,
            plan: dailyReport.plan,
            writer: userName,
            regist_date: dailyReport.regist_date,
            id: userId
        }
        ).then(() => {
            alert('일일보고가 작성되었습니다.');
            closeModal();
            setState('insert');
        })
    }

    const updateReport = () => {
        if (dailyReport.report === "@ ") {
            alert("금일 실적을 입력해주세요.");
            return;
        }

        Axios.post('http://localhost:8000/report/updateM', {
            idx: readBogoArr.idx,
            report: updateBogoArr ? dailyReport.report : readBogoArr.report,
            plan : updateBogoArr ? dailyReport.plan : readBogoArr.plan,
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

    // 일일보고 필터링
    const filterBogo = () => {
        if (state === 'updateModal') {
            return viewMyDailyReport.filter(
                (node) => moment(node.regist_date).format("YYYY-MM-DD") === dailyReport.regist_date
            )
        }
    }

    // 일보 읽기
    const readBogo = () => {
        const resultTxt = filterBogo();
        if (state === 'updateModal') {
            setReadBogoArr(resultTxt[0]);
            setDailyReport({
                ...dailyReport,
                report: resultTxt[0].report,
                plan: resultTxt[0].plan
            })
        }
        return resultTxt ? resultTxt[0].report : ' @'
    }
    
    // 익일 계획 읽기
    const readPlan = () => {
        const resultTxt = filterBogo();
        return resultTxt ? resultTxt[0].plan : ' @'
    }

    // 전체 보기
    const GetDetailReport = () => {

        const day = dailyReport.regist_date;
        let detailReportList = viewDailyReport;

        detailReportList = detailReportList.filter(
            (node) => moment(node.regist_date).format("YYYY-MM-DD") === day
        ) 

        const reportList = detailReportList.map((item) => (
            <tr key={item.idx}>
                <td className='writer'>{item.writer}</td>
                <td><pre>{item.report}</pre></td>
                <td><pre>{item.plan}</pre></td>
            </tr>
            
        ));

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
                        {reportList}
                    </tbody>
                </table>
                {/* {reportList} */}
            </>
        )
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
                <Tag style={{ marginBottom: '5px' }}>작성자 :{userName}</Tag>
                <Tag style={{ marginBottom: '5px' }}>작성일 :{dailyReport.regist_date}</Tag>
                <Divider orientation="left" orientationMargin={2} className={MobileStyle.bogoTxt}> 금일 실적 <FormOutlined /></Divider>
                <TextArea className={MobileStyle.bogoTxtArea} onChange={textAreaHandleChange} defaultValue={readBogo} name='today'></TextArea>
                <Divider orientation="left" orientationMargin={2} className={MobileStyle.bogoTxt}> 익일 계획 <FormOutlined /></Divider>
                <TextArea className={MobileStyle.bogoTxtArea} onChange={textAreaHandleChange} defaultValue={readPlan} name='tomorrow'></TextArea>
            </Modal>

            {/* 조회팝업 */}
            <ReportViewModal display={viewModalOpen} close={closeViewModal} header="ICT 사업부 일일 업무 보고" day={dailyReport.regist_date}>
                <GetDetailReport />
            </ReportViewModal>
        </Fragment>
    )
}

export default Auth(Home, true)