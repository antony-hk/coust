import $ from 'jquery';

import emptyRow from './emptyRow';
import updateConflictStyle from './updateConflictStyle';

// remove empty row
export default function compactTable() {
    // shift course box to upper rows if space available
    $(".days").each(function () {
        var rowcount = $(this).children("tr").length;
        for (var rowN = 0; rowN < rowcount - 1 && rowcount > 1; rowN++) {
            var upperRow = $(this).children("tr").eq(rowN);
            for (var i = rowN + 1; i < rowcount; i++) {
                var row = $(this).children("tr").eq(i);
                $.each($(row).children("td").filter(".occupied"), function () { // eslint-disable-line no-loop-func
                    var sh = $(this).attr('class').match(/h[0-9]{2}/i);
                    var sm = $(this).attr('class').match(/m[0-9]{2}/i);
                    var upperRowHasRoom = true;
                    if ($(upperRow).find("." + sh + "." + sm).hasClass('occupied')
                        || $(upperRow).find("." + sh + "." + sm).hasClass('hidden')) {
                        upperRowHasRoom = false;
                    }
                    var next = $(this).next();
                    while ($(next).hasClass('hidden') && upperRowHasRoom) {
                        var h = $(next).attr('class').match(/h[0-9]{2}/i);
                        var m = $(next).attr('class').match(/h[0-9]{2}/i);
                        if ($(upperRow).find("." + h + "." + m).hasClass('occupied')
                            || $(upperRow).find("." + h + "." + m).hasClass('hidden')) {
                            upperRowHasRoom = false;
                        }
                        next = $(next).next();
                    }
                    if (upperRowHasRoom) {
                        var courseDiv = $(this).children('.lesson').eq(0);
                        var colspan = $(this).attr('colspan');
                        $(this).removeAttr('colspan');
                        var cell = $(upperRow).find("." + sh + "." + sm);
                        $(cell).addClass('occupied');
                        $(cell).attr('colspan', colspan)
                        $(cell).append(courseDiv);
                        var next = $(this).next();
                        while ($(next).hasClass('hidden')) {
                            cell = $(cell).next();
                            $(cell).addClass('hidden');
                            $(next).removeClass('hidden');
                            next = $(next).next();
                        }
                        $(this).children('.lesson').remove();
                        $(this).removeClass('occupied');
                    }
                });
            }
        }
    });

    // clear empty rows
    $(".days").each(function () {
        var weekth = $("#" + $(this).attr("id") + " .weekday");
        var rowspan = parseInt($(weekth).attr("rowspan"), 10);
        var rowcount = $(this).children("tr").length;
        if (rowcount > 1) {
            for (var i = 1; i < rowcount; i++) {
                var row = $(this).children("tr").eq(i);
                if (emptyRow(row)) {
                    $(row).addClass("remove");
                    rowspan--;
                }
            }
            $(weekth).attr("rowspan", rowspan);
            $("tr.remove").remove();
            var firstRow = $(this).children("tr").eq(0);
            if (emptyRow(firstRow) && $(this).children("tr").length > 1) {
                rowspan--;
                $(weekth).attr("rowspan", rowspan);
                $(this).children("tr").eq(1).prepend($(weekth));
                $(firstRow).remove();
            }
        }
    });

    // clear time-conflict class
    $(".days").each(function () {
        var rowcount = $(this).children("tr").length;
        if (rowcount === 1) {
            $(this).find('.time-conflict').removeClass('time-conflict');
        }
    });
    var sat_empty = true;
    $("#Sa").children("tr").each(function () {
        if (!emptyRow($(this))) {
            sat_empty = false;
            return false;
        }
    });
    if (sat_empty) $("#Sa").removeClass("hidden").addClass("hidden");
    var sun_empty = true;
    $("#Su").children("tr").each(function () {
        if (!emptyRow($(this))) {
            sun_empty = false;
            return false;
        }
    });
    if (sun_empty) $("#Su").removeClass("hidden").addClass("hidden");

    // add a spare tr to each weekday if only one row
    $(".days").each(function () {
        var rowcount = $(this).children("tr").length;
        if (rowcount === 1) {
            $(this).children("tr").find("th.weekday").attr("rowspan", 2);
            $(this).append('<tr class="spare-tr"><td class="h09 m00"></td><td class="h09 m30"></td><td class="h10 m00"></td><td class="h10 m30"></td><td class="h11 m00"></td><td class="h11 m30"></td><td class="h12 m00"></td><td class="h12 m30"></td><td class="h13 m00"></td><td class="h13 m30"></td><td class="h14 m00"></td><td class="h14 m30"></td><td class="h15 m00"></td><td class="h15 m30"></td><td class="h16 m00"></td><td class="h16 m30"></td><td class="h17 m00"></td><td class="h17 m30"></td><td class="h18 m00"></td><td class="h18 m30"></td><td class="h19 m00"></td><td class="h19 m30"></td><td class="h20 m00"></td><td class="h20 m30"></td><td class="h21 m00"></td><td class="h21 m30"></td><td class="h22 m00"></td><td class="h22 m30"></td></tr>');
        }
    });

    updateConflictStyle();
}
