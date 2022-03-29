import React from 'react';
import './DailyReport.css'
import Loader from '../modals/Loader';

const ReportRegisterModal = (props) => {
    // 부모로부터 값을 받아옴
    const { display, close, header, update, del, loading } = props;

    return (
        // 클래스명 변경을 통해 활성화 / 비활성화
        <div className={display ? 'openModal modal' : 'modal'}>
            {display ? (
                <section>
                    <header>
                        {header}
                        <button style={{ position: 'absolute', top: '8px' }} className="closeView" onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main>{props.children}</main>
                    <footer>
                        {
                            loading ? <Loader /> :
                                <>
                                    <button className="update" onClick={update}>
                                        수정
                                    </button>
                                    <button className="delete" onClick={del}>
                                        삭제
                                    </button>
                                    <button className="close" onClick={close}>
                                        닫기
                                    </button>
                                </>
                        }

                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default ReportRegisterModal;