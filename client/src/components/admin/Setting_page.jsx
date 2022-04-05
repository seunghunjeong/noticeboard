import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { Button, Input, Table, Layout } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import Auth from '../../_hoc/auth'

import AddCategoryModal from '../modals/AddCategory';
import Axios from 'axios';



const Setting_page = () => {

    // antd
    const { Content } = Layout;

    // 로딩처리를 위한 state
    const [loading, setLoading] = useState(null);
    // Outlet props 사용
    const state = useOutletContext();
    const setState = state[1];
    const categoryList = state[2];
    // 카테고리 등록 모달
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const openModal = () => { setAddCategoryOpen(true); };
    const closeModal = () => { setAddCategoryOpen(false); setAddCategory({ category: '', idx: '' }); };

    // 카테고리 목록, 등록할 카테고리 정보보관 state 
    const [addCategory, setAddCategory] = useState({
        category: '',
        idx: '',
        description: ''
    });

    const [mode, setMode] = useState();

    const columns = [
        {
            title: '카테고리',
            dataIndex: 'category',
            key: 'category',
            align: 'center',
            width: '15%'
        },
        {
            title: '게시글 수',
            dataIndex: 'count',
            key: 'count',
            align: 'center',
            width: '10%'
        },
        {
            title: '설명',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            width: '30%'
        },
        {
            title: '수정',
            dataIndex: 'registered',
            key: 'registered',
            align: 'center',
            width: '15%',
            render: (title, row) => (
                <>
                    <EditOutlined style={{ marginLeft: "4px", color: 'darkcyan' }} onClick={() => {
                        setMode('udt');
                        setCategory(row.category, row.key, row.description);
                        openModal();
                    }} />
                </>
            )
        },
        {
            title: '삭제',
            dataIndex: 'auth',
            key: 'auth',
            align: 'center',
            width: '15%',
            render: (title, row) => (
                <>
                {
                   row.category === '공지사항' ? <div><CloseOutlined/></div> :
                    <CloseOutlined style={{ marginLeft: "4px", color: 'red' }} onClick={() => {
                        categoryDelete(row.category);
                    }} /> 
                }
                </>
            )
        },



    ];

    // 카테고리 리스트 뿌려주기
    const data = [];
    categoryList.map(e => {
        data.push({
            category: e.category,
            key: e.idx,
            description: e.description,
            count: e.count
        });
        return data
    })

    // 입력한 카테고리 받아오기
    const getValue = e => {
        const { name, value } = e.target;
        setAddCategory({
            ...addCategory,
            [name]: value
        })
    }
    // 카테고리 추가
    const categoryRegister = () => {
        setLoading(true);
        const category = addCategory.category;
        const description = addCategory.description;
        if (category === "") {
            alert("카테고리명을 입력해주세요.");
            setLoading(false);
            return;
        }

        Axios.post('/admin/addCategory', {
            category: category,
            description: description
        }).then((res) => {
            console.log(res);
            if (res.data === "중복") {
                alert('이미 존재하는 카테고리명입니다.');
            } else {
                alert('추가완료');
                setState(res.data);
                closeModal();
                setLoading(false);
            }
        })
    }

    // 카테고리 삭제
    const categoryDelete = (name) => {

        const confirmAction = window.confirm("삭제시 해당카테고리의 모든 글이 삭제됩니다. \n삭제하시겠습니까?");

        if (confirmAction) { //yes 선택
            Axios.post('/admin/delCategory', {
                category: name
            }).then(res => {
                alert("삭제완료");
                setState(res.data);
            })
        }

    }

    // 카테고리 수정 값 셋팅
    const setCategory = (name, idx, description) => {
        setAddCategory({ category: name, idx: idx, description: description });
    }

    // 카테고리 수정
    const categoryUpdate = () => {
        setLoading(true);
        Axios.post('/admin/udtCategory', {
            category: addCategory.category,
            idx: addCategory.idx,
            description: addCategory.description
        }).then(res => {
            alert("수정완료");
            setState(res.data);
            closeModal();
            setLoading(false);
        })

    }

    return (
        <>

            <Content style={{ margin: '16px 16px 0 16px', height: 'calc(100% - 134px)' }}>

                <span style={{ fontSize: "20px", fontWeight: "bold" }}>게시판 카테고리 관리</span>
                <Button style={{ float: 'right', marginBottom: '15px' }} type="primary" onClick={() => {
                    setMode('add');
                    openModal();
                }}>추가</Button>
                <Table
                    columns={columns}
                    dataSource={data}
                />
            </Content>

            <AddCategoryModal display={addCategoryOpen} update={categoryUpdate} close={closeModal} insert={categoryRegister} header={mode === 'add' ? '카테고리 추가' : '카테고리 수정'} mode={mode} loading={loading}>
                {
                    mode === 'add' ?
                        <>
                            <Input maxLength={20} onChange={getValue} placeholder='추가할 카테고리명을 입력해주세요.' name='category' style={{ width: '100%', fontSize: '15px' }} />
                            <Input maxLength={20} onChange={getValue} placeholder='카테고리 설명을 입력해주세요.' name='description' style={{ width: '100%', fontSize: '15px', marginTop: '10px' }} />
                        </>
                        :
                        <>
                            <Input maxLength={20} onChange={getValue} name='category' value={addCategory.category} style={{ width: '100%', fontSize: '15px' }} />
                            <Input maxLength={20} onChange={getValue} placeholder='카테고리 설명을 입력해주세요.' name='description' value={addCategory.description} style={{ width: '100%', fontSize: '15px', marginTop: '10px' }} />
                        </>
                }
            </AddCategoryModal>

        </>
    )

}

export default Auth(Setting_page, true)