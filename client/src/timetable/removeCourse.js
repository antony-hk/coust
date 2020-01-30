import $ from 'jquery';

import compactTable from './compactTable';
import saveTimetableToStorage from './saveTimetableToStorage';

// TODO: Redux flow should be put back into React components
import store from '../store';
import { getRemoveCourseAction } from '../actions/course';

// remove course from timetable and control table
export default function removeCourse(courseCode) {
    if (window.readMode) {
        console.warn("Not allowed in Read-Only Mode");
        return;
    }

    $('.tba.' + courseCode).remove();
    if ($('#tba-courses').children().length === 0) {
        $('#no-tba').show();
    }
    $('td.occupied div.lesson.' + courseCode).each(function () {
        const cell = $(this).parent();
        const colspan = $(cell).attr('colspan');
        $(cell).removeAttr('colspan');
        $(cell).removeClass('occupied');
        let next = $(cell).next();
        for (let i = 1; i < colspan; i++) {
            $(next).removeClass('hidden');
            next = $(next).next();
        }
        $(this).remove();
    });

    // add back to search hints of autocomplete
    window.searchHints.push(`${courseCode}: ${window.data[courseCode].name}`);
    window.searchHints.sort();
    delete window.timetable[courseCode];
    delete window.courseColor[courseCode];

    // save to cookies
    saveTimetableToStorage();
    compactTable();

    // TODO: Redux flow should be put back into React components
    store.dispatch(getRemoveCourseAction(courseCode));
}
