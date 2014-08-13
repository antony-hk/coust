"use strict";
var dragmode = false;
var color = 0;
var terms = ""; // store terms info
var data = ""; // data get from courseInfo.json (via data.php and .json updated by mkdata.php)
var loaded = false; // check if data loaded when adding course
var timetable = []; // store the timetable
$( document ).ready(function() {
    $.get( "http://ustcourser.442.hk/json/data.php" )
      .done(function( _data ) {
            data = $.parseJSON(_data);
            terms = data["terms"];
            delete data["terms"];
            loaded = true;
            var searchhints = [];
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
            })
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
    $("#timetable").delegate('.draggable','mousedown', function(e) {
        if (e.type === 'mousedown' && !dragmode) {
            //dragmode = true;
            var res = $(this).attr("name").split("_");
            var code = res[0];
            var section = res[1];
            addVirtualCourse(code, section);
        }
    });
    $("#container").delegate('.move', 'mousemove mouseup', function(e) {
        if (!dragmode) {
            // do nothing
        }
        else if (e.type === 'mousemove') {
            //TODO:
        }
        else if (e.type === 'mouseup') {
            var res = $(this).attr("name").split("_");
            var code = res[0];
            var section = res[1];
            removeVirtualCourse(code, section);
        }
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
        alert("Course Not Found!");
        return false;
    }
    if (timetable.hasOwnProperty(code)) {
        alert("Course already added!")
        return false;
    }
    timetable[code] = [];
    var course = data[code];
    var types = getSections(code);
    if (sections==="") {
        for (var i=0; i<types["types"].length; i++) {
            // add the first section of each section type
            var type = types["types"][i];
            var section = types[type][0];
            var section_singleton = (types[type].length===1);
            addSection(course, section, section_singleton, false);
            timetable[code].push(section);
        }
    }
    else {
        for (var i=0; i<sections.length; i++) {
            var section_singleton = (types[sections[i].match(/[A-Z]+/i)] === 1);
            addSection(course, sections[i], section_singleton, false);
            timetable[code].push(section);
        }
    }
    // add to timetable control table, hide the no courses added row
    $("#none").hide();
    var infolink = "https://w5.ab.ust.hk/wcq/cgi-bin/"+terms[0]["num"]+"/subject/"+code.substr(0,4)+"#"+code;
    var actions = "<a target='_blank' href='"+infolink+"'><img class='actionsImg' src='images/info.png' /></a>&nbsp;&nbsp;";
    actions += "<a href='javascript:removeCourse(\""+code+"\")'><img class='actionsImg' src='images/cross.png' /></a>";
    var htmlrow = "<tr class='color"+color+" "+code+"'><td>"+code+"</td><td>"+data[code]["name"]+"</td><td>"+actions+"</td></tr>";
    $("#courselist").children("tr").each(function () {
        if (htmlrow!==null && code < $(this).attr("id")) {
            $(htmlrow).insertBefore($(this));
            htmlrow = null;
        }
    });
    if (htmlrow!==null) {
        $("#courselist").append(htmlrow);
    }
    // change color;
    color = (color+1)%10;
    $("#add").val(""); // clear input text
    return false; // always return false to avoid form submitting
}
// course: course object, section: section number, singleton: boolean
function addSection(course, section, singleton, virtual) {
    var code = course["code"];
    var sectionObjs = getSectionObjs(code, section);
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
            for(var k=0; k<weekdays.length; k++) {
                addCourseBox(code, section, weekdays[k], times[0], times[1], singleton, virtual);
            }
        }
    }
}
// create the course box in timetable
function addCourseBox(code, section, weekday, start, end, singleton, virtual) {
    var colorText = "color" + color;
    var draggable = "";
    if (!singleton) {
        draggable = "draggable";
    }
    var virtualbox = "";
    if (virtual) {
        virtualbox = "virtual";
        colorText = "";
    }
    var htmldiv = "<div name='"+code+"_"+section+"' class='"+colorText+" lesson "+draggable+" "+virtualbox+" "+code+" "+section+"'>"+code+"<br/>"+section+"</div>";
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
            }
            // else look for next row
        }
    });
    // if no current existing rows available, create a new row
    if (!added) {
        // increase rowspan of weekday header
        var newrowspan = parseInt($("#"+weekday+" th").attr("rowspan"))+1;
        $("#"+weekday+" th").attr("rowspan", newrowspan);
        var htmlrow = '<tr><td class="h08 m00"></td><td class="h08 m30"></td><td class="h09 m00"></td><td class="h09 m30"></td><td class="h10 m00"></td><td class="h10 m30"></td><td class="h11 m00"></td><td class="h11 m30"></td><td class="h12 m00"></td><td class="h12 m30"></td><td class="h13 m00"></td><td class="h13 m30"></td><td class="h14 m00"></td><td class="h14 m30"></td><td class="h15 m00"></td><td class="h15 m30"></td><td class="h16 m00"></td><td class="h16 m30"></td><td class="h17 m00"></td><td class="h17 m30"></td><td class="h18 m00"></td><td class="h18 m30"></td><td class="h19 m00"></td><td class="h19 m30"></td><td class="h20 m00"></td><td class="h20 m30"></td></tr>';
        $("#"+weekday).append(htmlrow);
        addCourseBox(code, section, weekday, start, end, singleton);
        return;
    }
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
    delete timetable[code];
    compactTable();
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