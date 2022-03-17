/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useEffect, useState } from 'react';
import Axios from 'axios';
import 'antd/dist/antd.less';
import '../../App.css';
import { Card, Layout, Divider, Button, Tag, Tabs } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate, Link, useParams  } from "react-router-dom"
import ReactHtmlParser from 'react-html-parser';

function Board_detail() {
  // antd 변수
  const { Content } = Layout;
  const { TabPane } = Tabs;

  const [BoardDetail, setBoardDetail] = useState([]);
  const parser = require('html-react-parser');

  // 게시판 idx 가져오기
  let {idx} = useParams();

  useEffect(() => {
    Axios.post('http://localhost:8000/api/getBoardDetail', {id : idx})
    .then(response => {
        if(response.data){
          setBoardDetail(response.data[0])
        } else {
          alert("상세페이지 불러오기 실패");
        } 

    })
  }, []);

  const html = BoardDetail.content;

   // 페이지 이동
   const navigate = useNavigate();
   const onBoardUpdateHandler = (event) => {
     event.preventDefault();
 
     navigate("/");//board_update router로 이동
   }

  //date format 수정
  let moment =  require('moment');

  //render
  return (

    <Content style={{ margin : '16px', height : '100%' }}>
      <div style={{marginBottom : '16px', position : 'relative', height : '32px' }}>
        <Tabs style={{ float : 'left' }} defaultActiveKey="2">
          <TabPane
            tab={
              <span onClick={onBoardUpdateHandler}>
                <UnorderedListOutlined />
                목록
              </span>
            }
            key="1"
            >  
          </TabPane>
        </Tabs>
        <Button style={{ float : 'right' }} type="primary" danger onClick={onBoardUpdateHandler}>삭제</Button>
        <Button style={{ marginRight : '10px', float : 'right' }} type="primary" onClick={onBoardUpdateHandler}>수정</Button>
      </div>
      
      <Card style={{ width: '100%' }}>
        <p className='title' style={{ fontSize : '50px' }}>{BoardDetail.title}</p>
        <p className='writer'>{BoardDetail.writer}</p>
        <p className='regist_date'>{moment(BoardDetail.regist_date).format('YYYY-MM-DD. HH:mm')}</p>
      </Card>
      <Card style={{ width: '100%', minHeight : '400px'}}>
        <div className='content'>{ReactHtmlParser(BoardDetail.content)}</div>
      </Card>
    </Content>
  )
}

export default Board_detail