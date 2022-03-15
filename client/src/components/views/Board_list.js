import React from 'react'
import Axios from 'axios';
import { useEffect, useState} from 'react';
import 'antd/dist/antd.less';
import '../../App.css';
import { Table, Tag, Space } from 'antd';


function Board_list() {

  // 내용 저장
  const [viewContent , setViewContent] = useState([]);
  // select query문 불러오기.
  useEffect(() => {
    Axios.get('http://localhost:8000/api/get').then((response) => {
      setViewContent(response.data);
    })
  },[])

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
  const data = []
 
  viewContent.map(element => {
    data.push({
      idx : element.idx,
      title : element.title,
      writer : element.writer
    });
  });

 
  // const title = viewContent.title;
  // const writer = viewContent.writer;

  // const data = [
  //   {
  //     idx : "idx",
  //     title : "title",
  //     writer : "writer"
  //   }
  // ];
  

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
         
        <Table columns={columns} dataSource={data}/>  

    </div>
  )
}

export default Board_list