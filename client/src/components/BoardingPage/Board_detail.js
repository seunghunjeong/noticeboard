import React from 'react'
import Axios from 'axios';
import { useEffect,useState } from 'react';
import { useParams } from "react-router";
function Board_detail() {

  const {idx} = useParams();

  // 내용 저장
  const [viewContent , setViewContent] = useState([]);

// select query문 불러오기.
useEffect(() => {
  Axios.get('http://192.168.0.152:8000/api/read', {
    params:{
      idx: idx
    }
  }).then((response)=>{
    setViewContent(response.data);
    console.log(response.data)
  })
},[])

  return (
    <div></div>
  )
}

export default Board_detail