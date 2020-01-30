import React from 'react';
import { useSelector } from 'react-redux';

import CourseRow from './CourseRow';

import styles from './CourseInfoSection.module.css';

const CourseInfoSection = (props) => {
    const registeredCourses = useSelector(state => (state.app.registeredCourses));

    return (
        <div className={styles.courseInfoSection}>
            <div className={styles.tbaCourses}>
                {`Courses with "TBA" date & time: `}
                <span id="no-tba">None</span>
                <span id="tba-courses"></span>
            </div>
            <div className={styles.courseListContainer}>
                <table id="timetable_controls" className={styles.timetableControls}>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registeredCourses.length ? (
                            registeredCourses.map(courseCode => (
                                <CourseRow
                                    key={courseCode}
                                    courseCode={courseCode}
                                />
                            ))
                        ) : (
                            <tr id="none" className={styles.none}>
                                <td colSpan="3">No courses added.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseInfoSection;
