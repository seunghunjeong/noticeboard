import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useNavigate } from "react-router-dom"
import './DailyReport.css';
import { Avatar, Typography } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';
import MobileStyle from '../../App_mobile.module.css';

import moment from 'moment';

// antd variable
const { Text } = Typography;

const NewSosickModal = (props) => {
      // 페이지 이동
  const navigate = useNavigate();

    //새글 알림
    const [newBoardList, setNewBoardList] = useState([]);

    // 부모로부터 값을 받아옴
    const { display, close } = props;

    useEffect(() => {
        // 새 글 목록 가져오기
        Axios.get('/home/getNewBoardList').then((res) => {
            if (res.data.message === "success") 
                setNewBoardList(res.data.result);
        })

    }, [])

    const GetNewBoardList = () => {

        const newBoard = newBoardList;
        //최근 7일 이내 게시글 전체
        const recent7days = newBoard.filter(e => moment(e.regist_date).format("YYYY-MM-DD") > moment().subtract(7, 'day').format("YYYY-MM-DD"));
        //최근 7일 이내 게시글 중에서 3개만 추출
        //const recent3contents = recent7days.filter((e, index) => index < 3);
        //console.log(recent3contents.length)
        return (
            <div style={{overflow : 'auto', height: '95vh'}}>
            <table className='newSosick'>
                {
                    recent7days.length > 0 ?
                        recent7days.map((e) =>
                        <div className={MobileStyle.soSickDiv} key={e.idx} onClick={() => navigate(`/board_detail/${e.idx}/${e.category}`)}>
                           <tbody>
                                <tr style={{fontSize:'0.7em'}}>
                                    <td rowSpan={3} width={'60vw'} style={{textAlign:'center'}}>
                                        <Avatar className={MobileStyle.avtHeader}
                                            style={{backgroundColor : '#EE6F57'}}>
                                            {e.writer.substr(0,1)}
                                        </Avatar>
                                    </td>
                                    <td>{e.category}</td>
                                </tr>
                                <tr style={{fontSize:'0.7em'}}>
                                    <td>{e.title}</td>
                                </tr>
                                <tr style={{fontSize:'0.3em'}}>
                                    <td>{moment(e.regist_date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 
                                    moment(e.regist_date).fromNow()
                                    : moment(e.regist_date).format('YYYY-MM-DD')}</td>
                                </tr>
                            </tbody>
                           </div>
                        )
                        :
                        <p style={{ textAlign: "center", color: "grey", lineHeight: 20 }}>새 소식 없음</p>
                }
                </table>
            </div>
        )
    }

    return (
        // 클래스명 변경을 통해 활성화 / 비활성화
        <div className={display ? 'openModal modal' : 'modal'} key='Keymodal'>
            {display ? (
                <section style={{width:"100vw", height: 'calc(var(--vh, 1vh) * 100)'}}>
                    <header style={{color:'black'}}>
                        <FieldTimeOutlined style={{ position:'relative', top:'5px' ,fontSize: '25px', color: '#08c', float: 'left' }} />
                        <Text strong style={{ marginLeft: '5px', fontSize: '16px' }}>새 소식 </Text>
                        <button style={{ position: 'absolute', top: '8px' }} className="closeView" onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main style={{padding:'5px', background:'#f0f2f5'}}>
                       <GetNewBoardList />
                    </main>
                    <footer>
                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default NewSosickModal;