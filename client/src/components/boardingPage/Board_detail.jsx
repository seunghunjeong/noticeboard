/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom"
import ReactHtmlParser from 'react-html-parser';
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth'
import { saveAs } from 'file-saver';

import '../../App.css';
import 'antd/dist/antd.less';
import { Card, Layout, Button, Tag, Tabs, message, } from 'antd';
import { UnorderedListOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';

// codeblock
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// modal confirm
import confirmModal from '../modals/ConfirmModal_mobile';

function Board_detail() {
  // antd 변수
  const { Content } = Layout;
  const { TabPane } = Tabs;

  // 페이지 이동
  const navigate = useNavigate();

  //사용자 정보 받아오기
  const getUserData = useSelector(state => state.user.userData);
  const userId = getUserData === undefined ? null : getUserData.id;
  const isAdmin = getUserData === undefined ? null : getUserData.admin;

  const [BoardDetail, setBoardDetail] = useState([]);
  const [fileReady, setFileReady] = useState(false);

  // 게시판 idx 가져오기
  let { idx, category } = useParams();
  useEffect(() => {
    Axios.post('/board/api/getBoardDetail', { idx: idx })
      .then(response => {
        if (response.data) {
          setBoardDetail(response.data[0]);

          // codeblock 적용
          hljs.highlightAll();
        } else {
          message.error("상세페이지 불러오기 실패");
        }
      })
  }, []);

  //작성한 사람만 수정/삭제할 수 있도록
  //state안에있는 사용자 id와 게시판의 사용자 id값이 같은지 확인
  let userIdConfrim = userId === BoardDetail.userId ? true : false;
  if (isAdmin) {
    userIdConfrim = true;
  }

  // 수정
  const onGoUpdateHandler = () => {
     navigate(`/board_update/${BoardDetail.idx}/${category}`);
   }

/*   // 삭제
  const onBoardDeleteHandler = (event) => {
    event.preventDefault();

    const confirmAction = window.confirm("삭제하시겠습니까?");

    if (confirmAction) { //yes 선택
      Axios.post('/board/api/deleteBoard', {
        idx: idx,
        filePath: BoardDetail.file_path
      }).then(response => {
          if (response.data === "success") {
            message.success("삭제 완료");
            navigate(`/board_list/${category}`); //삭제 후 목록으로 이동
          } else {
            message.error("삭제 실패");
          }

      })
    }
    else {
      event.preventDefault();
    }
  } */

  // 목록으로 이동
  const onBoardGoHomeHandler = (event) => {
    event.preventDefault();

    navigate(`/board_list/${category}`);
  }

  //date format 수정
  let moment = require('moment');

  const fileDownloadHandler = () => {
    setFileReady(true);
    const filePath = BoardDetail.file_path;
    const fileName = BoardDetail.file_path.split("-real-");

    Axios.post('/board/api/fileDownload', {
      filePath: filePath,
      fileName: fileName[1]
    },
      {
        responseType: 'blob'
      })
      .then(response => {

        if(response.data === false){
          message.error("파일이 존재하지 않습니다.");
          return;
        }
        const oriFileName = BoardDetail.file_path.split("-real-");
        // const blob = new Blob([response.data]);
        // const link = document.createElement('a');
        // link.href = window.URL.createObjectURL(blob);
        // link.download = oriFileName[2];
        // link.click();
        saveAs(response.data, oriFileName[1]);
        setFileReady(false);
      })
  }

  const FilePath = () => {
    let fileName = BoardDetail.file_path;
    let fileNameArr = [];
    let fileExist = true;
    // 첨부파일 원본이름 표시
    if (fileName == null) {
      fileName = "첨부된 파일이 없습니다.";
      fileExist = false;
    } else {
      fileNameArr = fileName.split("-real-");
      fileName = fileNameArr[1];
    }

    return (
      fileReady ?
        <><LoadingOutlined /> 다운로드 준비중 입니다...</>
        : fileExist ?
          <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={fileDownloadHandler}>{fileName}</button>
          : fileName
    )

  }

    // confirm param object
    let confirmParam = {
      txt : '',
      action : ''
    }

    // action delete
    const delAction = () => {
      Axios.post('/board/api/deleteBoard', { 
        idx: idx ,
        filePath: BoardDetail.file_path
      }).then(response => {
          if (response.data === "success") {
            message.success("삭제 완료");
            navigate(`/board_list/${category}`); //삭제 후 목록으로 이동
          } else {
            message.error("삭제 실패");
          }
        })
    }
    
    // func confirm
    const onConfirmdel = () => {
      confirmParam.txt = '삭제';
      confirmParam.action = delAction;
      confirmModal(confirmParam);
    }

    const onConfirmup = () => {
      confirmParam.txt = '수정';
      confirmParam.action = onGoUpdateHandler;
      confirmModal(confirmParam);
    }
  
  //render
  return (
    <Content className='mainDetailContent' style={{ padding : '16px 16px 0'}}>
      <div style={{ marginBottom: '16px', position: 'relative', height: '32px' }}>
        <Tabs style={{ float: 'left' }} defaultActiveKey="2">
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
        {userIdConfrim ?  <div>
                              <Button style={{ float: 'right' }} type="primary" danger onClick={onConfirmdel}>삭제</Button>
                              <Button style={{ marginRight: '10px', float: 'right' }} type="primary" onClick={onConfirmup} icon={<EditOutlined />}>수정</Button>
                          </div>: null
        }
      </div>

      <Card style={{ width: '100%', height: '170px', boxShadow : 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}>
        <p className='title' style={{ fontSize: '30px', marginBottom: '16px' }}>{BoardDetail.title}</p>
        <p className='writer'>작성자 |
          <span style={{ fontWeight: 'bold' }}> {BoardDetail.writer}</span>
        </p>
        <p className='regist_date'>{moment(BoardDetail.regist_date).format('YYYY-MM-DD HH:mm')}</p>
      </Card>
      <Card style={{ width: '100%', boxShadow : 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}>
        <div style={{ width: '100%', position: 'relative', bottom: '0', left: '0'}}>
          {/* <Divider orientation="left" style={{ fontSize: '12px', fontWeight: 'bold' }}>첨부파일</Divider> */}
          첨부파일 :
          <Tag style={{ marginLeft: '10px' }}>
            <FilePath />
          </Tag>
        </div>
      </Card>
      <Card style={{ width: '100%', boxShadow : 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}>
        <div className='content'>
          {ReactHtmlParser(BoardDetail.content)}
        </div>
      </Card>
    </Content>
  )
}

export default Auth(Board_detail, null)   