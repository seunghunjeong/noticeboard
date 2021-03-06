import React, { useEffect, useState }  from 'react'
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Auth from '../../_hoc/auth'

import '../../App.css';
import { Card, Layout, Button, Input, Tabs, Divider, Tag, Select, message } from 'antd';
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@ckeditor/ckeditor5-build-classic';

// modal confirm
import confirmModal from '../modals/ConfirmModal_mobile';

function Board_update() {
  // antd 변수
  const { Content } = Layout;
  const { TabPane } = Tabs;
  const { Option } = Select;


  // idx 가져오기
  let { idx, category } = useParams();
  const [loading, setLoading] = useState(false);
  const [boardCategory, setBoardCategory] = useState([]);

  useEffect(() => {
    Axios.post('/nav/getCategory')
      .then((res) => {
        setBoardCategory(res.data);
      })
  }, []);

  const getCategory = e => {
    setBoardContent({
      ...boardContent,
      category: e
    })
    //console.log(boardContent)
  }

  const [boardContent, setBoardContent] = useState({});
  const [boardUpdateContent, setBoardUpdateContent] = useState({
    title: boardContent.title,
    content: boardContent.content,
    category: category
  });

  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [fileDeleteChk, setFileDeleteChk] = useState(false);

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  // 파일삭제 검사
  //let fileDeleteChk = false;
  const fileDeleteClick = () => {
    setFileDeleteChk(!fileDeleteChk)
  }


  useEffect(() => {
    Axios.post('/board/api/getBoardDetail', { idx: idx })
      .then(response => {
        if (response.data) {
          setBoardContent(response.data[0])
        } else {
          message.error("상세페이지 불러오기 실패");
        }
      })

  }, []);

  // 에디터에서 입력값 받아오는 함수
  const getTitleValue = (event) => {

    const { name, value } = event.target;

    setBoardUpdateContent({
      ...boardUpdateContent,
      [name]: value
    })
    setBoardContent({
      ...boardContent,
      [name]: value
    })
  }

  // 이벤트 후 경로 이동할때 사용하는 hooks
  const navigate = useNavigate();

  // 수정 버튼클릭시
  const onBoardUpdateHandler = (event) => {

    let formData = new FormData();
    let title = boardUpdateContent.title ?? boardContent.title;
    let content = boardUpdateContent.content;
    let category = boardContent.category ?? boardUpdateContent.category;
    if (title === "") {
      message.warning('제목을 입력해주세요.');
      return;
    }
    else if (content === "") {
      content = "내용없음";
    }
    
    //선택한 파일이 있다면 formdata 에 담음
    if (selectedFiles) {
      for (const key of Object.keys(selectedFiles)) {
        formData.append('file', selectedFiles[key]);
      }
      if (boardContent.file_path !== undefined) {
        formData.append('filePath', boardContent.file_path)
      }
    }

    // 선택한 파일이 없다면 , 기존에 있던 파일이름을 가져옴
    if (selectedFiles === undefined) {
      formData.append('filePath', boardContent.file_path);
    }
    formData.append('title', title);
    formData.append('content', content);
    formData.append('idx', idx);
    formData.append('deleteChk', fileDeleteChk);
    formData.append('category', category);
    formData.append('udt', 'udt');

    const upAction = () => {
      setLoading(true);
      Axios.post('/board/api/updateBoard', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then(() => {
        message.success('수정완료');
        setLoading(false);
        navigate(`/board_list/${category}`);
      })
    }

    // confirm param object
    let confirmParam = {
      txt : '수정',
      action : upAction
    }

    confirmModal(confirmParam);
  };

  // 목록으로 이동
  const onBoardGoHomeHandler = (event) => {
    event.preventDefault();

    navigate(`/board_list/${category}`);
  }

  const AttaFile = () => {
    let fileName = boardContent.file_path;
    let fileNameArr = fileName.split('-real-');
    return (
      <>
        <div className={fileDeleteChk ? "deleteY" : "deleteN"} >
          <Tag style={{ marginLeft: '10px', marginBottom: '5px' }}>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              {fileNameArr[1]}
            </button>
          </Tag>
          <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={fileDeleteClick}>삭제</button>
        </div>
      </>
    )
  }

  //render
  return (
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
        <Button style={{ float: 'right' }} type="primary" danger loading={loading} onClick={onBoardGoHomeHandler}>취소</Button>
        <Button style={{ marginRight: '10px', float: 'right' }} loading={loading} type="primary" onClick={onBoardUpdateHandler} icon={<EditOutlined />}>수정</Button>
      </div>

      <Card>
        <Select
          onChange={getCategory}
          placeholder="category" size="large"
          style={{ width: '7%' }}
          defaultValue={category}
        >
          {
            boardCategory.map(e =>
              <Option value={e.category}>{e.category}</Option>
            )
          }
        </Select>
        <Input maxLength={100} placeholder='제목을 입력해주세요.'
               onChange={getTitleValue} name='title' value={boardContent.title} 
               style={{ width: '93%', fontSize: '19px', marginBottom: '16px', padding : "3px 11px 5px" }}/>
        <CKEditor
          editor={Editor} data={boardContent.content}
          onChange={(event, editor) => {
            const data = editor.getData();
            setBoardUpdateContent({
              ...boardUpdateContent,
              content: data
            })
          }}
        />
        <Divider orientation="left" style={{ fontSize: '12px', fontWeight: 'bold' }}>첨부파일</Divider>
        {
          boardContent.file_path && <AttaFile />
        }
        <br></br>
        <input style={{ height: '30px', marginLeft: '10px' }} type="file" onChange={selectFile} />
      </Card>
    </Content>

  )
}

export default Auth(Board_update, true)