import React from 'react';
import './DailyReport.css';
import { Avatar } from 'antd';
import MobileStyle from '../../App_mobile.module.css';

const NewSosickModal = (props) => {
    // 부모로부터 값을 받아옴
    const { display, close } = props;

    return (
        // 클래스명 변경을 통해 활성화 / 비활성화
        <div className={display ? 'openModal modal' : 'modal'}>
            {display ? (
                <section style={{width:"100vw", height:"100vh"}}>
                    <header>
                        <button style={{ position: 'absolute', top: '-2px' }} className="closeView" onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main style={{padding:'5px'}}>
                        <table style={{width:'70vw', color:'black'}}>
                            <tbody>
                                <tr style={{fontSize:'0.7em'}}>
                                    <td rowSpan={3} width={'60vw'} style={{textAlign:'center'}}>
                                        <Avatar className={MobileStyle.avtHeader}
                                            style={{backgroundColor : '#EE6F57'}}>
                                            관
                                        </Avatar>
                                    </td>
                                    <td>카테고리</td>
                                </tr>
                                <tr style={{fontSize:'0.7em'}}>
                                    <td>제목</td>
                                </tr>
                                <tr style={{fontSize:'0.3em'}}>
                                    <td>시간</td>
                                </tr>
                            </tbody>
                        </table>
                    </main>
                    <footer>
                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default NewSosickModal;