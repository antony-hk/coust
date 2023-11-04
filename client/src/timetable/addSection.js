import addCourseBox from './addCourseBox';
import getSectionObjs from './getSectionObjs';
import saveTimetableToStorage from './saveTimetableToStorage';

// TODO: Redux flow should be put back into React components
import store from '../store';
import { getAddCourseSectionAction } from '../actions/course';

// course: course object, section: section number, singleton: boolean
export default function addSection(data, course, section, singleton, virtual) {
    const { code } = course;
    // TODO: Redux flow should be put back into React components
    store.dispatch(getAddCourseSectionAction(code, section, virtual));

    var sectionObjs = getSectionObjs(data, code, section);
    var timeStr = "";
    var dates = null, weekdays = null, times = null;
    for (var s = 0; s < sectionObjs.length; s++) {
        var datetime = sectionObjs[s].datetime;
        var hasDate = 0;
        if (datetime.length === 2) hasDate = 1;
        if (hasDate === 1) {
            dates = datetime[0].match(/[0-9]{2}-[A-Z]{3}-[0-9]{4}/ig);
            dates['index'] = s;
            if (sectionObjs.length > 1)
                dates['multiple'] = true;
            else
                dates['multiple'] = false;
        }
        if (datetime[0] === "TBA") { // TBA cannot be added into timetable
            // save timetable to cookies
            saveTimetableToStorage(data);
            continue;
        }
        weekdays = datetime[hasDate].match(/(Mo|Tu|We|Th|Fr|Sa|Su)/ig);
        times = datetime[hasDate].match(/[0-9]{2}:[0-9]{2}[A|P]M/ig);
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
            timeStr = dates[0] + " - " + dates[1] + " " + timeStr;
        }
        for (var k = 0; k < weekdays.length; k++) {
            addCourseBox(data, code, section, weekdays[k], times[0], times[1], singleton, virtual, dates, sectionObjs[s]);
        }
    }
}
