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

import axios from "axios";
import { useQuery } from "react-query";

const State = {
    readMode: false,
    color: 0,
    courseColor: [],
    terms: "", // store terms info
    data: "", // data get from courseInfo.json (via data.php and .json updated by mkdata.php)
    loaded: false, // check if data loaded when adding course
    searchHints: [],
    semester: null, // store term in use
    timetable: {}, // store the timetable
  
    API_PATH: 'https://coust.442.hk/',
    CLIENT_PATH: 'https://coust.github.io/',
    COOKIE_EXPIRE_DAYS: 50,
  };

const App = memo(() => {
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["data"],
        queryFn: () =>
            axios
            .get(State.API_PATH + 'json/data.php')
            .then((res) => res.data),
        refetchInterval:0,
    });

    useEffect(() => {
        if(!data) return;
        State.data = data;
        State.terms = State.data["terms"];
        State.semester = State.terms["current"];
        State.loaded = true;
        Object.keys(data).map((key)=>{
        if (key === "terms" || key === "lastUpdated") return true;
        State.searchHints.push(data[key].code + ': ' + data[key].name);
        });
        window.data = data;
        oldTimetableScript();
    }, [data]);
    //TODO error handling
    //if (isLoading) return "Loading...";
    //if (error) return "An error has occurred: " + error.message;
    
    //TODO mirgate from timetable.js
    //getURL();
    //$("#add").autocomplete();

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
