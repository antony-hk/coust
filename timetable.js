"use strict";
var readMode = false;
var color = 0;
var courseColor = [];
var terms = ""; // store terms info
var data = ""; // data get from courseInfo.json (via data.php and .json updated by mkdata.php)
var loaded = false; // check if data loaded when adding course
var searchhints = [];
var timetable = []; // store the timetable
$( document ).ready(function() {
    $.get( "http://ustcourser.442.hk/json/data.php" )
      .done(function( _data ) {
            data = $.parseJSON(_data);
            terms = data["terms"];
            delete data["terms"];
            loaded = true;
            $.each( data, function( key, val ) {
                searchhints.push(key + " " + val["name"]);
              });
            $( "#add" ).autocomplete({
                    // source: "http://ustcourser.442.hk/json/parser.php?type=searchhints", 
                    source: searchhints,
                    minLength: 0,
                    focus: function( event, ui ) {
                            event.preventDefault();
                        },
                    select: function(event, ui) { 
                            event.preventDefault();
                            addCourse(ui.item.value, "");
                        }
            }).focus(function () {
                $(this).autocomplete("search", "");
            });
            $("#add").click(function() {
                $(this).autocomplete("search", $(this).val());
            });
            // load courses added from cookies
            loadFromCookie();
        });
    $("#timetable").delegate('td','mouseover mouseleave', function(e) {
        if (e.target.className==="separator") {
            
        }
        else if (e.type === 'mouseover') {
          // $(this).parent().addClass("hover"); // row
          $(this).parent().parent().addClass("hover"); // tbody
          $("colgroup").eq(Math.ceil($(this).index()/2)).addClass("hover"); // col
        }
        else {
          // $(this).parent().removeClass("hover"); // row
          $(this).parent().parent().removeClass("hover"); // tbody
          $("colgroup").eq(Math.ceil($(this).index()/2)).removeClass("hover"); // col
        }
    });
    $("#add").focusin(function() {
        $("#add").val("");
        $("#add").css("color", "black");
    });
    $("#add").focusout(function() {
        $("#add").val("Add Courses to Timetable");
        $("#add").css("color", "gray");
    });
});

