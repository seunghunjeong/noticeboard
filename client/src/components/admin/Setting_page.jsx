import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { List, Button, Input } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';

import AddCategoryModal from '../modals/AddCategory';
import Axios from 'axios';



const Setting_page = () => {


    // 로딩처리를 위한 state
    const [loading, setLoading] = useState(null);
    // Outlet props 사용
    const state = useOutletContext();
    const setState = state[1];
    const categoryList = state[2];
    // 카테고리 등록 모달
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const openModal = () => { setAddCategoryOpen(true);  };
    const closeModal = () => { setAddCategoryOpen(false); setAddCategory({category: '', idx: ''}); };

    // 카테고리 목록, 등록할 카테고리 정보보관 state 
    const [addCategory, setAddCategory] = useState({
        category: '',
        idx:''
    });

    const [mode, setMode] = useState();

    // 카테고리 리스트 뿌려주기
    const data = [];
    categoryList.map(e => {
        data.push({
            category: e.category,
            key: e.idx
        });
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

        if(category === ""){
            alert("카테고리 명을 입력해주세요.");
            setLoading(false);
            return;
        }

        Axios.post('http://localhost:8000/admin/addCategory', {
            category: category
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
            Axios.post('http://localhost:8000/admin/delCategory', {
                category: name
            }).then(res => {
                alert("삭제완료");
                setState(res.data);
            })
        }

    }

    // 카테고리 수정 값 셋팅
    const setCategory = (name, idx) => {
        setAddCategory({category : name, idx: idx});
    }

    // 카테고리 수정
    const categoryUpdate = () => {
        setLoading(true);
        Axios.post('http://localhost:8000/admin/udtCategory', {
            category : addCategory.category,
            idx : addCategory.idx
        }).then( res => {
            alert("수정완료");
            setState(res.data);
            closeModal();
            setLoading(false);
        })

    }

    return (
        <>
            <List
                style={{ margin: "30px" }}
                header={
                    <>
                        <strong>Board Category List</strong>
                        <hr></hr>
                    </>
                }
                footer={
                    <>
                        <Button style={{ marginRight: "10px" }} onClick={() => {
                            setMode('add');
                            openModal();
                        }}>추가</Button>
                    </>
                }
                bordered
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        {item.category}
                        <EditOutlined style={{ marginLeft: "4px", color: 'darkcyan' }} onClick={() => {
                            setMode('udt');
                            setCategory(item.category, item.key);
                            openModal();
                        }} />
                        <CloseOutlined style={{ marginLeft: "4px", color: 'red' }} onClick={() => {
                            categoryDelete(item.category);
                        }} />
                    </List.Item>
                )}
            />

            <AddCategoryModal display={addCategoryOpen} update={categoryUpdate} close={closeModal} insert={categoryRegister} header={mode === 'add' ? '카테고리 추가' : '카테고리 수정'} mode={mode} loading={loading}>
                {
                    mode === 'add' ?
                        <Input maxLength={20} onChange={getValue} placeholder='추가할 카테고리명을 입력해주세요.' name='category' style={{ width: '100%', fontSize: '15px' }} />
                        : <Input maxLength={20} onChange={getValue} name='category' value={addCategory.category} style={{ width: '100%', fontSize: '15px' }} />
                }
            </AddCategoryModal>

        </>
    )

}

export default Setting_page