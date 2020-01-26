import $ from 'jquery';

import addCourse from './addCourse';
import getStoredValue from './getStoredValue';
import getURLParameter from './getURLParameter';

export default function loadFromUrlOrStorage() {
    var timetableStr = "";
    if (getURLParameter("timetable") !== null) {
        var timetableSemester = getURLParameter("semester");
        if (timetableSemester == window.terms["current"]["num"]) {
            timetableStr = getURLParameter("timetable");
            window.readMode = true;
            $("#readmode").show();
        }
        else {
            window.location.replace(window.CLIENT_PATH);
        }
    }
    else {
        var timetableSemester = getStoredValue("timetable-semester");
        if (timetableSemester == window.terms["current"]["num"]) {
            timetableStr = getStoredValue("timetable");
        }
        $("#readmode").hide();
    }
    timetableStr = decodeURIComponent(timetableStr);
    $("#loading").show();
    var res = timetableStr.split("!");
    for (var i = 0; i < res.length; i++) {
        if (res[i] === "") continue;
        var rc = res[i].split("_");
        addCourse(rc[0], rc[1].split(","));
    }
    $("#loading").hide();
    $(".content").show();
    if (window.readMode) {
        $(".lesson.draggable").draggable("disable");
        $(".lesson").css("cursor", "default");
        $("img").filter("[title='Remove']").parents("a").hide();
        $("#add").val("Click the logo to exit Read-Only Mode");
        $("#add").prop("disabled", true);
    }
    else {
        $("#add").trigger("focusout");
    }
}
