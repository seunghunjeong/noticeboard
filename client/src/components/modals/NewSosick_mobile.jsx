import React from 'react';
import './DailyReport.css';

const NewSosickModal = (props) => {
    // 부모로부터 값을 받아옴
    const { display, close, header } = props;

    return (
        // 클래스명 변경을 통해 활성화 / 비활성화
        <div className={display ? 'openModal modal' : 'modal'}>
            {display ? (
                <section style={{width:"100vw", height:"100vh"}}>
                    <header>
                        {header}
                        <button style={{ position: 'absolute', top: '8px' }} className="closeView" onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main>
                        hellow
                    </main>
                    <footer>
                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default NewSosickModal;