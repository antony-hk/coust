import $ from 'jquery';

export default function updateConflictStyle() {
    // update time conflict shadows
    $.each($(".occupied"), function () {
        const cell = $(this);
        const code = $(cell).children("div.lesson").eq(0).attr('name').split("_")[0];
        const hasDate = (
            $(cell).children("div.lesson").eq(0).attr('datestart') !== "" &&
            $(cell).children("div.lesson").eq(0).attr('dateend') !== ""
        );
        let dateStart = null,
            dateEnd = null;
        if (hasDate) {
            dateStart = new Date($(cell).children("div.lesson").eq(0).attr('datestart'));
            dateEnd = new Date($(cell).children("div.lesson").eq(0).attr('dateend'));
        }
        const weekday = $(cell).parentsUntil("tbody").parent().attr("id");
        let h = $(cell).attr('class').match(/h[0-9]{2}/i);
        let m = $(cell).attr('class').match(/m[0-9]{2}/i);
        let hasConflict = false;
        let occupiedCount = $(`#${weekday} .${h}.${m}.occupied`).length;
        let hiddenCount = $(`#${weekday} .${h}.${m}.hidden`).length;
        if (occupiedCount !== 1 || hiddenCount > 0) {
            if (!hasDate) {
                hasConflict = true;
            } else {
                const conflictCourses = $.makeArray($(`#${weekday} .${h}.${m}.occupied`));
                $.each($(`#${weekday} .${h}.${m}.hidden`), function () {
                    conflictCourses.push($(this).prevUntil('.occupied').prev());
                });
                // console.log(conflictCourses);
                for (let i = 0; i < conflictCourses.length && !hasConflict; i++) {
                    const courseDiv = $(conflictCourses[i]).children("div.lesson").eq(0);
                    if (
                        !$(courseDiv).attr("name") ||
                        code === $(courseDiv).attr('name').split("_")[0]
                    ) {
                        continue;
                    }
                    const courseHasDate = (
                        $(courseDiv).attr('datestart') !== "" &&
                        $(courseDiv).attr('dateend') !== ""
                    );
                    if (courseHasDate) {
                        const courseDateStart = new Date($(courseDiv).attr('datestart'));
                        const courseDateEnd = new Date($(courseDiv).attr('dateend'));
                        if (!(+dateStart >= +courseDateEnd || +dateEnd <= +courseDateStart)) {
                            hasConflict = true;
                        }
                    } else {
                        hasConflict = true;
                    }
                }
            }
        }
        let next = $(cell).next();
        while ($(next).hasClass('hidden') && !hasConflict) {
            h = $(next).attr('class').match(/h[0-9]{2}/i);
            m = $(next).attr('class').match(/m[0-9]{2}/i);
            occupiedCount = $(`#${weekday} .${h}.${m}.occupied`).length;
            hiddenCount = $(`#${weekday} .${h}.${m}.hidden`).length;
            if (occupiedCount > 0 || hiddenCount !== 1) {
                if (!hasDate) {
                    hasConflict = true;
                } else {
                    const conflictCourses = $.makeArray($(`#${weekday} .${h}.${m}.occupied`));
                    $.each($(`#${weekday} .${h}.${m}.hidden`), function () {
                        conflictCourses.push($(this).prevAll('.occupied').eq(0));
                    });
                    for (let i = 0; i < conflictCourses.length && !hasConflict; i++) {
                        const courseDiv = $(conflictCourses[i]).children("div.lesson").eq(0);
                        if (code === $(courseDiv).attr('name').split("_")[0]) {
                            continue;
                        }
                        const courseHasDate = (
                            $(courseDiv).attr('datestart') !== "" &&
                            $(courseDiv).attr('dateend') !== ""
                        );
                        if (courseHasDate) {
                            const courseDateStart = new Date($(courseDiv).attr('datestart'));
                            const courseDateEnd = new Date($(courseDiv).attr('dateend'));
                            if (!(+dateStart >= +courseDateEnd || +dateEnd <= +courseDateStart)) {
                                hasConflict = true;
                            }
                        } else {
                            hasConflict = true;
                        }
                    }
                }
            }
            next = $(next).next();
        }
        $(cell).children('.lesson').removeClass('time-conflict');
        if (hasConflict) {
            $(cell).children('.lesson').addClass('time-conflict');
        }
    });
}
