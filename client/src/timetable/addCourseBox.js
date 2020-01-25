import $ from 'jquery';

import addSection from './addSection';
import addVirtualCourse from './addVirtualCoruse';
import getURL from './getURL';
import removeSection from './removeSection';
import removeVirtualCourse from './removeVirtualCourse';
import saveTimetableToStorage from './saveTimetableToStorage';
import setTimeConflict from './setTimeConflict';
import updateConflictStyle from './updateConflictStyle';

// create the course box in timetable
export default function addCourseBox(code, section, weekday, start, end, singleton, virtual, dates, sectionObj) {
    if ($("#" + weekday).hasClass("hidden")) {
        $("#" + weekday).removeClass("hidden");
    }
    var colorText = "color" + window.color;
    var draggable = "";
    if (!singleton) {
        draggable = "draggable";
    }
    var virtualbox = "real";
    if (virtual) {
        virtualbox = "virtual";
        colorText = $("div.lesson.real." + code).attr("class").match(/color[0-9]+/i);
    }
    if (window.courseColor.hasOwnProperty(code)) {
        colorText = "color" + window.courseColor[code];
    }
    var title = start + " - " + end;
    var datePeriodText = "", dateInfo = "";
    var NEWLINE = "&#10;";
    if (dates) {
        title = dates[0] + " - " + dates[1] + NEWLINE + title;
        if (dates['multiple']) datePeriodText = " [" + dates['index'] + "]";
        dateInfo = "datestart='" + dates[0] + "' dateend='" + dates[1] + "'";
    }
    else {
        dateInfo = "datestart='' dateend=''";
    }
    dateInfo = dateInfo.replace("-", " ");
    var room = sectionObj["room"];
    if (room == "TBA") room = "Rm: TBA";
    var roomShort = room.replace(/, Lift [0-9]+((-|,)( )*[0-9]+)?/gi, "");
    roomShort = roomShort.replace(/\([0-9]+\)/gi, "");
    roomShort = roomShort.replace(/Lecture Theater /gi, "LT");
    roomShort = roomShort.replace(/, [A-Z ]+/gi, "");
    title += NEWLINE + room + NEWLINE + "Instructor: ";
    if (sectionObj["instructor"].length === 0) sectionObj["instructor"].push("TBA");
    if (sectionObj["instructor"].length === 1) title += sectionObj["instructor"][0];
    else for (var instr = 0; instr < sectionObj["instructor"].length; instr++) {
        title += NEWLINE + " - " + sectionObj["instructor"][instr];
    }
    var htmldiv = "<div " + dateInfo + " title='" + title + "' name='" + code + "_" + section + "' class='" + colorText + " lesson " + draggable + " " + virtualbox + " " + code + " " + section + "'><div>" + code + "<br/>" + section + datePeriodText + "<br/>" + roomShort + "</div></div>";
    var start_time = parseInt(start.substr(0, 2).concat(start.substr(3, 2)), 10);
    if (start.substr(5, 2) === "PM" && start.substr(0, 2) !== "12") {
        start_time += 1200;
    }
    var end_time = parseInt(end.substr(0, 2) + end.substr(3, 2), 10);
    if (end.substr(5, 2) === "PM" && end.substr(0, 2) !== "12") {
        end_time += 1200;
    }
    var starth = Math.floor(start_time / 100);
    var startm = start_time % 100;
    var endh = Math.floor(end_time / 100);
    var endm = end_time % 100;
    var h = "h".concat((starth < 10) ? ("0".concat(starth)) : starth);
    var tmp = Math.ceil(startm / 30) * 30 % 60;
    var m = "m".concat(tmp < 10 ? "0".concat(tmp) : tmp);
    var spancount = Math.ceil((endh * 60 + endm - starth * 60 - startm) / 30);
    var added = false;
    var hasConflict = false;
    $("#" + weekday).children("tr").each(function () {
        if (added) return false; // break the loop
        var cell = $(this).children("td." + h + "." + m).eq(0);
        if ($(cell).hasClass("occupied") || $(cell).hasClass("hidden")) {
            // skip this row as the cell is being ocuppied
            hasConflict = true;
        }
        else {
            // check if all cells needed are available
            var avail = true;
            var nextcell = $(cell).next();
            for (var i = 1; i < spancount; i++) {
                if ($(nextcell).hasClass("occupied") || $(nextcell).hasClass("hidden")) {
                    avail = false;
                }
                nextcell = $(nextcell).next();
            }
            // add the course box if all cells available
            if (avail) {
                $(cell).append(htmldiv);
                $(cell).addClass("occupied");
                $(cell).attr("colspan", spancount);
                // hide the next few cells
                var next = $(cell).next();
                for (var i = 1; i < spancount; i++) {
                    $(next).addClass("hidden");
                    next = $(next).next();
                }
                added = true;
                if (!virtual) {
                    // atach jQuery draggable
                    if (!singleton) {
                        var realcell = $("div.lesson.real." + code + "." + section);
                        $(realcell).draggable({
                            appendTo: "body",
                            helper: "clone",
                            start: function (event, ui) {
                                var lessontd = $(realcell).eq(0).parentsUntil("td").parent();
                                var lessondiv = $(realcell).eq(0);
                                $(ui.helper).css("width", $(lessondiv).outerWidth());
                                $(ui.helper).css("height", $(lessondiv).outerHeight());
                                $(ui.helper).addClass("move");
                                $(ui.helper).removeAttr("title");
                                addVirtualCourse(code, section);
                            },
                            stop: function (event, ui) {
                                if ($("div.lesson.toadd." + code).length > 0) {
                                    var new_section = $("div.lesson.toadd." + code).eq(0).attr("name").split("_")[1];
                                    // remove virtual class of new section
                                    //$("div.lesson.virtual."+code+"."+new_section).removeClass("virtual").addClass("real").addClass("toadd");
                                    // remove virtual sections
                                    removeVirtualCourse(code);
                                    // remove orginal section
                                    removeSection(code, section);
                                    // add new section
                                    addSection(window.data[code], new_section, singleton, false);
                                }
                                else {
                                    removeVirtualCourse(code);
                                }
                            }
                        });
                    }
                }
                else { // virtual
                    // attach jQuery droppable
                    var $virtualcell = $("div.lesson.virtual." + code + "." + section);
                    $virtualcell.droppable({
                        drop: function () {
                            // drop() of droppable fires before stop() of draggable
                            $virtualcell.addClass("toadd");
                            $virtualcell.removeClass("virtual-hover");
                        },
                        over: function (event, ui) {
                            $virtualcell.addClass("virtual-hover");
                            console.info("Event: ", {clientX: event['clientX'], clientY: event['clientY']}, "UI: ", ui['offset']);
                        },
                        out: function (event, ui) {
                            $virtualcell.removeClass("virtual-hover");
                        }
                    });
                }
            }
            // else look for next row
            else { // avail == false
                hasConflict = true;
            }
        }
    });
    // if no current existing rows available, create a new row
    if (!added) {
        // increase rowspan of weekday header
        var newrowspan = parseInt($("#" + weekday + " th").attr("rowspan"), 10) + 1;
        $("#" + weekday + " th").attr("rowspan", newrowspan);
        var htmlrow = '<tr><td class="h09 m00"></td><td class="h09 m30"></td><td class="h10 m00"></td><td class="h10 m30"></td><td class="h11 m00"></td><td class="h11 m30"></td><td class="h12 m00"></td><td class="h12 m30"></td><td class="h13 m00"></td><td class="h13 m30"></td><td class="h14 m00"></td><td class="h14 m30"></td><td class="h15 m00"></td><td class="h15 m30"></td><td class="h16 m00"></td><td class="h16 m30"></td><td class="h17 m00"></td><td class="h17 m30"></td><td class="h18 m00"></td><td class="h18 m30"></td><td class="h19 m00"></td><td class="h19 m30"></td><td class="h20 m00"></td><td class="h20 m30"></td><td class="h21 m00"></td><td class="h21 m30"></td><td class="h22 m00"></td><td class="h22 m30"></td></tr>';
        $("#" + weekday).append(htmlrow);
        addCourseBox(code, section, weekday, start, end, singleton, virtual, dates, sectionObj);
        return;
    }
    if (hasConflict) setTimeConflict(weekday, start, end);
    $("div.lesson." + code).parentsUntil("tr").parent().removeClass("spare-tr");
    // save timetable to cookies
    saveTimetableToStorage();
    getURL();
    updateConflictStyle();
    if (window.readMode) $(".lesson.draggable").draggable("disable");
}
