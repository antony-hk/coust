// TODO: Redux flow should be put back into React components
import store from '../store';

export default function getURL(data) {
    // TODO: Redux flow should be put back into React components
    const timetable = store.getState().app.timetable;

    // TODO: Remove usages of global variables
    const semester = data.terms.current;

    const courseCodes = Object.keys(timetable);
    const timetableStr = courseCodes
        .map((courseCode) => {
            const sections = timetable[courseCode];
            const sectionStr = sections.join(',');

            return `${courseCode}:_${sectionStr}!`;
        })
        .join('');

    return `./?semester=${semester.num}&timetable=${encodeURIComponent(timetableStr)}`;
}
