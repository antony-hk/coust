export default function getURL(semester, timetable) {
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
