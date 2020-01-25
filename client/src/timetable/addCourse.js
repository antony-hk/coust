import $ from 'jquery';

import addSection from './addSection';
import getSections from './getSections';
import getURL from './getURL';
import removeCourse from './removeCourse';

window.removeCourse = removeCourse;

export default function addCourse(_code, sections) {
    if (!window.loaded) {
        console.log("Please try again later as data is still loading...");
        return false;
    }
    var val = $("#add").val().trim();
    if (typeof _code !== "") {
        val = _code;
    }
    var code = val.split(" ")[0].trim();
    code = code.substr(0, code.length - 1);
    if (val === "") {
        console.log("No course code");
        return false;
    }
    else if (!window.data.hasOwnProperty(code)) {
        console.log("Course not found: " + code);
        return false;
    }
    if (window.timetable.hasOwnProperty(code)) {
        alert("Course already added!");
        return false;
    }
    window.timetable[code] = [];
    var course = window.data[code];
    // remove from search hints of autocomplete
    var hintstext = code + ": " + course["name"];
    for (var i = 0; i < window.searchhints.length;) {
        if (window.searchhints[i] == hintstext) {
            window.searchhints.splice(i, 1);
            break;
        }
        else {
            i++;
        }
    }
    var types = getSections(code);
    if (sections === "") {
        for (var i = 0; i < types["types"].length; i++) {
            // add the first section of each section type
            var type = types["types"][i];
            var section = types[type][0];
            var section_singleton = (types[type].length === 1);
            addSection(course, section, section_singleton, false);
        }
    }
    else {
        for (var i = 0; i < sections.length; i++) {
            var section_singleton = (types[sections[i].match(/[A-Z]+/i)].length === 1);
            addSection(course, sections[i], section_singleton, false);
        }
    }
    // add to timetable control table, hide the no courses added row
    $("#none").hide();
    var infolink = "https://w5.ab.ust.hk/wcq/cgi-bin/" + window.terms[0]["num"] + "/subject/" + code.substr(0, 4) + "#" + code;
    var actions = "<a target='_blank' href='" + infolink + "'><img title='Details' class='actionsImg' src='images/info.png' /></a>&nbsp;&nbsp;";
    actions += "<a href='javascript:removeCourse(\"" + code + "\")'><img title='Remove' class='actionsImg' src='images/cross.png' /></a>";
    var htmlrow = "<tr class='color" + window.color + " " + code + "' name='" + code + "'><td>" + code + "</td><td>" + window.data[code]["name"] + "</td><td>" + actions + "</td></tr>";
    $("#courselist").children("tr").each(function () {
        if (htmlrow !== null && code < $(this).attr("name")) {
            $(htmlrow).insertBefore($(this));
            htmlrow = null;
        }
    });
    if (htmlrow !== null) {
        $("#courselist").append(htmlrow);
    }
    window.courseColor[code] = window.color;
    // change color;
    window.color = (window.color + 1) % 10;
    $("#add").val(""); // clear input text
    getURL();
    return false; // always return false to avoid form submitting
}
