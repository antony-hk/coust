export default function getURL(data) {
    // TODO: Remove usages of global variables
    const semester = data.terms.current;
    const timetable = window.timetable;

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
