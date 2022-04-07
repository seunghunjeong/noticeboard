import React from 'react'
import Axios from 'axios';
import { useEffect, useState } from 'react';
import 'antd/dist/antd.less';
import '../../App.css';
import { Table, Layout, Button, Input, Select, Breadcrumb } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, Link, useParams } from "react-router-dom"
import Auth from '../../_hoc/auth'

function Board_list() {
  
  // antd 변수
  const { Content } = Layout;
  const { Search } = Input;
  const { Option } = Select;

  //카테고리 받아오기
  let {category} = useParams();

  // 내용 저장
  const [viewContent, setViewContent] = useState([]);

  // 검색 param
  const [searchContent, setSearchContent] = useState({
    filter: '',
    keyword: '',
    category : ''
  })

  // 검색 조건
  const [filter, setFilter] = useState('');
 
  // 검색 value값 저장용
  const [searchTxt, setSearchTxt] = useState();  

  // select query문 불러오기.
  useEffect(() => {
    Axios.get('/board/api/getBoardList',{
      params: {
        filter : filter === '' ? '' : filter,
        // %를 넣어줘야 와일드카드 검색 조건.
        keyword : searchContent.keyword === '' ? '%' : '%'+searchContent.keyword+'%',
        category: searchContent.category
     }
    }).then((response) => {
      setViewContent(response.data);
    })
    // 검색 값, 카테고리 변경될때마다 랜더링

  }, [searchContent])

  // 카테고리 변경 시 검색어 초기화
  useEffect(() => {
    setSearchContent({
      ...searchContent,
      keyword : '',
      category : category
    })

    // 키워드 초기화
    setSearchTxt('');
  }, [category])

  // 페이지 이동
  const navigate = useNavigate();
  const onBoardRegisterHandler = (event) => {
    event.preventDefault();

    navigate(`/board_register/${category}`);//board_register router로 이동
  }

  // table columns
  const columns = [
    {
      title: 'No',
      dataIndex: 'idx',
      key: 'idx',
      align : 'center',
      width : 100,
      sorter: (a, b) => a.idx - b.idx,
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title', 
      render: (title, row) => <Link to={`/board_detail/${row.key}/${category}`}>{title}</Link>,
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
      // sorter: true
    }
  ];

  //date format 수정
  let moment =  require('moment');

  //table rows
  const data = [];
  
  viewContent.map((element, index) => {
    data.push({
      key : element.idx,
      idx : index + 1,
      title : element.title,
      writer : element.writer,
      regist_date : moment(element.regist_date).format('YYYY-MM-DD')
    });
    return data;
  });

  // 총 게시글 수 
  let dataLength = data.length.toString();

  // table method
  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }

  // Search 값 저장
  const searchChangeHandler = (e) => {
    setSearchTxt(e.target.value);
  }

  // 게시글 검색 조건 설정
  const onChangeSearchFilter = (value, event) => {
    setFilter(value);
  };

  // 게시글 검색
  const onSearch = (value, event) => {
    if(filter === '') {
      alert('검색 조건을 선택해주세요.');
    }
    setSearchContent({
      ...searchContent,
      keyword : value
    });
  };

  //render
  return (
    <Content style={{ margin : '16px 16px 0 16px', height : 'calc(100% - 134px)' }}>
      <div style={{marginBottom : '16px', position : 'relative', height : '32px' }}>
        <Breadcrumb style={{ float: 'left' }}>
          <Breadcrumb.Item>게시판</Breadcrumb.Item>
          <Breadcrumb.Item>
            {category}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Button style={{ float: 'right' }} type="primary" icon={<EditOutlined />} onClick={onBoardRegisterHandler}>글작성</Button>
      </div>
      <Table columns = {columns} dataSource = {data} onChange={onChange} bordered  
             pagination={{position: ["bottomCenter"]}} 
             footer={() => 'total : ' + dataLength }
      /> 
      <div style={{ width : '100%', textAlign : 'center', marginTop : "20px" }} >
        <Select
          placeholder="검색 조건"
          optionFilterProp="children"
          onChange={onChangeSearchFilter}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
          <Option value="writer">작성자</Option>
          <Option value="title">제목</Option>
        </Select>
        <Search name='txt_search' placeholder="검색어를 입력하세요" allowClear onSearch={onSearch} style={{ width: 400 }} onChange={searchChangeHandler} value={searchTxt}/>
      </div>
    </Content>
  )
}

export default Auth(Board_list, null)