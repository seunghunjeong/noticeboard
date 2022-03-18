import React from 'react'
import Axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "antd";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@ckeditor/ckeditor5-build-classic';
import { EditOutlined } from '@ant-design/icons';

function Board_register() {

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

    if(selectedFiles) {
      for (const key of Object.keys(selectedFiles)) {
        formData.append('file', selectedFiles[key]);
      }
    }

    formData.append('title', title);
    formData.append('content',content);   
   
    Axios.post('http://localhost:8000/api/insert',formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(() => {
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

        <div className="form-group">
          <label className="btn btn-default">
            <input type="file" onChange={selectFile} multiple />
          </label>
        </div>
        
        <Button style={{ margin: '16px 0', float: 'right' }} type="primary"
          icon={<EditOutlined />}
          onClick={() => {
            submitBoard()
          }}
        >등록</Button>
      </div>
    </div>
  )
}






export default Board_register



