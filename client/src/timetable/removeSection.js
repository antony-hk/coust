import $ from 'jquery';

import compactTable from './compactTable';
import getURL from './getURL';

export default function removeSection(code, section) {
    for (var i = 0; i < window.timetable[code].length;) {
        if (window.timetable[code][i] === section) {
            window.timetable[code].splice(i, 1);
        }
        else {
            i++;
        }
    }
    $(".tba." + code + "." + section).remove();
    if ($("#tba-courses").children().length === 0) {
        $("#no-tba").show();
    }
    $("td.occupied div.lesson." + code + "." + section).each(function () {
        var cell = $(this).parent();
        var colspan = $(cell).attr("colspan");
        $(cell).removeAttr("colspan");
        $(cell).removeClass("occupied");
        var next = $(cell).next();
        for (var i = 1; i < colspan; i++) {
            $(next).removeClass("hidden");
            next = $(next).next();
        }
        $(this).remove();
    });
    compactTable();
    getURL();
}
