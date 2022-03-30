import React from 'react';
import { Tag } from 'antd';
import MobileStyle from '../../App_mobile.module.css'


const ReportViewModal = (props) => {
    // 부모로부터 값을 받아옴
    const { display, close, header, day } = props;

    return (
        // 클래스명 변경을 통해 활성화 / 비활성화
        <div className={display ? 'openModal modalView' : 'modalView'}>
            {display ? (
                <section>
                    <header>
                        {header}
                        <Tag className={MobileStyle.drv_date}>{day}</Tag>
                    </header>
                    <main>{props.children}</main>
                    <footer>
                        <button className="close" onClick={close}>
                            닫기
                        </button>
                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default ReportViewModal;