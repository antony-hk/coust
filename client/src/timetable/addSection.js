import addCourseBox from './addCourseBox';
import saveTimetableToStorage from './saveTimetableToStorage';

// TODO: Redux flow should be put back into React components
import store from '../store';
import { getAddCourseSectionAction } from '../actions/course';

function getSectionObjs(data, code, section) {
    var objs = [];
    for (var j = 0; j < data[code].sections.length; j++) {
        if (data[code].sections[j].section === section) {
            objs.push(data[code].sections[j]);
        }
    }
    return objs;
}

// course: course object, section: section number, singleton: boolean
export default function addSection(data, course, section, singleton, virtual) {
    const { code } = course;
    // TODO: Redux flow should be put back into React components
    store.dispatch(getAddCourseSectionAction(code, section, virtual));

    const sectionObjs = getSectionObjs(data, code, section);
    let timeStr = '';
    for (let s = 0; s < sectionObjs.length; s++) {
        const { datetime } = sectionObjs[s];
        let hasDate = false,
            dates = null;
        if (datetime.length === 2) {
            hasDate = true;
        }
        if (hasDate === true) {
            dates = datetime[0].match(/[0-9]{2}-[A-Z]{3}-[0-9]{4}/ig);
            dates.index = s;
            dates.multiple = (sectionObjs.length > 1);
        }
        if (datetime[0] === 'TBA') { // TBA cannot be added into timetable
            // save timetable to cookies
            saveTimetableToStorage(data);
            continue;
        }
        const weekdays = datetime[hasDate ? 1 : 0].match(/(Mo|Tu|We|Th|Fr|Sa|Su)/ig);
        const times = datetime[hasDate ? 1 : 0].match(/[0-9]{2}:[0-9]{2}[A|P]M/ig);
        /*if (!times || times.length!==2) {
         // the element is date rather than time
         //continue;
         }
         else if (timeStr.indexOf(times)!==-1) {
         // duplicate time (may be of different date period)
         //continue;
         }*/
        timeStr += times;
        if (dates !== null && dates.length === 2) {
            timeStr = `${dates[0]} - ${dates[1]} ${timeStr}`;
        }
        for (let k = 0; k < weekdays.length; k++) {
            addCourseBox(data, code, section, weekdays[k], times[0], times[1], singleton, virtual, dates, sectionObjs[s]);
        }
    }
}
