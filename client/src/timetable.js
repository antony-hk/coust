import $ from 'jquery';

import 'jquery-ui/ui/core';

import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';

import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';

import 'jquery-ui/themes/base/autocomplete.css';
import 'jquery-ui/themes/base/draggable.css';
import 'jquery-ui/themes/base/menu.css';

import './color.css';
import './override-jquery-ui.css';

import addCourse from './timetable/addCourse';
import compactTable from './timetable/compactTable';
import getURL from './timetable/getURL';
import loadFromUrlOrStorage from './timetable/loadFromUrlOrStorage';

window.jQuery = $;
require('jquery-ui-touch-punch');

// TODO: Remove global variables
window.readMode = false;
window.color = 0;
window.courseColor = [];
window.terms = ""; // store terms info
window.data = ""; // data get from courseInfo.json (via data.php and .json updated by mkdata.php)
window.loaded = false; // check if data loaded when adding course
window.searchHints = [];
window.semester = null; // store term in use
window.timetable = {}; // store the timetable

window.API_PATH = 'https://coust.442.hk/';
window.CLIENT_PATH = 'https://coust.github.io/';
window.COOKIE_EXPIRE_DAYS = 50;

function timetable() {
    window.terms = window.data["terms"];
    window.semester = window.terms["current"];
    //delete data["terms"];
    window.loaded = true;
    $.each(window.data, function (key, val) {
        if (key === "terms" || key === "lastUpdated") return true;
        window.searchHints.push(key + ': ' + val["name"]);
    });
    getURL();

    $("#add").autocomplete({
        // source: "http://coust.442.hk/json/parser.php?type=searchHints",
        source: window.searchHints,
        minLength: 0,
        focus: function (event, ui) {
            event.preventDefault();
        },
        select: (event, ui) => {
            event.preventDefault();

            const courseCode = ui.item.value.split(': ')[0];
            addCourse(courseCode);
        },
    }).focus(function () {
        $(this).autocomplete("search", "");
    });
    $("#add").click(function () {
        $(this).autocomplete("search", $(this).val());
    });
    // add term info and last update
    $("#update-time").html(window.data["lastUpdated"]);
    $("#termInfo").html(window.terms["current"]["text"]);
    // load courses added from cookies
    loadFromUrlOrStorage();
    compactTable();
}

export default timetable;
