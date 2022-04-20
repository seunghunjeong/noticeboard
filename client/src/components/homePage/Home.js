import React from 'react'
import Auth from '../../_hoc/auth'

import TimelineInfo from './TimelineInfo';
import NewBoardList from './NewBoardList';
import DailyReport from './DailyReport';

import '../../App.css';
import {
    Layout
} from 'antd';

function Home() {
    
    return (
        <Layout style={{ flexDirection: 'row' }}>
            <div>
                {/* 이벤트 타임라인 */}
                <TimelineInfo />
                {/* 새글 알림 */}
                <NewBoardList />
            </div>
            {/* 일일 보고 */}
            <DailyReport/>
        </Layout>
    )
}

export default Auth(Home, true)