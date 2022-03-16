import React from 'react'
import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CodeBlock from '@ckeditor/ckeditor5-code-block';
import Axios from 'axios';

function Board_register() {

  const [boardContent, setBoardContent] = useState({
    title: '',
    content: ''
  })

  const getValue = e => {
    const {name, value} = e.target;
    setBoardContent({
      ...boardContent,
      [name]: value
    })
  }

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
      alert('등록완료');
    })
  };


  return (
    <div>
      <div className='form-wrapper'>
        <input type='text' placeholder='제목' onChange={getValue} name='title' />
        <CKEditor
          editor={ClassicEditor}
          
          data=""
          onChange={(event, editor) => {
            const data = editor.getData();
            setBoardContent({
              ...boardContent,
              content: data
            })
            //console.log(boardContent);
          }}
        />
      </div>
      <button
        onClick={submitBoard}
      >입력</button>
    </div>
  )
}

export default Board_register