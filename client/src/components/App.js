import {
    memo,
    useEffect,
} from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import clsx from 'clsx';

import Aside from './Aside';
import CourseInfoSection from './CourseInfoSection';
import FaqDialog from './FaqDialog';
import Header from './Header';
import Timetable from './Timetable';

import dataContext from '../context';
import oldTimetableScript from '../timetable';

import styles from './App.module.css';


const API_PATH = 'https://coust.442.hk/';

const App = memo(() => {
    const { data } = useQuery({
        queryKey: ["data"],
        queryFn: () =>
            axios
                .get(API_PATH + 'json/data.php')
                .then((res) => res.data),
        refetchInterval: 0,
    });

    useEffect(() => {
        if (!data) {
            return;
        }
        window.data = data;
        oldTimetableScript();
    }, [data]);

    const loadingDivStyle = {
        display: 'block',
        width: 200,
        margin: '0 auto',
        paddingTop: 50,
        fontSize: 50,
    };

    return (
        <dataContext.Provider value={data}>
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
        </dataContext.Provider>
    );
});

export default App;
