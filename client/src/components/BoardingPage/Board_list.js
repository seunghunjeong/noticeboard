/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Axios from 'axios';
import { useEffect, useState} from 'react';
import 'antd/dist/antd.less';
import '../../App.css';
import { Table, Layout, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, Link } from "react-router-dom"

function Board_list() {
  
  // antd 변수
  const { Content } = Layout;

  // 내용 저장
  const [viewContent, setViewContent] = useState([]);
  
  // select query문 불러오기.
  useEffect(() => {
    Axios.get('http://localhost:8000/api/getBoardList').then((response) => {
      setViewContent(response.data);
    })
  },[])

  // 페이지 이동
  const navigate = useNavigate();
  const onBoardRegisterHandler = (event) => {
    event.preventDefault();

    navigate("/board_register");//board_register router로 이동
  }

  // table columns
  const columns = [
    {
      title: '번호',
      dataIndex: 'idx',
      key: 'idx',
      align : 'center',
      width : 100
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title', 
      render: (title, record, idx) => <Link to={'/board_detail/'+ idx}>{title}</Link>,
      align : 'left'
    },
    {
      title: '작성자',
      dataIndex: 'writer',
      key: 'writer',
      align : 'center',
      width : 200
    },
    {
      title: '작성일',
      dataIndex: 'regist_date',
      key: 'regist_date',
      align : 'center',
      width : 200
    }
  ];

  //date format 수정
  let moment =  require('moment');

  //table rows
  const data = []
  viewContent.map(element => {
    data.push({
      key : element.idx,
      idx : element.idx,
      title : element.title,
      writer : element.writer,
      regist_date : moment(element.regist_date).format('YYYY-MM-DD')
    });
  });

  //render
  return (
    <div>
      <Content style={{ margin : '0 16px' }}>
          <Button style={{  margin : '16px 0', float: 'right' }} type="primary" icon={<EditOutlined />} onClick={onBoardRegisterHandler}>글작성</Button>
          <Table columns = {columns} dataSource = {data}/>  
      </Content>
    </div>
  )
}

export default Board_list