import $ from 'jquery';

import compactTable from './compactTable';
import getURL from './getURL';
import saveTimetableToStorage from './saveTimetableToStorage';

// remove course from timetable and control table
export default function removeCourse(code) {
    if (window.readMode) {
        alert("Not allowed in Read-Only Mode");
        return;
    }
    $(".tba." + code).remove();
    if ($("#tba-courses").children().length === 0) {
        $("#no-tba").show();
    }
    $("td.occupied div.lesson." + code).each(function () {
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
    $("#courselist ." + code).remove();
    if ($("#courselist").children("tr").length === 0) {
        $("#none").show();
    }
    // add back to search hints of autocomplete
    window.searchhints.push(code + ": " + window.data[code]["name"]);
    window.searchhints.sort();
    delete window.timetable[code];
    delete window.courseColor[code];
    // save to cookies
    saveTimetableToStorage();
    compactTable();
    // update Read-Only Mode url
    getURL();
}