// JavaScript functions
function goHome() {
    window.location.href = ".";
}
function getSections(code) {
    if (!loaded) {
        return null;
    }
    if (!data.hasOwnProperty(code)) {
        return null;
    }
    var course = data[code];
    var sections = course["sections"];
    var types = {};
    for (var i=0; i<sections.length; i++) {
        var type = sections[i]["section"].match(/[A-Za-z]+/i);
        if (typeof types[type] === "undefined") {
            types[type] = [];
        }
        var duplicate = false;
        for (var j=0; j<types[type].length; j++) {
            if (sections[i]["section"] === types[type][j]) {
                duplicate = true;
            }
        }
        if (!duplicate) {
            types[type].push(sections[i]["section"]);
        }
    }
    var keys = [];
    for (var k in types) {
        keys.push(k);
    }
    types["types"] = keys;
    return types;
}
function getSectionObjs(code, section) {
    var objs = [];
    for (var j=0; j<data[code]["sections"].length; j++) {
        if (data[code]["sections"][j]["section"]===section) {
            objs.push(data[code]["sections"][j]);
        }
    }
    return objs;
}
function addCourse(_code, sections) {
    if (!loaded) {
        alert("Please try again later as data is still loading...");
        return false;
    }
    var val = $("#add").val().trim();
    if (typeof _code !== "") {
        val = _code;
    }
    var code = val.split(" ")[0].trim();
    if (val==="") {
        return false;
    }
    else if (!data.hasOwnProperty(code)) {
        //alert("Course Not Found!");
        return false;
    }
    if (timetable.hasOwnProperty(code)) {
        alert("Course already added!")
        return false;
    }
    timetable[code] = [];
    var course = data[code];
    // remove from search hints of autocomplete
    var hintstext = code + " " + course["name"];
    for (var i=0; i<searchhints.length; ) {
        if (searchhints[i] == hintstext) {
            searchhints.splice(i, 1);
            break;
        }
        else {
            i++;
        }
    }
    var types = getSections(code);
    if (sections==="") {
        for (var i=0; i<types["types"].length; i++) {
            // add the first section of each section type
            var type = types["types"][i];
            var section = types[type][0];
            var section_singleton = (types[type].length===1);
            addSection(course, section, section_singleton, false);
        }
    }
    else {
        for (var i=0; i<sections.length; i++) {
            var section_singleton = (types[sections[i].match(/[A-Z]+/i)].length === 1);
            addSection(course, sections[i], section_singleton, false);
        }
    }
    // add to timetable control table, hide the no courses added row
    $("#none").hide();
    var infolink = "https://w5.ab.ust.hk/wcq/cgi-bin/"+terms[0]["num"]+"/subject/"+code.substr(0,4)+"#"+code;
    var actions = "<a target='_blank' href='"+infolink+"'><img title='Details' class='actionsImg' src='images/info.png' /></a>&nbsp;&nbsp;";
    actions += "<a href='javascript:removeCourse(\""+code+"\")'><img title='Remove' class='actionsImg' src='images/cross.png' /></a>";
    var htmlrow = "<tr class='color"+color+" "+code+"' name='"+code+"'><td>"+code+"</td><td>"+data[code]["name"]+"</td><td>"+actions+"</td></tr>";
    $("#courselist").children("tr").each(function () {
        if (htmlrow!==null && code < $(this).attr("name")) {
            $(htmlrow).insertBefore($(this));
            htmlrow = null;
        }
    });
    if (htmlrow!==null) {
        $("#courselist").append(htmlrow);
    }
    courseColor[code] = color;
    // change color;
    color = (color+1)%10;
    $("#add").val(""); // clear input text
    getURL();
    return false; // always return false to avoid form submitting
}
// course: course object, section: section number, singleton: boolean
function addSection(course, section, singleton, virtual) {
    var code = course["code"];
    if (!virtual) timetable[code].push(section);
    var sectionObjs = getSectionObjs(code, section);
    var timeStr = "";
    for (var s=0; s<sectionObjs.length; s++) {
        var datetime = sectionObjs[s]["datetime"];
        for (var i=0; i<datetime.length; i++) {
            if (datetime === "TBA") continue; // TBA cannot be added into timetable
            //var matches = datetime[i].match(/(Mo|Tu|We|Th|Fr|Sa|Su)+[ ]+[0-9]+:[0-9]+[A|P]M[ ]+-[ ]+[0-9]+:[0-9]+[A|P]M/ig);
            var weekdays = datetime[i].match(/(Mo|Tu|We|Th|Fr|Sa|Su)/ig);
            var times = datetime[i].match(/[0-9]+:[0-9]+[A|P]M/ig);
            if (!times || times.length!==2) {
                // this is possibly date rather than time
                continue;
            }
            else if (timeStr.indexOf(times)!==-1) {
                // duplicate time (may be of different date period)
                continue;
            }
            timeStr += times;
            for(var k=0; k<weekdays.length; k++) {
                addCourseBox(code, section, weekdays[k], times[0], times[1], singleton, virtual);
            }
        }
    }
}
// create the course box in timetable
function addCourseBox(code, section, weekday, start, end, singleton, virtual) {
    if ($("#"+weekday).hasClass("hidden")) {
        $("#"+weekday).removeClass("hidden");
    }
    var colorText = "color" + color;
    var draggable = "";
    if (!singleton) {
        draggable = "draggable";
    }
    var virtualbox = "real";
    if (virtual) {
        virtualbox = "virtual";
        colorText = $("div.lesson.real."+code).attr("class").match(/color[0-9]+/i);
    }
    if (courseColor.hasOwnProperty(code)) {
        colorText = "color"+courseColor[code];
    }
    var title = start + " - " + end;
    var htmldiv = "<div title='"+title+"' name='"+code+"_"+section+"' class='"+colorText+" lesson "+draggable+" "+virtualbox+" "+code+" "+section+"'>"+code+"<br/>"+section+"</div>";
    var start_time = parseInt(start.substr(0,2).concat(start.substr(3,2)));
    if (start.substr(5,2)==="PM" && start.substr(0,2)!=="12") {
        start_time += 1200;
    }
    var end_time = parseInt(end.substr(0,2)+end.substr(3,2));
    if (end.substr(5,2)==="PM" && end.substr(0,2)!=="12") {
        end_time += 1200;
    }
    var starth = Math.floor(start_time/100);
    var startm = start_time%100;
    var endh = Math.floor(end_time/100);
    var endm = end_time%100;
    var h = "h".concat((starth<10) ? ("0".concat(starth)) : starth);
    var tmp = Math.ceil(startm/30)*30%60;
    var m = "m".concat(tmp<10 ? "0".concat(tmp) : tmp);
    var spancount = Math.ceil((endh*60+endm-starth*60-startm)/30);
    var added = false;
    $("#"+weekday).children("tr").each(function() {
        if (added) return false; // break the loop
        var cell = $(this).children("td."+h+"."+m).eq(0);
        if ($(cell).hasClass("occupied") || $(cell).hasClass("hidden")) {
            // skip this row as the cell is being ocuppied
        }
        else {
            // check if all cells needed are available
            var avail = true;
            var nextcell = $(cell).next();
            for (var i=1; i<spancount; i++) {
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
                for (var i=1; i<spancount; i++) {
                    $(next).addClass("hidden");
                    next = $(next).next();
                }
                added = true;
                if (!virtual) {
                    // atach jQuery draggable
                    if (!singleton) {
                        var realcell = $("div.lesson.real."+code+"."+section);
                        $(realcell).draggable({ 
                            helper: "clone",
                            start: function( event, ui ) {
                                var lessondiv = $(realcell).eq(0);
                                $(ui.helper).css("width", $(lessondiv).width());
                                $(ui.helper).addClass("move");
                                $(ui.helper).removeAttr("title");
                                addVirtualCourse(code, section);
                            },
                            stop: function( event, ui ) {
                                if ($("div.lesson.toadd."+code).length>0) {
                                    var new_section = $("div.lesson.toadd."+code).eq(0).attr("name").split("_")[1];
                                    // remove virtual class of new section
                                    //$("div.lesson.virtual."+code+"."+new_section).removeClass("virtual").addClass("real").addClass("toadd");
                                    // remove virtual sections
                                    removeVirtualCourse(code);
                                    // remove orginal section
                                    removeSection(code, section);
                                    // add new section
                                    addSection(data[code], new_section, singleton, false);
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
                    var virtualcell = $("div.lesson.virtual."+code+"."+section);
                    $("div.lesson.virtual."+code+"."+section).droppable({ 
                        drop: function() {
                            // drop() of droppable fires before stop() of draggable
                            $(virtualcell).addClass("toadd");
                            $(virtualcell).removeClass("virtual-hover");
                        },
                        over: function( event, ui ) {
                            $(virtualcell).addClass("virtual-hover");
                        },
                        out: function( event, ui ) {
                            $(virtualcell).removeClass("virtual-hover");
                        }
                    });
                }
            }
            // else look for next row
        }
    });
    // if no current existing rows available, create a new row
    if (!added) {
        // increase rowspan of weekday header
        var newrowspan = parseInt($("#"+weekday+" th").attr("rowspan"))+1;
        $("#"+weekday+" th").attr("rowspan", newrowspan);
        var htmlrow = '<tr><td class="h09 m00"></td><td class="h09 m30"></td><td class="h10 m00"></td><td class="h10 m30"></td><td class="h11 m00"></td><td class="h11 m30"></td><td class="h12 m00"></td><td class="h12 m30"></td><td class="h13 m00"></td><td class="h13 m30"></td><td class="h14 m00"></td><td class="h14 m30"></td><td class="h15 m00"></td><td class="h15 m30"></td><td class="h16 m00"></td><td class="h16 m30"></td><td class="h17 m00"></td><td class="h17 m30"></td><td class="h18 m00"></td><td class="h18 m30"></td><td class="h19 m00"></td><td class="h19 m30"></td><td class="h20 m00"></td><td class="h20 m30"></td><td class="h21 m00"></td><td class="h21 m30"></td><td class="h22 m00"></td><td class="h22 m30"></td></tr>';
        $("#"+weekday).append(htmlrow);
        addCourseBox(code, section, weekday, start, end, singleton, virtual);
        return;
    }
    // save timetable to cookies
    saveToCookie();
    getURL();
}
// remove course from timetable and control table
function removeCourse(code) {
    $("td.occupied div.lesson."+code).each(function() {
        var cell = $(this).parent();
        var colspan = $(cell).attr("colspan");
        $(cell).removeAttr("colspan");
        $(cell).removeClass("occupied");
        var next = $(cell).next();
        for (var i=1; i<colspan; i++) {
            $(next).removeClass("hidden");
            next = $(next).next();
        }
        $(this).remove();
    });
    $("#courselist ."+code).remove();
    if ($("#courselist").children("tr").length === 0) {
        $("#none").show();
    }
    // add back to search hints of autocomplete
    searchhints.push(code+" "+data[code]["name"]);
    searchhints.sort();
    delete timetable[code];
    delete courseColor[code];
    // save to cookies
    saveToCookie();
    compactTable();
    // update read mode url
    getURL();
}
function removeSection(code, section) {
    for (var i=0; i<timetable[code].length; ) {
        if (timetable[code][i]===section) {
            timetable[code].splice(i, 1);
        }
        else {
            i++;
        }
    }
    $("td.occupied div.lesson."+code+"."+section).each(function() {
        var cell = $(this).parent();
        var colspan = $(cell).attr("colspan");
        $(cell).removeAttr("colspan");
        $(cell).removeClass("occupied");
        var next = $(cell).next();
        for (var i=1; i<colspan; i++) {
            $(next).removeClass("hidden");
            next = $(next).next();
        }
        $(this).remove();
    });
    compactTable();
    getURL();
}
// row: tr element object
function emptyRow(row) {
    var empty = true;
    $(row).children("td").each(function() {
        if ($(this).hasClass("occupied") || $(this).hasClass("hidden")) {
            empty =  false;
        }
    });
    return empty;
}
// remove empty row
function compactTable() {
    $(".days").each(function() {
        var weekth = $("#"+$(this).attr("id")+" .weekday");
        var rowspan = parseInt($(weekth).attr("rowspan"));
        var rowcount = $(this).children("tr").length;
        if (rowcount>1){
            for (var i=1; i<rowcount; i++) {
                var row = $(this).children("tr").eq(i);
                if (emptyRow(row)) {
                    $(row).addClass("remove");
                    rowspan--;
                }
            }
            $(weekth).attr("rowspan", rowspan);
            $("tr.remove").remove();
            var firstRow = $(this).children("tr").eq(0);
            if (emptyRow(firstRow) && $(this).children("tr").length>1) {
                rowspan--;
                $(weekth).attr("rowspan", rowspan);
                $(this).children("tr").eq(1).prepend($(weekth));
                $(firstRow).remove();
            }
        }
    });
    var sat_empty = true;
    $("#Sa").children("tr").each(function() {
        if (!emptyRow($(this))) {
            sat_empty = false;
            return false;
        }
    });
    if (sat_empty) $("#Sa").removeClass("hidden").addClass("hidden");
    var sun_empty = true;
    $("#Su").children("tr").each(function() {
        if (!emptyRow($(this))) {
            sun_empty = false;
            return false;
        }
    });
    if (sun_empty) $("#Su").removeClass("hidden").addClass("hidden");
}
// add course boxes of available sections of the section type
function addVirtualCourse(code, section) {
    var sectiontype = section.match(/[A-Z]+/i);
    var sections = getSections(code);
    var singleton = (sections[sectiontype].length===1);
    for (var i=0; i<sections[sectiontype].length; i++) {
        if (sections[sectiontype][i]===section) {
            continue;
        }
        addSection(data[code], sections[sectiontype][i], singleton, true);
    }
}
function removeVirtualCourse(code) {
    $("td.occupied div.lesson.virtual."+code).each(function() {
        var cell = $(this).parent();
        var colspan = $(cell).attr("colspan");
        $(cell).removeAttr("colspan");
        $(cell).removeClass("occupied");
        var next = $(cell).next();
        for (var i=1; i<colspan; i++) {
            $(next).removeClass("hidden");
            next = $(next).next();
        }
        $(this).remove();
    });
    compactTable();
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
} 
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1);
        if (c.indexOf(name) !== -1) return c.substring(name.length,c.length);
    }
    return "";
} 
function loadFromCookie() {
    var timetableStr = "";
    if (getURLParameter("timetable")!==null) {
        timetableStr = getURLParameter("timetable");
        readMode = true;
        $("#readmode").show();
    }
    else {
        timetableStr = getCookie("timetable");
        $("#readmode").hide();
    }
    var res = timetableStr.split("!");
    for (var i=0; i<res.length; i++) {
        if (res[i] === "") continue;
        var rc = res[i].split("_");
        addCourse(rc[0], rc[1].split(","));
    }
}
function saveToCookie() {
    if (readMode) return; // reading others timetable
    var timetableStr = "";
    for (var code in timetable) {
        var sectionStr = "";
        for (var i=0; i<timetable[code].length; i++) {
            if (i!==0) sectionStr += ",";
            sectionStr += timetable[code][i];
        }
        timetableStr += code + "_" + sectionStr + "!";
    }
    setCookie("timetable", timetableStr, 50);
}
function getURL() {
    var timetableStr = "";
    for (var code in timetable) {
        var sectionStr = "";
        for (var i=0; i<timetable[code].length; i++) {
            if (i!==0) sectionStr += ",";
            sectionStr += timetable[code][i];
        }
        timetableStr += code + "_" + sectionStr + "!";
    }
    var url = "./index.html?timetable=" + timetableStr;
    $("#dialog").children().remove();
    $("#dialog").append("<a href='"+url+"' target='_blank'>[Read Mode URL]</a>");
}

function getURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1];
        }
    }
    return null;
}