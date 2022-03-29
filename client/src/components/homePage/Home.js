import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios';
import { Calendar, Button, Tag } from 'antd';
import { PlusSquareOutlined, EditOutlined, BarsOutlined, CheckOutlined } from '@ant-design/icons';
import 'antd/dist/antd.less';
import locale from "antd/es/calendar/locale/ko_KR";
import ReportRegisterModal from '../modals/DailyReportRegister';
import ReportUpdateModal from '../modals/DailyReportUpdate';
import ReportViewModal from '../modals/DailyReportView';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import '../../App.css';
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth'

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
    // modal opne, close 를 위한 상태값을 보관하는 state
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    // 등록창 열고닫기
    const openRegisterModal = () => { setRegisterModalOpen(true); };
    const closeRegisterModal = () => { setRegisterModalOpen(false); setReport({ today: '', tomorrow: '' }); };
    // 수정창 열고닫기
    const openUpdateModal = () => { setUpdateModalOpen(true); };
    const closeUpdateModal = () => { setUpdateModalOpen(false); setReport({ today: '', tomorrow: '' }); };
    // 조회창 열고닫기
    const openViewModal = () => { setViewModalOpen(true); GetDetailReport(); };
    const closeViewModal = () => { setViewModalOpen(false); setReport({ today: '', tomorrow: '' }); };

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userId = getUserData === undefined ? null : getUserData.id;
    const userName = getUserData === undefined ? null : getUserData.userName;

    // 자신이 작성한 전체 일일보고 받아오기
    useEffect(() => {
        const id = userId;
        Axios.get('/report/getMyReport', {
            params: {
                id: id
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
                            <>
                                <CheckOutlined style={{ color: 'green', marginRight: '5px' }} /><Button className="bogo_update" onClick={openUpdateModal}><EditOutlined /></Button>
                            </>
                            : <Button className="bogo_register" onClick={openRegisterModal}><PlusSquareOutlined /></Button>
                    }
                    <Button className="bogo_view" onClick={openViewModal}><BarsOutlined /></Button>
                </li>
                {listData.map(item => (
                    <li key={"report" + item.idx}>
                        <pre style={{fontFamily: 'inherit'}}>
                            {item.content}
                        </pre>
                    </li>
                ))}
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
            alert("내용을 입력해주세요.");
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
            alert("등록완료");
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
            alert("내용을 입력해주세요");
            return;
        }
        Axios.post('/report/update', {
            idx: dailyReportDetail.idx,
            content: report.today,
            plan: report.tomorrow,
            date: dailyReportDetail.date
        }).then((res) => {
            alert("수정완료");
            closeUpdateModal();
            setReport({ today: '', tomorrow: '' });
            setState(res);
            setLoading(false);
        })

    }
    // 보고 삭제
    const deleteReport = () => {
        const confirmAction = window.confirm("삭제하시겠습니까?");
        
        if (confirmAction) { //yes 선택
            setLoading(true);
            Axios.post('/report/delete', {
                idx: dailyReportDetail.idx,
            }).then((res) => {
                alert("삭제완료");
                closeUpdateModal();
                setReport({ today: '', tomorrow: '' });
                setState(res);
                setLoading(false);
            })
        }
    }

    // 일일보고 상세보기
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
                dateCellRender={dateCellRender}
                onSelect={onSelect}
            />

            {/* 등록팝업 */}
            <ReportRegisterModal display={registerModalOpen} close={closeRegisterModal} header="ICT 사업부 일일 업무 보고" insert={submitReport} loading={loading}>
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
                <TextArea style={{ height: '300px', width: '50%', resize: 'none' }} onChange={getReport} defaultValue="◎" name="today"></TextArea>
                <TextArea style={{ height: '300px', width: '50%', resize: 'none' }} onChange={getReport} defaultValue="◎" name="tomorrow"></TextArea>
            </ReportRegisterModal>

            {/* 수정팝업 */}
            <ReportUpdateModal display={updateModalOpen} close={closeUpdateModal} header="ICT 사업부 일일 업무 보고" update={updateReport} del={deleteReport} loading={loading}>
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
            <ReportViewModal display={viewModalOpen} close={closeViewModal} header="ICT 사업부 일일 업무 보고" day={selectDay.selectedValue.format('YYYY-MM-DD')}>
                <GetDetailReport />
            </ReportViewModal>

        </Fragment>
    )
}

export default Auth(Home, true)