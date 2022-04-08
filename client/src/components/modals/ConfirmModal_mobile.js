import React from 'react';
import { Modal} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const confirmModal = (params) => {
    // action에는 axios 함수, txt는 뭐할건지
    const { action, txt, loading } = params;
    
    return (
        Modal.confirm({
        title: `${txt}하시겠습니까?`,
        icon: <ExclamationCircleOutlined />,
        okText: txt,
        cancelText: '취소',
        onOk: action
        })
    );
};

export default confirmModal;