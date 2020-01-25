import React from 'react';

import Aside from './Aside';
import Header from './Header';
import Timetable from './Timetable';

export default class App extends React.Component {

    render() {
        const loadingDivStyle = {
            display: 'block',
            width: 200,
            margin: '0 auto',
            paddingTop: 50,
            fontSize: 50,
        };

        return (
            <React.Fragment>
                <Header />
                <div className="container">
                    <div id="timetable_wrapper" className="content">
                        <div id="readmode">
                            <span title="No Changes Allowed">READ-ONLY</span>
                        </div>
                        <div id="loading" style={loadingDivStyle}>
                            <span>Loading...</span>
                        </div>
                        <Timetable />
                        <Aside />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}