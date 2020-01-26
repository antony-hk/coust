import $ from 'jquery';

export default function getURL() {
    var timetableStr = "";
    for (var code in window.timetable) {
        var sectionStr = "";
        for (var i = 0; i < window.timetable[code].length; i++) {
            if (i !== 0) sectionStr += ",";
            sectionStr += window.timetable[code][i];
        }
        timetableStr += code + ":_" + sectionStr + "!";
    }
    var url = "./?semester="+window.semester["num"]+"&timetable=" + encodeURIComponent(timetableStr);
    $("#dialog").children().remove();
    $("#dialog").append("<a href='" + url + "' target='_blank'><button id='readmodebtn' style='width: 120px;'>READ-ONLY</button></a>");
    $("#readmodebtn").button();
    return url;
}
