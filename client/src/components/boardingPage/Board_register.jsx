import React from 'react'
import Axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Layout, Button, Input, Tabs, Divider } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@ckeditor/ckeditor5-build-classic';
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons';


function Board_register() {
  const { Content } = Layout;
  const { TabPane } = Tabs;
  const [selectedFiles, setSelectedFiles] = useState(undefined);

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };


  const [boardContent, setBoardContent] = useState({
    title: '',
    content: ''
  })

  // 에디터에서 입력값 받아오는 함수
  const getValue = e => {
    const { name, value } = e.target;
    setBoardContent({
      ...boardContent,
      [name]: value
    })
  }


  // 이벤트 후 경로 이동할때 사용하는 hooks
  const navigate = useNavigate();
  // 입력버튼
  const submitBoard = () => {
    let formData = new FormData();
    let content = boardContent.content;
    const title = boardContent.title;

    if (title === "") {
      alert('제목을 입력해주세요.');
      return;
    }
    else if (content === "") {
      content = "내용없음";
    }

    if (selectedFiles) {
      for (const key of Object.keys(selectedFiles)) {
        formData.append('file', selectedFiles[key]);
      }
    }

    formData.append('title', title);
    formData.append('content', content);

    Axios.post('http://localhost:8000/api/insert', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(() => {
      navigate('/board_list');
      alert('등록완료');
    })
  };


  const onBoardGoHomeHandler = (event) => {
    event.preventDefault();

    navigate("/board_list");
  }


  return (
    <div>
      <Content style={{ margin: '16px 16px 0 16px', height: '100%' }}>
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
          <Button style={{ float: 'right' }} type="primary" danger onClick={onBoardGoHomeHandler}>취소</Button>
          <Button style={{ marginRight: '10px', float: 'right' }} type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              submitBoard()
            }}
          >등록</Button>
        </div>
        <Card>
          <Input maxLength={20} placeholder='제목을 입력해주세요.' onChange={getValue} name='title' style={{ fontSize: '30px', marginBottom: '16px' }} />
          <CKEditor
            editor={Editor}
            data=""
            onChange={(event, editor) => {
              const data = editor.getData();
              setBoardContent({
                ...boardContent,
                content: data
              })
            }}
          />
          <Divider orientation="left" style={{ fontSize: '12px', fontWeight: 'bold' }}>첨부파일</Divider>
          <input type="file" onChange={selectFile} />
        </Card>
      </Content>
    </div>
  )
}






export default Board_register



