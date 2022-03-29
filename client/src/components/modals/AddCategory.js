import React from 'react';
import './DailyReport.css'
import Loader from '../modals/Loader';

const AddCategory = (props) => {
    // 부모로부터 값을 받아옴
    const { display, close, header, update, insert, mode, loading } = props;

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
                            mode === "add" ?
                                <>
                                    {
                                        loading ? <Loader /> :
                                            <>
                                                <button className="insert" onClick={insert}>
                                                    추가
                                                </button>
                                                <button className="close" onClick={close}>
                                                    취소
                                                </button>
                                            </>
                                    }
                                </>
                                :
                                <>
                                    {
                                        loading ? <Loader /> :
                                            <>
                                                <button className="update" onClick={update}>
                                                    수정
                                                </button>
                                                <button className="close" onClick={close}>
                                                    취소
                                                </button>
                                            </>
                                    }
                                </>
                        }
                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default AddCategory;