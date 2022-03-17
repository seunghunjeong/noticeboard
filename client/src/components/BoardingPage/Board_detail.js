/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useEffect, useState } from 'react';
import Axios from 'axios';
import 'antd/dist/antd.less';
import '../../App.css';
import { Table, Layout, Button, Divider } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, Link } from "react-router-dom"
import { useParams } from "react-router"


function Board_detail() {
  // antd 변수
  const { Content } = Layout;

  const [BoardDetail, setBoardDetail] = useState([]);

  // 게시판 idx 가져오기
  let {id} = useParams();
  console.log(id);

  useEffect(() => {
    Axios.post('http://localhost:8000/api/getBoardDetail', {id : id})
    .then(response => {
        if(response.data){
          console.log(response);
          setBoardDetail(response.data)
        } else {
          alert("상세페이지 불러오기 실패");
        } 

    })
  }, []);

  //render
  return (
    <div>
      <Content style={{ margin : '0 16px' }}>
        {BoardDetail.idx}에엥
      </Content>
    </div>
  )
}

export default Board_detail