import React from 'react';

import styles from './CourseInfoSection.module.css';

const CourseInfoSection = (props) => {
    return (
        <>
            <div
                style={{
                    color: 'gray',
                    fontSize: 14,
                    marginLeft: 50,
                }}
            >
                {`Courses with "TBA" date & time: `}
                <span id="no-tba">None</span>
                <span id="tba-courses"></span>
            </div>
            <table id="timetable_controls" className={styles.timetableControls}>
                <thead>
                <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
                <tr id="none" className={styles.none}>
                    <td colspan="3">No courses added.</td>
                </tr>
                </thead>
                <tbody id="courselist">
                </tbody>
            </table>
        </>
    );
};

export default CourseInfoSection;
