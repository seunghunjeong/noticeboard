import React from 'react'
import Axios from 'axios';
import { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { Button } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@ckeditor/ckeditor5-build-classic';
import { EditOutlined } from '@ant-design/icons';

function Board_register() {

  Editor
    .create( document.querySelector( '#editor' ),{
      codeBlock: {
        languages: [
            // Do not render the CSS class for the plain text code blocks.
            { language: 'plaintext', label: 'Plain text', class: '' },

            // Use the "php-code" class for PHP code blocks.
            { language: 'php', label: 'PHP', class: 'php-code' },

            // Use the "js" class for JavaScript code blocks.
            // Note that only the first ("js") class will determine the language of the block when loading data.
            { language: 'javascript', label: 'JavaScript', class: 'js javascript js-code' },

            // Python code blocks will have the default "language-python" CSS class.
            { language: 'python', label: 'Python' }
        ]
      } 
    })
    .then( editor => {
        console.log( editor );
    })
    .catch( error => {
        console.error( error );
    });


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
      <Button style={{  margin : '16px 0', float: 'right' }} type="primary" icon={<EditOutlined />} 
        onClick={submitBoard}
      >등록</Button>
      </div>
    </div>
  )
}

export default Board_register