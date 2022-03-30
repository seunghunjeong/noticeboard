import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Auth from '../../_hoc/auth'

import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@ckeditor/ckeditor5-build-classic';
import { Card, Layout, Button, Input, Tabs, Divider, Select } from 'antd';
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons';



function Board_register() {

  const [boardCategory, setBoardCategory] = useState([]);

  useEffect(() => {
    Axios.post('/nav/getCategory')
      .then((res) => {
        setBoardCategory(res.data);
      })
  }, []);

  //antd
  const { Content } = Layout;
  const { TabPane } = Tabs;
  const { Option } = Select;

  //카테고리 받아오기
  const { category } = useParams();
  console.log(category)

  //사용자 정보 받아오기
  const userState = useSelector(state => state.user.userData);
  const userId = userState === undefined ? null : userState.id;
  const userName = userState === undefined ? null : userState.userName;

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
    let title = boardContent.title;
    let category = boardContent.category;
    const writer = userName;
    const id = userId;
    
    if (category === ""){
      alert('카테고리를 선택해주세요.');
      return;
    }
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
    formData.append('userId', id);
    formData.append('category', category);

    Axios.post('/board/api/insert', formData, {
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
              placeholder="category" size="large"
              // defaultValue={category}
              style={{ width: '7%' }}>
              {
                boardCategory.map(e =>
                  <Option key={e.idx} value={e.category}>{e.category}</Option>
                )
              }
            </Select>
            <Input maxLength={50} placeholder='제목을 입력해주세요.' 
                   onChange={getValue} name='title' 
                   style={{ width: '93%', fontSize: '19px', marginBottom: '16px', padding : "3px 11px 5px" }}/>
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



