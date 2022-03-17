import React from 'react'
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Layout, Divider, Button, Input, Tabs } from 'antd';
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@ckeditor/ckeditor5-build-classic';

function Board_update() {
  // antd 변수
  const { Content } = Layout;
  const { TabPane } = Tabs;

  const [BoardContent, setBoardContent] = useState({});
  const [BoardUpdateContent, setBoardUpdateContent] = useState({});

  // idx 가져오기
  let {idx} = useParams();

  useEffect(() => {
    Axios.post('http://localhost:8000/api/getBoardDetail', {idx : idx})
    .then(response => {
        if(response.data){
          setBoardContent(response.data[0])
        } else {
          alert("상세페이지 불러오기 실패");
        } 
    })
  }, []);

  // 에디터에서 입력값 받아오는 함수
  const getValue = (event) => {

    const {name, value} = event.target;

    setBoardUpdateContent({
      ...BoardUpdateContent,
      [name]: value
    })
  }

  // 이벤트 후 경로 이동할때 사용하는 hooks
  const navigate = useNavigate();  

  // 수정 버튼클릭시
  const onBoardUpdateHandler = (event) => {
    
    const title = BoardUpdateContent.title;
    let content = BoardUpdateContent.content;

    if(title === ""){
      alert('제목을 입력해주세요.');
      return;
    }
    else if(content === ""){
      content = "내용없음";
    }

    const confirmAction = window.confirm("해당 게시글을 수정 하시겠습니까?");

    if(confirmAction){ //yes 선택
      Axios.post('http://localhost:8000/api/updateBoard', {
        title : title,
        content: content,
        idx : idx
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

    navigate("/");
  }

  //CKeditor 커스텀

  
  //render
  return (
    <Content style={{ margin : '16px 16px 0 16px', height : '100%' }}>
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

      <Card>
        <Input maxLength={20} placeholder='제목을 입력해주세요.' onChange={getValue} name='title' value={BoardContent.title} style={{ fontSize : '30px', marginBottom : '16px'}}/>
        <CKEditor
          editor = {Editor} data = {BoardContent.content}
          onChange = {(event, editor) => {
            const data = editor.getData();
            setBoardUpdateContent({
              ...BoardUpdateContent,
              content: data
            })
          }}
        />
      </Card>
    </Content>

  )
}

export default Board_update