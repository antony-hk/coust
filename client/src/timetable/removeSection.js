import $ from 'jquery';

import compactTable from './compactTable';
import getURL from './getURL';

export default function removeSection(data, code, section) {
    window.timetable[code] = window.timetable[code].filter(
        timetableSection => timetableSection !== section
    )

    // If no courses with TBA date & time, show the empty state
    $(`.tba.${code}.${section}`).remove();
    if ($("#tba-courses").children().length === 0) {
        $("#no-tba").show();
    }

    $(`td.occupied div.lesson.${code}.${section}`).each(function () {
        const cell = $(this).parent();
        const colSpan = $(cell).attr("colspan");
        $(cell).removeAttr("colspan");
        $(cell).removeClass("occupied");
        let next = $(cell).next();
        for (let i = 1; i < colSpan; i++) {
            $(next).removeClass("hidden");
            next = $(next).next();
        }
        $(this).remove();
    });
    compactTable();
    getURL(data);
}
