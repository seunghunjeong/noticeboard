import React from 'react'
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Layout, Button, Input, Tabs, Tag } from 'antd';
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@ckeditor/ckeditor5-build-classic';

function Board_update() {

  // antd 변수
  const { Content } = Layout;
  const { TabPane } = Tabs;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState("");

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };
  

  // idx 가져오기
  let {idx} = useParams();
  useEffect(() => {
    Axios.post('http://localhost:8000/api/getBoardDetail', {idx : idx})
    .then(response => {
        if(response.data){
          //setBoardContent(response.data[0])
          setTitle(response.data[0].title);
          setContent(response.data[0].content);
        } else {
          alert("상세페이지 불러오기 실패");
        } 
    })
  }, []); 

  // 에디터에서 입력값 받아오는 함수
  const getTitleValue = (event) => {
    setTitle(event.currentTarget.value)  
  }

  // 이벤트 후 경로 이동할때 사용하는 hooks
  const navigate = useNavigate();  

  // 수정 버튼클릭시
  const onBoardUpdateHandler = (event) => {
    let formData = new FormData();
    let updateTitle = title;
    let updateContent = content;

    if(updateTitle === ""){
      alert('제목을 입력해주세요.');
      return;
    }
    else if(updateContent === ""){
      updateContent = "내용없음";
    }

    if(selectedFiles) {
      for (const key of Object.keys(selectedFiles)) {
        formData.append('file', selectedFiles[key]);
      }
    }
    const confirmAction = window.confirm("해당 게시글을 수정 하시겠습니까?");

    formData.append('title', updateTitle);
    formData.append('content', updateContent);   
    formData.append('idx', idx);   

    if(confirmAction){ //yes 선택
      console.log(updateContent)
      Axios.post('http://localhost:8000/api/updateBoard', formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then(() => {
        navigate('/board_list');
        alert('수정완료');
      })
    } else {
      event.preventDefault();
    }
  };

  // 목록으로 이동
  const onBoardGoHomeHandler = (event) => {
    event.preventDefault();

    navigate("/board_list");
  }

  // 첨부 파일 삭제
  // function preventDefault(e) {
  //   e.preventDefault();
  //   console.log('Clicked! But prevent default.');
  // }
  
  //render
  return (
    <Content style={{ margin : '16px 16px 0 16px', height : 'calc(100% - 134px)' }}>
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
        <Button style={{ float : 'right' }} type="primary" danger onClick={onBoardGoHomeHandler}>취소</Button>
        <Button style={{ marginRight : '10px', float : 'right' }} type="primary" onClick={onBoardUpdateHandler} icon={<EditOutlined />}>수정</Button>
      </div>

      <Card style={{ width: '100%', height : 'calc(100% - 140px)' }} >
        <Input maxLength={20} placeholder='제목을 입력해주세요.' onChange={getTitleValue} name='title' value={title} style={{ fontSize : '30px', marginBottom : '16px'}}/>
        <CKEditor
          editor = {Editor} data = {content}
          onChange = {(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />
      </Card>
      <Card style={{ width: '100%', height : '80px'}}>
        첨부파일 : 
        {/* <Tag style={{ marginLeft : '10px'}} closable onClose={preventDefault}>
          파일이름
        </Tag> */}
        <label style={{ marginLeft : '10px'}} className="btn btn-default">
          <input type="file" onChange={selectFile} multiple />
        </label>
      </Card>
    </Content>

  )
}

export default Board_update