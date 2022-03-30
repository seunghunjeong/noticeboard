import React from 'react';
import './DailyReport.css'
import { Button } from 'antd';

const ReportRegisterModal = (props) => {
    // 부모로부터 값을 받아옴
    const { state, display, close, header, insert, update, del, loading } = props;

    return (
        // 클래스명 변경을 통해 활성화 / 비활성화
        <div className={display ? 'openModal modal' : 'modal'}>
            {display ? (
                <section>
                    <header>
                        {header}
                    </header>
                    <main>{props.children}</main>
                    <footer>
                        { state === 'insertModal' ?
                            <Button className="insert" onClick={insert} loading={loading}>
                                등록
                            </Button>
                            : 
                            <><Button className="update" onClick={update} loading={loading}>
                                수정
                            </Button><Button className="delete" onClick={del} loading={loading}>
                                    삭제
                            </Button></>
                        }
                        <button className="close" onClick={close}>
                            취소
                        </button>
                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default ReportRegisterModal;