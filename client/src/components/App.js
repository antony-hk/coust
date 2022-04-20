import {
    memo,
    useEffect,
} from 'react';
import clsx from 'clsx';

import Aside from './Aside';
import CourseInfoSection from './CourseInfoSection';
import FaqDialog from './FaqDialog';
import Header from './Header';
import Timetable from './Timetable';

import oldTimetableScript from '../timetable';

import styles from './App.module.css';

const App = memo(() => {
    useEffect(() => {
        oldTimetableScript();
    }, []);

    const loadingDivStyle = {
        display: 'block',
        width: 200,
        margin: '0 auto',
        paddingTop: 50,
        fontSize: 50,
    };

    return (
        <div className={styles.app}>
            <Header />
            <div className={styles.container}>
                <div id="timetable_wrapper" className={clsx(styles.timetableWrapper, styles.noSelect)}>
                    <div id="readmode" className={styles.readMode}>
                        <span title="No Changes Allowed">READ-ONLY</span>
                    </div>
                    <div id="loading" style={loadingDivStyle}>
                        <span>Loading...</span>
                    </div>
                    <Timetable />
                </div>
                <div className={clsx(styles.controlPanel, 'content')}>
                    <div className={styles.courseInfoSectionContainer}>
                        <CourseInfoSection />
                    </div>
                    <div className={styles.asideContainer}>
                        <Aside />
                    </div>
                </div>
                <FaqDialog />
            </div>
        </div>
    );
});

export default App;
