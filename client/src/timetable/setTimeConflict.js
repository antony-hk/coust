import $ from 'jquery';

export default function setTimeConflict(weekday, start, end) {
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
    if (endm <= 30) endm = 0;
    else if (endm <= 60) endm = 30;
    for (var i = starth; i <= endh; i++) {
        for (var j = 0; j < 60; j += 30) {
            if (i === starth && j < startm) continue;
            if (i === endh && j > endm) break;
            var h = "h".concat((i < 10) ? ("0".concat(i)) : i);
            var m = "m".concat((j < 10) ? "0".concat(j) : j);
            //$("#"+weekday+" ."+h+"."+m).removeClass('time-conflict').addClass('time-conflict');
            $.each($("#" + weekday + " ." + h + "." + m), function () {
                if ($(this).hasClass('hidden')) {
                    var firstcell = $(this).prevUntil('.occupied').prev();
                    $(firstcell).children('.lesson').removeClass('time-conflict').addClass('time-conflict');
                }
                else if ($(this).hasClass('occupied')) {
                    $(this).children('.lesson').removeClass('time-conflict').addClass('time-conflict');
                }
            });
        }
    }
}
