import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios';

import 'antd/dist/antd.less';
import { Calendar, Badge, Tag, Divider, message } from 'antd';
import { PlusOutlined, EditOutlined,FormOutlined } from '@ant-design/icons';
import locale from "antd/es/calendar/locale/ko_KR";
import Modal from '../../components/modals/DailyReportPopup_mobile';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import ReportViewModal from '../modals/DailyReportView_mobile';
import MobileStyle from '../../App_mobile.module.css';

// 사용자 정보 가져오기
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth';

// modal confirm
import confirmModal from '../modals/ConfirmModal_mobile';

function Home() {

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userId = getUserData === undefined ? null : getUserData.id;
    const userName = getUserData === undefined ? null : getUserData.userName; 
    const isAuth = getUserData === undefined ? null : getUserData.isAuth;

    // dailyReport 정보 여기다가 사용자 정보 해주면 null이 들어간다.
    const [dailyReport, setDailyReport] = useState(
        {
            report: '◎',
            plan: '◎',
            regist_date: moment(Date.now()).format("YYYY-MM-DD")
        }
    );
    const [state, setState] = useState();
    
    // 일일보고 전체내용을 받기위한 state // 자기 자신것
    const [viewMyDailyReport, setViewMyDailyReport] = useState([]);
    const [viewDailyReport, setViewDailyReport] = useState([]);

    // 선택한 일일보고
    const [readBogoArr, setReadBogoArr] = useState();

    // 수정 확인
    const [updateBogoArr, setUpdateBogoArr] = useState({
        reportChk: false,
        planChk: false
    })

    // 로딩 여부
    const [loading, setLoading] = useState(false);

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
             report: '◎',
             plan: '◎'
         })

         setLoading(false);
     };
     const [viewModalOpen, setViewModalOpen] = useState(false);
     // 조회창 열고닫기
     const openViewModal = () => { setViewModalOpen(true); };
     const closeViewModal = () => {
         setViewModalOpen(false);
     };
 

    // 로그인한 사용자용 일보 가져오기
    useEffect(() => {
        Axios.get('/report/getMyReport', {
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
        Axios.get('/report/getReportDetail'
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

    // 클릭한 셀이 표시하는 일자를 받아옴
    const onSelect = value => {
        // 선택된 캘린더의 날짜 연월
        let valueY = value.format('YYYY');
        let valueM = value.format('MM');

        // 저장된 날짜 연월
        let dateArr = dailyReport.regist_date.split('-');

        let dateY = dateArr[0];
        let dateM = dateArr[1];
         
        // 등록일 저장
        setDailyReport({
            ...dailyReport,
            regist_date: value.format('YYYY-MM-DD')
        })
        
        // select 박스 이벤트 전파를 막기위한 조건문
        if(valueY === dateY && valueM === dateM){
            openViewModal();
        }
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
        setLoading(true);
        if (dailyReport.report === "◎") {
            message.warning("금일 실적을 입력해주세요");
            setLoading(false);
            return;
        }
        
        Axios.post('/report/insertM',
        {
            report: dailyReport.report,
            plan: dailyReport.plan,
            writer: userName,
            regist_date: dailyReport.regist_date,
            id: userId
        }
        ).then(() => {
            message.success('일일보고가 작성되었습니다.');
            closeModal();
            setState('insert');
        })
    }

    const updateReport = () => {
        setLoading(true);
        if (dailyReport.report === "◎") {
            message.warning("금일 실적을 입력해주세요.");
            setLoading(false);
            return;
        }

        Axios.post('/report/updateM', {
            idx: readBogoArr.idx,
            report: updateBogoArr ? dailyReport.report : readBogoArr.report,
            plan : updateBogoArr ? dailyReport.plan : readBogoArr.plan,
            date: dailyReport.regist_date
        }).then(() => {
            message.success("수정완료");
            closeModal();
            setState("update");
        })
    }

    // confirm param object
    let confirmParam = {
        txt : '',
        action : ''
    }

    const deleteReport = () => {
        const delAction = () => Axios.post('/report/delete', {
            idx: readBogoArr.idx,
        }).then(() => {
            message.success("삭제완료");
            closeModal();
            setState("delete");
        })
        
        confirmParam.txt = '삭제';
        confirmParam.action = delAction;
        confirmModal(confirmParam);
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
        return resultTxt ? resultTxt[0].report : '◎'
    }
    
    // 익일 계획 읽기
    const readPlan = () => {
        const resultTxt = filterBogo();
        return resultTxt ? resultTxt[0].plan : '◎'
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
                height: 'calc(80vh)',
                padding : '10px'
            }}
                locale={locale}
                fullscreen={true}
                dateCellRender={dateCellRender}
                onSelect={onSelect}
            />
            <Modal state={state} display={modalOpen} close={closeModal} header="일일 보고" insert={insertBogo} update={updateReport} del={deleteReport} loading={loading}>
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