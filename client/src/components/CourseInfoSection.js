import React from 'react';

import styles from './CourseInfoSection.module.css';

const CourseInfoSection = (props) => {
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
                    <tr id="none" className={styles.none}>
                        <td colSpan="3">No courses added.</td>
                    </tr>
                    </thead>
                    <tbody id="courselist">
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseInfoSection;
