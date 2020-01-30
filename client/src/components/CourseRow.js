import React, { useCallback } from 'react';

import removeCourse from '../timetable/removeCourse';

import styles from './CourseRow.module.css';

import infoIcon from '../images/info.png';
import removeIcon from '../images/cross.png';

const CourseRow = props => {
    // TODO: Remove usages of global variables
    const { courseCode } = props;
    const department = courseCode.substring(0, 4);
    const infoLink = `https://w5.ab.ust.hk/wcq/cgi-bin/${window.terms[0].num}/subject/${department}#${courseCode}`;

    const handleCourseRemove = useCallback(() => {
        removeCourse(courseCode);
    }, [courseCode]);

    return (
        <tr className={`color${window.courseColor[courseCode]}`}>
            <td>{courseCode}</td>
            <td>{window.data[courseCode].name}</td>
            <td>
                <a
                    className={styles.iconButton}
                    href={infoLink}
                    rel="noopener noreferrer"
                    target="_blank"
                    title="Details"
                >
                    <img className={styles.icon} src={infoIcon} />
                </a>
                {'  '}
                <a
                    className={styles.iconButton}
                    title="Remove"
                    onClick={handleCourseRemove}
                >
                    <img className={styles.icon} src={removeIcon} />
                </a>
            </td>
        </tr>
    );
}

export default CourseRow;
