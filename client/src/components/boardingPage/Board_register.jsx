import React from 'react'
import Axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Layout, Button, Input, Tabs, Divider, Select } from 'antd';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@ckeditor/ckeditor5-build-classic';
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Auth from '../../hoc/auth'


function Board_register() {

  const [boardCategory, setBoardCategory] = useState([]);

  useEffect(() => {
    Axios.post('http://localhost:8000/nav/getCategory')
      .then((res) => {
        setBoardCategory(res.data);
      })
  }, []);

  //antd
  const { Content } = Layout;
  const { TabPane } = Tabs;
  const { category } = useParams();
  const { Option } = Select;

  //사용자 정보 받아오기
  const userState = useSelector(state => state.user.userData);
  const userId = userState === undefined ? null : userState.id;
  const userName = userState === undefined ? null : userState.userName;
  const isAuth = userState === undefined ? null : userState.isAuth;

  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  const [boardContent, setBoardContent] = useState({
    title: '',
    content: '',
    category: '',
  })

  // 에디터에서 입력값 받아오는 함수
  const getValue = e => {
    console.log(boardContent);
    const { name, value } = e.target;
    setBoardContent({
      ...boardContent,
      [name]: value
    })
  }

  const getCategory = e => {
    setBoardContent({
      ...boardContent,
      category: e
    })
    console.log(boardContent)
  }


  // 이벤트 후 경로 이동할때 사용하는 hooks
  const navigate = useNavigate();

  // 입력버튼
  const submitBoard = () => {
    let formData = new FormData();
    let content = boardContent.content;
    const title = boardContent.title;
    const writer = userName;
    const category = boardContent.category;

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
    formData.append('writer', writer);
    formData.append('category', category);

    Axios.post('http://localhost:8000/board/api/insert', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(() => {
      navigate(`/board_list/${category}`);
      alert('등록완료');
    })
  };


  const onBoardGoHomeHandler = (event) => {
    event.preventDefault();

    navigate(`/board_list/${category}`);
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
          <div>
            {/* select css 수정필요 */}
            <Select
              onChange={getCategory}
              placeholder="category"
              style={{ width: '7%' }}>
              {
                boardCategory.map(e =>
                  <Option key={e.idx} value={e.category}>{e.category}</Option>
                )
              }
            </Select>
            <Input maxLength={20} placeholder='제목을 입력해주세요.' onChange={getValue} name='title' style={{ width: '93%', fontSize: '14px', marginBottom: '16px' }} />
          </div>
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






export default Auth(Board_register, true)



