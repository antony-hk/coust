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
window.searchHints = [];

window.API_PATH = 'https://coust.442.hk/';
window.CLIENT_PATH = 'https://coust.github.io/';
window.COOKIE_EXPIRE_DAYS = 50;

function oldTimetableScript(data) {
    $.each(data, function (key, val) {
        if (key === "terms" || key === "lastUpdated") return true;
        window.searchHints.push(key + ': ' + val["name"]);
    });
    getURL(data);

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
            addCourse(data, courseCode);
        },
    }).focus(function () {
        $(this).autocomplete("search", "");
    });
    $("#add").click(function () {
        $(this).autocomplete("search", $(this).val());
    });
    // load courses added from cookies
    loadFromUrlOrStorage(data);
    compactTable();
}

export default oldTimetableScript;
