import React, { Fragment, useState, useEffect } from 'react'
import { List, Button } from 'antd';
import AddCategoryModal from '../modals/AddCategory';
import Axios from 'axios';

const Setting_page = () => {


    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const openModal = () => { setAddCategoryOpen(true); };
    const closeModal = () => { setAddCategoryOpen(false); };

    const [boardCategory, setBoardCategory] = useState([]);
    useEffect(() => {
        Axios.post('http://localhost:8000/nav/getCategory')
            .then((res) => {
                setBoardCategory(res.data);
            })
    }, []);


    const data = [];
    boardCategory.map(e => {
        data.push({
            category: e.category,
            key: e.idx
        });
    })

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
                        <Button style={{marginRight : "10px"}} onClick={openModal}>추가</Button>
                        <Button>삭제</Button>
                    </>
                }
                bordered
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        {item.category}
                    </List.Item>
                )}
            />

            <AddCategoryModal display={addCategoryOpen} close={closeModal} insert={'/'} header={'/'}>
                123
            </AddCategoryModal>

        </>
    )

}

export default Setting_page