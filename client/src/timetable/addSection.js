import $ from 'jquery';

import addCourseBox from './addCourseBox';
import getURL from './getURL';
import saveTimetableToStorage from './saveTimetableToStorage';

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
    if (!virtual) {
        window.timetable[code].push(section);
    }
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
            const className = `tba ${code} ${section}`;
            let html = `<span class="${className}">`;
            if (!virtual) {
                if ($("#no-tba").is(':hidden')) {
                    html += ', ';
                }
                html += `${code} ${section}</span>`;
                $("#tba-courses").append(html);
                $("#no-tba").hide();
            }
            // save timetable to cookies
            saveTimetableToStorage(data);
            getURL(data);
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
