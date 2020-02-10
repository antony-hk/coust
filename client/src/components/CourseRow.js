import React, { useCallback } from 'react';

import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

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
                <Tippy content="Details">
                    <a
                        className={styles.iconButton}
                        href={infoLink}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <img alt="Details" className={styles.icon} src={infoIcon} />
                    </a>
                </Tippy>
                &nbsp;&nbsp;
                <Tippy content="Remove">
                    <a
                        className={styles.iconButton}
                        onClick={handleCourseRemove}
                    >
                        <img alt="Remove" className={styles.icon} src={removeIcon} />
                    </a>
                </Tippy>
            </td>
        </tr>
    );
}

export default CourseRow;
