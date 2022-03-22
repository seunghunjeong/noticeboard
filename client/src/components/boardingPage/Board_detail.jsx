/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useEffect, useState } from 'react';
import Axios from 'axios';
import 'antd/dist/antd.less';
import '../../App.css';
import { Card, Layout, Divider, Button, Tag, Tabs } from 'antd';
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from "react-router-dom"
import ReactHtmlParser from 'react-html-parser';

// codeblock
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

function Board_detail() {
  // antd 변수
  const { Content } = Layout;
  const { TabPane } = Tabs;

  const [BoardDetail, setBoardDetail] = useState([]);

  // 게시판 idx 가져오기
  let { idx } = useParams();
  useEffect(() => {
    Axios.post('http://localhost:8000/api/getBoardDetail', {idx : idx})
    .then(response => {
        if(response.data){
          setBoardDetail(response.data[0]);
         
        // codeblock 적용
        hljs.highlightAll();
        } else {
          alert("상세페이지 불러오기 실패");
        }
      })
  }, []);

   // 페이지 이동
   const navigate = useNavigate();
   // 수정
   const onGoUpdateHandler = (event) => {
     event.preventDefault();
 
     navigate("/board_update/" + BoardDetail.idx);
   }

  // 삭제
  const onBoardDeleteHandler = (event) => {
    event.preventDefault();

    const confirmAction = window.confirm("삭제하시겠습니까?");

    if (confirmAction) { //yes 선택
      Axios.post('http://localhost:8000/api/deleteBoard', { 
        idx: idx ,
        filePath: BoardDetail.file_path
      }).then(response => {
          if (response.data === "success") {
            alert("삭제 완료");
            navigate("/board_list"); //삭제 후 목록으로 이동
          } else {
            alert("삭제 실패");
          }

        })
    }
    else {
      event.preventDefault();
    }
  }

  // 목록으로 이동
  const onBoardGoHomeHandler = (event) => {
    event.preventDefault();

    navigate("/board_list");
  }

  //date format 수정
  let moment = require('moment');
 
  const fileDownloadHandler = () => {
    const filePath = BoardDetail.file_path;
    let fileName;
    let fileNameArr = [];
      
    fileNameArr = filePath.split("\\");
    fileName = fileNameArr[2];
    
    Axios.post('http://localhost:8000/api/fileDownload', {
      filePath: filePath,
      fileName: fileName
    },
    )
      .then (response => {
        console.log(response);

        if(response.data === false){
          alert("파일이 존재하지 않습니다.");
          return;
        }

        const oriFileName = BoardDetail.file_path.split("\\");
        const blob = new Blob([response.data]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = oriFileName[2];
        link.click();
      })
  }
  
  const FilePath = () => {
    let fileName = BoardDetail.file_path;
    console.log(BoardDetail);
    let fileNameArr = [];
    // 첨부파일 원본이름 표시
    if (fileName == null) {
      fileName = "첨부된 파일이 없습니다.";
    } else {
      fileNameArr = fileName.split("\\");
      fileName = fileNameArr[2];
    }

    return <button style={{border:'none', background:'none', cursor:'pointer'}} onClick={fileDownloadHandler}>{fileName}</button>

  }


  //render
  return (
    <Content style={{ margin : '16px', height : '100%' }}>
      <div style={{marginBottom : '16px', position : 'relative', height : '32px' }}>
        <Tabs style={{ float : 'left' }} defaultActiveKey="2">
          <TabPane
            tab={
              <span onClick={onBoardGoHomeHandler}>
                <UnorderedListOutlined />
                목록으로
              </span>
            }
            key="1"
          >
          </TabPane>
        </Tabs>
        <Button style={{ float: 'right' }} type="primary" danger onClick={onBoardDeleteHandler}>삭제</Button>
        <Button style={{ marginRight: '10px', float: 'right' }} type="primary" onClick={onGoUpdateHandler} icon={<EditOutlined />}>수정</Button>
      </div>

      <Card style={{ width: '100%', height: '170px' }}>
        <p className='title' style={{ fontSize: '30px', marginBottom: '16px' }}>{BoardDetail.title}</p>
        <p className='writer'>작성자
          <Divider type="vertical" />
          <span style={{ fontWeight: 'bold' }}>{BoardDetail.writer}</span>
        </p>
        <p className='regist_date'>{moment(BoardDetail.regist_date).format('YYYY-MM-DD HH:mm')}</p>
      </Card>
      <Card style={{ width: '100%', height : '70%'}}>
        <div  className='content'>
            {ReactHtmlParser(BoardDetail.content)}
        </div>
        <div style={{ width: '100%', height: '100px', position: 'absolute', bottom: '0', left: '0' }}>
          <Divider orientation="left" style={{ fontSize: '12px', fontWeight: 'bold' }}>첨부파일</Divider>
          <Tag style={{ marginLeft: '10px' }}>
            <FilePath/>
          </Tag>
        </div>
      </Card>
    </Content>
  )
}

export default Board_detail