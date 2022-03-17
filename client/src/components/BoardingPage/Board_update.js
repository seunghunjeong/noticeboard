import React from 'react'
import Axios from 'axios';
import { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { Button } from "antd";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@ckeditor/ckeditor5-build-classic';

function Board_update() {

  const asd = Editor.defaultConfig;
  const [boardContent, setBoardContent] = useState({
    title: '',
    content: ''
  })

   // 에디터에서 입력값 받아오는 함수
  const getValue = e => {
    const {name, value} = e.target;
    setBoardContent({
      ...boardContent,
      [name]: value
    })
  }
  // 이벤트 후 경로 이동할때 사용하는 hooks
  const navigate = useNavigate();  
  // 입력버튼
  const submitBoard = () => {
    const title = boardContent.title;
    const content = boardContent.content;
  
    

    if(title === ""){
      alert('제목을 입력해주세요.');
      return;
    }

    Axios.post('http://localhost:8000/api/insert', {
      title: title,
      content: content
    }).then(()=>{
      navigate('/board_list');
      alert('등록완료');
    })
  };

  //render
  return (
    <div>
      <div className='form-wrapper'>
        <input type='text' placeholder='제목' onChange={getValue} name='title' />
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
      <button variant="contained"
        onClick={submitBoard}
      >입력</button>
      </div>
    </div>
  )
}

export default Board_update