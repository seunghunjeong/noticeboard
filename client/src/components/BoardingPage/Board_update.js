import React from 'react'
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "antd";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@ckeditor/ckeditor5-build-classic';

function Board_update() {

  const asd = Editor.defaultConfig;

  const [BoardContent, setBoardContent] = useState({});

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
    setBoardContent({
      ...BoardContent,
      title: event.target.value
    })
  }

  // 이벤트 후 경로 이동할때 사용하는 hooks
  const navigate = useNavigate();  

  // 수정 버튼클릭시
  const onBoardUpdateHandler = (event) => {
    
    const title = BoardContent.title;
    const content = BoardContent.content;

    if(title === ""){
      alert('제목을 입력해주세요.');
      return;
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

  //render
  return (
    <div>
      <div className='form-wrapper'>
        <input type='text' placeholder='제목을 입력해주세요.' onChange={getValue} name='title' value={BoardContent.title} />
        <CKEditor
          editor = {Editor} data = {BoardContent.content}
          onChange = {(event, editor) => {
            const data = editor.getData();
            setBoardContent({
              ...BoardContent,
              content: data
            })
          }}
        />
      <Button type="primary" onClick = {onBoardUpdateHandler}>수정</Button>
      </div>
    </div>
  )
}

export default Board_update