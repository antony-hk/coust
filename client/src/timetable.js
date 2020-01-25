import $ from 'jquery';

import 'jquery-ui/ui/core';

import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';

import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/button';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/dialog';
import 'jquery-ui/ui/widgets/tooltip';

import 'jquery-ui/themes/base/autocomplete.css';
import 'jquery-ui/themes/base/button.css';
import 'jquery-ui/themes/base/dialog.css';
import 'jquery-ui/themes/base/draggable.css';
import 'jquery-ui/themes/base/menu.css';
import 'jquery-ui/themes/base/tooltip.css';

import './override-jquery-ui.css';

import addCourse from './timetable/addCourse';
import compactTable from './timetable/compactTable';
import getURL from './timetable/getURL';
import loadFromUrlOrStorage from './timetable/loadFromUrlOrStorage';

window.readMode = false;
window.color = 0;
window.courseColor = [];
window.terms = ""; // store terms info
window.data = ""; // data get from courseInfo.json (via data.php and .json updated by mkdata.php)
window.loaded = false; // check if data loaded when adding course
window.searchhints = [];
window.semester = null; // store term in use
window.timetable = []; // store the timetable

window.API_PATH = 'https://coust.442.hk/';
window.CLIENT_PATH = 'https://coust.github.io/';
window.COOKIE_EXPIRE_DAYS = 50;

function timetable() {
    $(document).tooltip({
        //track: true,
        position: {my: "left+15 center", at: "right center+5"},
        tooltipClass: "custom-tooltip-styling"
    });
    $.ajax({
        cache: true,
        url: window.API_PATH + 'json/data.php',
        type: "GET",
        dataType: "json"
    }).done(function (_data) {
        window.data = _data;
        window.terms = window.data["terms"];
        window.semester = window.terms["current"];
        //delete data["terms"];
        window.loaded = true;
        $.each(window.data, function (key, val) {
            if (key === "terms" || key === "lastUpdated") return true;
            window.searchhints.push(key + ': ' + val["name"]);
        });
        getURL();

        $("#add").autocomplete({
            // source: "http://coust.442.hk/json/parser.php?type=searchhints",
            source: window.searchhints,
            minLength: 0,
            focus: function (event, ui) {
                event.preventDefault();
            },
            select: function (event, ui) {
                event.preventDefault();
                addCourse(ui.item.value, "");
            }
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
    });
    $("#timetable").delegate('td', 'mouseover mouseleave', function (e) {
        if (e.target.className === "separator" || e.target.className === "times-tr"
            || e.target.className === "timediv" || e.target.className === "time") {

        }
        else if (e.type === 'mouseover') {
            var $el = $(this);
            $el.parent().parent().find("td").addClass("hover"); // weekday
            var hour_class = $el.attr("class").match(/h[0-2][0-9]/i);
            if (hour_class) $("." + hour_class).addClass("hover");

        }
        else {
            var $el = $(this);
            $el.parent().parent().find("td").removeClass("hover"); // weekday
            var hour_class = $el.attr("class").match(/h[0-2][0-9]/i);
            if (hour_class) $("." + hour_class).removeClass("hover");

        }
    });
    $("#add").focusin(function () {
        $("#add").val("");
        $("#add").css("color", "black");
    });
    $("#add").focusout(function () {
        $("#add").val("Add Courses to Timetable");
        $("#add").css("color", "gray");
    });

    // UI stuff
    $("button").button();
    $("#faq").dialog({
        autoOpen: false,
        width: 800,
        buttons: [
            {
                text: "Close",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
    // Link to open the dialog
    $("#show-faq").click(function (event) {
        $("#faq").dialog("open");
        event.preventDefault();
    });
}

export default timetable;
