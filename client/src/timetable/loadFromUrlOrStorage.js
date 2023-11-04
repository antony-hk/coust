import $ from 'jquery';

import addCourse from './addCourse';
import getStoredValue from './getStoredValue';
import getURLParameter from './getURLParameter';

function decodeTimetableStr(timetableStr) {
    const courseStrings = timetableStr.split('!');
    const ret = {};

    courseStrings.forEach(courseString => {
        if (courseString.length === 0) {
            return;
        }

        const [courseCode, sectionString] = courseString.split(':_');
        const sections = sectionString.split(',');

        ret[courseCode] = sections;
    });

    return ret;
}

export default function loadFromUrlOrStorage(data) {
    let timetableStr = "";
    if (getURLParameter("timetable") !== null) {
        const timetableSemester = getURLParameter("semester");
        if (timetableSemester == data.terms.current.num) {
            timetableStr = getURLParameter("timetable");
            window.readMode = true;
            $("#readmode").show();
        } else {
            window.location.replace(window.CLIENT_PATH);
        }
    } else {
        const timetableSemester = getStoredValue("timetable-semester");
        if (timetableSemester == data.terms.current.num) {
            timetableStr = getStoredValue("timetable");
        }
        $("#readmode").hide();
    }
    timetableStr = decodeURIComponent(timetableStr);

    const timetableData = decodeTimetableStr(timetableStr);

    $("#loading").show();
    for (const courseCode in timetableData) {
        const sections = timetableData[courseCode];
        addCourse(data, courseCode, sections);
    }
    $("#loading").hide();
    $(".content").show();
    if (window.readMode) {
        $(".lesson.draggable").draggable("disable");
        $(".lesson").css("cursor", "default");
        $("img").filter("[title='Remove']").parents("a").hide();
        $("#add").val("Click the logo to exit Read-Only Mode");
        $("#add").prop("disabled", true);
    } else {
        $("#add").trigger("focusout");
    }
}
