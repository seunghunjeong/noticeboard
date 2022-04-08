import React from 'react'
import Axios from 'axios';
import { useEffect, useState } from 'react';
import 'antd/dist/antd.less';
import '../../App.css';
import { Layout, Input, Select, Breadcrumb, Card, Space, Pagination, Empty, message } from 'antd';
import { useNavigate, Link, useParams } from "react-router-dom"
import Auth from '../../_hoc/auth'
import axios from 'axios';

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
    keyword: '',
    category : ''
  })

  // 검색 조건
  const [filter, setFilter] = useState('');

  // paging param
  const [pagingVal, setPagingVal] = useState({
    page : 1,
    pageSize : 4
  });

  // list total
  const [listCnt, setListCnt] = useState();
 
  // 검색 value값 저장용
  const [searchTxt, setSearchTxt] = useState();  

  //
  const [pageLoading, SetPageLoading] = useState(true);  

  // 리스트 가져오기
  const selectBoardList = () => {
    return Axios.get('/board/api/getBoardListM',{
      params: {
        filter : filter === '' ? '' : filter,
        // %를 넣어줘야 와일드카드 검색 조건.
        keyword : searchContent.keyword === '' ? '%' : '%'+searchContent.keyword+'%',
        category: searchContent.category,
        page : (pagingVal.page - 1) * pagingVal.pageSize,
        pageSize : pagingVal.pageSize
     }
   })
  }

  const selectBoardListCnt = () =>{
    return Axios.get('/board/api/getBoardListCntM',{
      params: {
        filter : filter === '' ? '' : filter,
        // %를 넣어줘야 와일드카드 검색 조건.
        keyword : searchContent.keyword === '' ? '%' : '%'+searchContent.keyword+'%',
        category: searchContent.category
     }
    })
  }

   // select query문 불러오기.
    useEffect(() => {
      Axios.all([selectBoardList(), selectBoardListCnt()]).then(
        axios.spread((...responses) => {
          setViewContent(responses[0].data);
          setListCnt(responses[1].data);
          if(responses[1].data[0].cnt === 0) {
            SetPageLoading(false);
          }
        })
      )
      return () => {
        SetPageLoading(true);
      }
      // 검색 값, 페이징 할 때마다 랜더링
    }, [searchContent, pagingVal])

  // 카테고리 변경 시 검색어 초기화
  useEffect(() => {
    setSearchContent({
      ...searchContent,
      keyword : '',
      category : category
    })
    // 키워드 초기화
    setSearchTxt('');

    setPagingVal({
    page : 1,
    pageSize : 4
    });
  }, [category])

  // 페이지 이동
  /* const navigate = useNavigate();
   const onBoardRegisterHandler = (event) => {
    event.preventDefault();
    navigate(`/board_register/${category}`);//board_register router로 이동
  } */

  //date format 수정
  let moment =  require('moment');

  // Search 값 저장
  const searchChangeHandler = (e) => {
    setSearchTxt(e.target.value);
  }

  // 게시글 검색 조건 설정
  const onChangeSearchFilter = (value) => {
    setFilter(value);
  };

  // 게시글 검색
  const onSearch = (value, event) => {
    if(filter === '') {
      message.warning('검색 조건을 선택해주세요.');
      return;
    }
    setSearchContent({
      ...searchContent,
      keyword : value
    });

    setPagingVal({
      page : 1,
      pageSize : 4
    });
  };

  // 페이징
  const pagingHandler = (page, pageSize) => {
    setPagingVal({
      page : page,
      pageSize : pageSize
    })
  }

  //render
  return (
    <Content style={{ margin : '16px 16px 0 16px', height : 'calc(100% - 134px)' }}>

     <div key='breadCategory' style={{marginBottom : '16px', position : 'relative', height : '32px' }}>
        <Breadcrumb key='breadKey' style={{ float: 'left' }}>
          <Breadcrumb.Item>게시판</Breadcrumb.Item>
          <Breadcrumb.Item>
            {category}
          </Breadcrumb.Item>
        </Breadcrumb>        
      </div>
      <Space key='spaceKey' direction="vertical" size="middle" style={{ display: 'flex' }}>
        {
          viewContent.length !== 0 ?
          viewContent.map((e, index) =>
          <Card key={index}
            size="small"
          >
            <Card key={index}
              size="small"
              title={<Link to={`/board_detail/${e.idx}/${category}`}>{e.title}</Link>} 
              headStyle={{fontSize:'24px'}}
              bordered={false}
            >
              {e.writer} | {moment(e.regist_date).format('YYYY-MM-DD')}
            </Card> 
          </Card>
          ) : 
          <Card key='empty'
          size="small"
          loading={pageLoading}
          ><Empty description={false}/></Card>
        }
      </Space>
      {
        viewContent.length !== 0 ?
        <div  style={{ width : '100%', textAlign : 'center', marginTop : "20px" }}>
         <Pagination size="small" current={pagingVal.page} total={listCnt[0].cnt}  showTotal={total => `total : ${total}`} onChange={pagingHandler} pageSize={4}/>
        </div>
        :
        null
      }
      <div key='searchKey' style={{ width : '100%', textAlign : 'center', marginTop : "20px" }} >
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
        <Search name='txt_search' placeholder="검색어를 입력하세요" allowClear onSearch={onSearch} style={{ width: '60vw' }} onChange={searchChangeHandler} value={searchTxt}/>
      </div> 
    </Content>
  )
}

export default Auth(Board_list, null)