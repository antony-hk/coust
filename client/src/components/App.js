import React from 'react';

import Aside from './Aside';
import CourseInfoSection from './CourseInfoSection';
import Faq from './Faq';
import Header from './Header';
import Timetable from './Timetable';

import oldTimetableScript from '../timetable';

class App extends React.PureComponent {
    componentDidMount() {
        oldTimetableScript();
    }

    render() {
        const loadingDivStyle = {
            display: 'block',
            width: 200,
            margin: '0 auto',
            paddingTop: 50,
            fontSize: 50,
        };

        return (
            <>
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
                        <CourseInfoSection />
                    </div>
                    <Faq />
                </div>
            </>
        );
    }
}

export default App;
