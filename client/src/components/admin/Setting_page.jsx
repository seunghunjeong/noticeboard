import React, { Fragment, useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom';
import { List, Button, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import AddCategoryModal from '../modals/AddCategory';
import Axios from 'axios';



const Setting_page = () => {

    // Outlet props 사용
    const state = useOutletContext();
    const setState = state[1];

    // 카테고리 등록 모달
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const openModal = () => { setAddCategoryOpen(true); };
    const closeModal = () => { setAddCategoryOpen(false); };

    // 카테고리 목록, 등록할 카테고리 정보보관 state 
    const [boardCategory, setBoardCategory] = useState([]);
    const [addCategory, setAddCategory] = useState({
        category: '',
    });

    useEffect(() => {
        Axios.post('http://localhost:8000/nav/getCategory')
            .then((res) => {
                setBoardCategory(res.data);
            })
    }, [state]);

    // 카테고리 리스트 뿌려주기
    const data = [];
    boardCategory.map(e => {
        data.push({
            category: e.category,
            key: e.idx
        });
    })

    // 입력한 카테고리 받아오기
    const getValue = e => {
        const { name, value } = e.target;
        setAddCategory({
            [name]: value
        })
    }
    // 카테고리 추가
    const categoryRegister = () => {
        const category = addCategory.category;
        Axios.post('http://localhost:8000/admin/addCategory', {
            category: category
        }).then((res)=>{
            console.log(res);
            if(res.data === "중복"){
                alert('이미 존재하는 카테고리명입니다.');
            } else {
                alert('추가완료');
                setState(res.data);
                closeModal();
            }
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
                        <Button style={{ marginRight: "10px" }} onClick={openModal}>추가</Button>
                    </>
                }
                bordered
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        {item.category}<Link to='/'><CloseOutlined style={{ marginLeft: "3px", color: 'red' }} /></Link>
                    </List.Item>
                )}
            />

            <AddCategoryModal display={addCategoryOpen} close={closeModal} insert={categoryRegister} header={'카테고리 추가'}>
                <Input maxLength={20} onChange={getValue} placeholder='추가할 카테고리명을 입력해주세요.' name='category' style={{ width: '100%', fontSize: '15px' }} />
            </AddCategoryModal>

        </>
    )

}

export default Setting_page