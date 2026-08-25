import { useSelector } from 'react-redux';

import CourseRow from './CourseRow';

import styles from './CourseInfoSection.module.css';
import { useContext, useMemo } from 'react';
import DataContext from '../context';

const CourseInfoSection = () => {
    const data = useContext(DataContext);
    const registeredCourses = useSelector(state => (state.app.registeredCourses));
    const timetable = useSelector(state => (state.app.timetable));

    const tbaCourses = useMemo(() => {
        const ret = [];

        Object.keys(timetable)
            .forEach((courseCode) => {
                const sectionCodes = timetable[courseCode];
                sectionCodes.forEach((sectionCode) => {
                    data[courseCode].sections.forEach((sectionObj) => {
                        if (
                            sectionObj.section === sectionCode &&
                            sectionObj.datetime[0] === 'TBA'
                        ) {
                            ret.push(`${courseCode} ${sectionCode}`);
                        }
                    });
                });
            });

        return ret.join(', ');
    }, [data, timetable]);

    return (
        <div className={styles.courseInfoSection}>
            <div className={styles.tbaCourses}>
                {`Courses with "TBA" date & time: `}
                <span>{tbaCourses || 'None'}</span>
            </div>
            <div className={styles.courseListContainer}>
                <table className={styles.timetableControls}>
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
                            <tr className={styles.none}>
                                <td colSpan={3}>No courses added.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseInfoSection;
