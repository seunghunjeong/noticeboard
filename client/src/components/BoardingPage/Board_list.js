import React from 'react'
import Axios from 'axios';
import { useEffect, useState} from 'react';
import 'antd/dist/antd.less';
import '../../App.css';
import { Table, Layout, Breadcrumb } from 'antd';

function Board_list() {
  
  //antd 변수
  const { Content } = Layout;

  // 내용 저장
  const [viewContent , setViewContent] = useState([]);

  // select query문 불러오기.
  useEffect(() => {
    Axios.get('http://localhost:8000/api/get').then((response) => {
      setViewContent(response.data);
    })
  },[])

  //table columns
  const columns = [
    {
      title: '번호',
      dataIndex: 'idx',
      key: 'idx'
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      render: title => <a>{title}</a>
    },
    {
      title: '작성자',
      dataIndex: 'writer',
      key: 'writer'
    }
  ];

  //table rows
  const data = []
  viewContent.map(element => {
    data.push({
      key : element.idx,
      idx : element.idx,
      title : element.title,
      writer : element.writer
    });
  });

  //render
  return (
    <div>
      <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>borad</Breadcrumb.Item>
          <Breadcrumb.Item>: Projects</Breadcrumb.Item>
          </Breadcrumb>
          <Table columns={columns} dataSource={data}/>  
      </Content>
    </div>
  )
}

export default Board_list