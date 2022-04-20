import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth'

import '../../App.css';
import {
    Select, DatePicker, Button,
    Tag, message, Card, Typography, Layout, Timeline
} from 'antd';
import {
    SmileTwoTone, PlusOutlined 
} from '@ant-design/icons';
import 'antd/dist/antd.less';
import TimeLineRegisterModal from '../modals/TimelineRegister';
import TimeLineUpdateModal from '../modals/TimelineUpdate';
import moment from 'moment';
import 'moment/locale/ko'

// antd variable
const { Text } = Typography;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

function TimelineInfo() {
    // 로딩처리를 위한 state
    const [loading, setLoading] = useState(null);
    // 캘린더 셀 렌더링을 위한 state
    const [state, setState] = useState();
    //이번주 일정 타임라인
    const [timelineThisWeekList, setTimelineThisWeekList] = useState([]);
    //다음주 일정 타임라인
    const [timelineNextWeekList, setTimelineNextWeekList] = useState([]);

    // modal opne, close 를 위한 상태값을 보관하는 state
    const [timelineModalOpen, setTimelineModalOpen] = useState(false);
    const [timelineUpdateModalOpen, setTimelineUpdateModalOpen] = useState(false);

    // 타임라인 등록창 열고닫기
    const openTimelineModal = () => { setTimelineModalOpen(true); document.body.style.overflow = "hidden";};
    const closeTimelineModal = () => { setTimelineModalOpen(false);  document.body.style.overflow = "unset";};
    // 타임라인 수정창 열고닫기
    const openTimelineUpdateModal = () => { setTimelineUpdateModalOpen(true); document.body.style.overflow = "hidden";};
    const closeTimelineUpdateModal = () => { setTimelineUpdateModalOpen(false); document.body.style.overflow = "unset";};

    //사용자 정보 받아오기
    const getUserData = useSelector(state => state.user.userData);
    const userId = getUserData === undefined ? null : getUserData.id;
    const userName = getUserData === undefined ? null : getUserData.userName;
    const department = getUserData === undefined ? null : getUserData.department;

    useEffect(() => {
        //이번주/다음주 날짜 데이터 계산하기
        let this_monday = moment().day(1).format('YYYY-MM-DD');
        let this_sunday = moment().day(7).format('YYYY-MM-DD');
        let next_monday = moment().day(8).format('YYYY-MM-DD');
        let next_sunday = moment().day(14).format('YYYY-MM-DD');

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
            setTimelineModalOpen(false);
            setTimelineUpdateModalOpen(false);
        }

    }, [state, userId, department])

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
                <Tag style={{ fontSize: 11, padding: '0 2px' }} color={thisColor}>{props.value}</Tag>
            </>
        )
    }

    // 이번주 타임라인 목록 가져오기
    const GetThisWeekTimeline = () => {

        const thisWeekList = timelineThisWeekList;

        return (
            <>
                {
                    thisWeekList.length !== 0 ? thisWeekList.map((e, index) => {
                        const username = e.username.split(',');
                        const leave_type = e.leave_type.split(',');
                        const idx = e.idx.split(',');
                        return (
                            <>
                                <div key={"thisWeek" + e.leave_type}>
                                    <Timeline.Item color="green">
                                        <span style={{ fontSize: '12px', marginRight: '5px' }}>{moment(e.leave_start).format('MM.DD ddd')} </span>
                                        {
                                            username.map((e, index) =>
                                                <div key={"thisWeek" + idx[index]}>
                                                    <p className="hoverable" style={{ marginBottom: '0px' }} onClick={openTimelineUpdateModal} >
                                                        <ChangeTagColor value={leave_type[index]} />
                                                        <span>{username[index]}</span>
                                                    </p>
                                                </div>
                                            )
                                        }
                                    </Timeline.Item>
                                </div>
                            </>
                        )

                    })
                        :
                        <p><span>일정없음</span></p>
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
                    nextWeekList.length !== 0 ? nextWeekList.map((e, index) => {
                        const username = e.username.split(',');
                        const leave_type = e.leave_type.split(',');
                        const idx = e.idx.split(',');
                        return (
                            <>
                                <div key={"nextWeek" + e.leave_type}>
                                    <Timeline.Item color="gray">
                                        <span style={{ fontSize: '12px', marginRight: '5px' }}>{moment(e.leave_start).format('MM.DD ddd')} </span>
                                        {
                                            username.map((e, index) =>
                                                <div key={"nextWeek" + idx[index]}>
                                                    <p className="hoverable" style={{ marginBottom: '0px' }} onClick={openTimelineUpdateModal} >
                                                        <ChangeTagColor value={leave_type[index]} />
                                                        <span>{username[index]}</span>
                                                    </p>
                                                </div>
                                            )
                                        }
                                    </Timeline.Item>
                                </div>
                            </>
                        )

                    })
                        :
                        <p><span>일정없음</span></p>
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

                    <Timeline style={{ marginTop: '10px', marginBottom: '20px', paddingTop: '5px', paddingLeft: '7px', overflow: 'auto', width: '100%', height: '260px' }}>
                        {/* 이번주 이벤트 */}
                        <p style={{ marginBottom: '10px' }}><Text strong> 이번주 일정</Text></p>
                        <GetThisWeekTimeline />
                        {/* 다음주 이벤트 */}
                        <p style={{ marginTop: '10px', marginBottom: '10px' }}><Text strong style={{ color: 'grey' }}> 다음주 일정</Text></p>
                        <GetNextWeekTimeline />
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
            </div>

            

            {/* 타임라인 등록 팝업 */}
            <TimeLineRegisterModal display={timelineModalOpen} close={closeTimelineModal} insert={timelineRegisterHandler} loading={loading}>
                <div style={{ height: 32, marginBottom: 12 }}>
                    <span style={{ width: 40, height: 40, marginRight: 20 }}>유형선택</span>
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
            </TimeLineRegisterModal>
            {/* 타임라인 수정 팝업 */}
            <TimeLineUpdateModal display={timelineUpdateModalOpen} close={closeTimelineUpdateModal} update={timelineRegisterHandler} del={timelineRegisterHandler} loading={loading}>
                <div style={{ height: 32, marginBottom: 12 }}>
                    <span style={{ width: 40, height: 40, marginRight: 20 }}>유형선택</span>
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
            </TimeLineUpdateModal>
        </Layout>
    )
}

export default Auth(TimelineInfo, true)