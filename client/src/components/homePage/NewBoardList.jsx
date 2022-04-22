import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { Link } from "react-router-dom"
import Auth from '../../_hoc/auth'

import {
 Card, Typography, Badge
} from 'antd';
import {
 FieldTimeOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.less';
import moment from 'moment';

// antd variable
const { Text } = Typography;

function NewBoardList() {

    //새글 알림
    const [newBoardList, setNewBoardList] = useState([]);

    useEffect(() => {
        // 새 글 목록 가져오기
        Axios.get('/home/getNewBoardList').then((res) => {
            setNewBoardList(res.data);
        })

    }, [])

    // 새 글 목록 가져오기
    const GetNewBoardList = () => {

        const newBoard = newBoardList;
        //최근 7일 이내 게시글 전체
        const recent7days = newBoard.filter(e => moment(e.regist_date).format("YYYY-MM-DD") > moment().subtract(7, 'day').format("YYYY-MM-DD"));
        //최근 7일 이내 게시글 중에서 3개만 추출
        //const recent3contents = recent7days.filter((e, index) => index < 3);
        //console.log(recent3contents.length)
        return (
            <div style={{height : 325, overflow : 'auto'}}>
                {
                    recent7days.length > 0 ?
                        recent7days.map((e) =>
                          
                            <Link to={`/board_detail/${e.idx}/${e.category}`} key={e.idx}>
                                <Card hoverable="true"
                                    title={e.title} type="inner"
                                    style={{ width: '100%', marginBottom: 20 }} className="newBoardCard">
                                    <span style={{ fontSize: '12px', color: 'grey' }}>게시판 : {e.category}</span>
                                    <span style={{ fontSize: '12px', color: 'grey', marginLeft: 10 }}>작성일 : {moment(e.regist_date).format('YYYY-MM-DD')}</span>
                                </Card>
                            </Link>
                          
                        )
                        :
                        <p style={{ textAlign: "center", color: "grey", lineHeight: 20 }}>새 소식 없음</p>
                }
            </div>
        )
    }

    return (
        <div>
            {/* 새글 알림 */}
            <Card style={{
                margin: '16px 0 0 16px',
                width: '300px',
                height: '48.5%',
                borderRadius: '10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
            }}>
                <div style={{ marginBottom : 16}}>
                    <FieldTimeOutlined style={{ fontSize: '25px', color: '#08c', float: 'left' }} />
                    <Text strong style={{ marginLeft: 5, marginBottom : 16, fontSize: '16px' }}>새 소식</Text><Badge count={
                        newBoardList.filter(e => moment(e.regist_date).format("YYYY-MM-DD") > moment().subtract(7, 'day').format("YYYY-MM-DD")).length
                    } offset={[5, -5]}></Badge>
                </div>
                {/* 새소식 데이터 받아오기 */}
                <GetNewBoardList />
            </Card>
        </div>
    )
}

export default Auth(NewBoardList, true)