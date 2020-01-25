import $ from 'jquery';

export default function updateConflictStyle() {
    // update time conflict shadows
    $.each($(".occupied"), function () {
        var cell = $(this);
        var code = $(cell).children("div.lesson").eq(0).attr('name').split("_")[0];
        var hasDate = $(cell).children("div.lesson").eq(0).attr('datestart') !== ""
            && $(cell).children("div.lesson").eq(0).attr('dateend') !== "";
        var date_start = null, date_end = null;
        if (hasDate) {
            date_start = new Date($(cell).children("div.lesson").eq(0).attr('datestart'));
            date_end = new Date($(cell).children("div.lesson").eq(0).attr('dateend'));
        }
        var weekday = $(cell).parentsUntil("tbody").parent().attr("id");
        var h = $(cell).attr('class').match(/h[0-9]{2}/i);
        var m = $(cell).attr('class').match(/m[0-9]{2}/i);
        var hasConflict = false;
        var oCount = $("#" + weekday + " ." + h + "." + m + ".occupied").length;
        var hCount = $("#" + weekday + " ." + h + "." + m + ".hidden").length;
        if (oCount !== 1 || hCount > 0) {
            if (!hasDate) hasConflict = true;
            else {
                var conflictCourses = $.makeArray($("#" + weekday + " ." + h + "." + m + ".occupied"));
                $.each($("#" + weekday + " ." + h + "." + m + ".hidden"), function () {
                    conflictCourses.push($(this).prevUntil('.occupied').prev());
                });
                console.log(conflictCourses)
                for (var i = 0; i < conflictCourses.length && !hasConflict; i++) {
                    var course_div = $(conflictCourses[i]).children("div.lesson").eq(0);
                    var $course_div = $(course_div);
                    if (!$course_div.attr("name") || code === $course_div.attr('name').split("_")[0]) continue;
                    var c_hasDate = $(course_div).attr('datestart') !== "" && $(course_div).attr('dateend') !== "";
                    var c_date_start = null, c_date_end = null;
                    if (c_hasDate) {
                        c_date_start = new Date($(course_div).attr('datestart'));
                        c_date_end = new Date($(course_div).attr('dateend'));
                        if (!(+date_start >= +c_date_end || +date_end <= +c_date_start)) {
                            hasConflict = true;
                        }
                    }
                    else {
                        hasConflict = true;
                    }
                }
            }
        }
        var next = $(cell).next();
        while ($(next).hasClass('hidden') && !hasConflict) {
            h = $(next).attr('class').match(/h[0-9]{2}/i);
            m = $(next).attr('class').match(/m[0-9]{2}/i);
            oCount = $("#" + weekday + " ." + h + "." + m + ".occupied").length;
            hCount = $("#" + weekday + " ." + h + "." + m + ".hidden").length;
            if (oCount > 0 || hCount !== 1) {
                if (!hasDate) hasConflict = true;
                else {
                    var conflictCourses = $.makeArray($("#" + weekday + " ." + h + "." + m + ".occupied"));
                    $.each($("#" + weekday + " ." + h + "." + m + ".hidden"), function () { // eslint-disable-line no-loop-func
                        conflictCourses.push($(this).prevAll('.occupied').eq(0));
                    });
                    for (var i = 0; i < conflictCourses.length && !hasConflict; i++) {
                        var course_div = $(conflictCourses[i]).children("div.lesson").eq(0);
                        if (code === $(course_div).attr('name').split("_")[0]) continue;
                        var c_hasDate = $(course_div).attr('datestart') !== "" && $(course_div).attr('dateend') !== "";
                        var c_date_start = null, c_date_end = null;
                        if (c_hasDate) {
                            c_date_start = new Date($(course_div).attr('datestart'));
                            c_date_end = new Date($(course_div).attr('dateend'));
                            if (!(+date_start >= +c_date_end || +date_end <= +c_date_start)) {
                                hasConflict = true;
                            }
                        }
                        else {
                            hasConflict = true;
                        }
                    }
                }
            }
            next = $(next).next();
        }
        $(cell).children('.lesson').removeClass('time-conflict');
        if (hasConflict) $(cell).children('.lesson').addClass('time-conflict');
    });
}
