import $ from 'jquery';

import updateConflictStyle from './updateConflictStyle';

// row: tr element object
function isRowEmpty(row) {
    let isEmpty = true;
    $(row).children("td").each(function () {
        if ($(this).hasClass("occupied") || $(this).hasClass("hidden")) {
            isEmpty = false;
        }
    });
    return isEmpty;
}

// remove empty row
export default function compactTable() {
    // shift course box to upper rows if space available
    $(".days").each(function () {
        const rowCount = $(this).children("tr").length;
        for (let rowN = 0; rowN < rowCount - 1 && rowCount > 1; rowN++) {
            const upperRow = $(this).children("tr").eq(rowN);
            for (let i = rowN + 1; i < rowCount; i++) {
                const row = $(this).children("tr").eq(i);
                $.each($(row).children("td").filter(".occupied"), function () { // eslint-disable-line no-loop-func
                    const sh = $(this).attr('class').match(/h[0-9]{2}/i);
                    const sm = $(this).attr('class').match(/m[0-9]{2}/i);
                    let upperRowHasRoom = true;
                    if (
                        $(upperRow).find("." + sh + "." + sm).hasClass('occupied') ||
                        $(upperRow).find("." + sh + "." + sm).hasClass('hidden')
                    ) {
                        upperRowHasRoom = false;
                    }
                    let next = $(this).next();
                    while ($(next).hasClass('hidden') && upperRowHasRoom) {
                        const h = $(next).attr('class').match(/h[0-9]{2}/i);
                        const m = $(next).attr('class').match(/h[0-9]{2}/i);
                        if (
                            $(upperRow).find("." + h + "." + m).hasClass('occupied') ||
                            $(upperRow).find("." + h + "." + m).hasClass('hidden')
                        ) {
                            upperRowHasRoom = false;
                        }
                        next = $(next).next();
                    }
                    if (upperRowHasRoom) {
                        const courseDiv = $(this).children('.lesson').eq(0);
                        const colSpan = $(this).attr('colspan');
                        $(this).removeAttr('colspan');
                        let cell = $(upperRow).find(`.${sh}.${sm}`);
                        $(cell).addClass('occupied');
                        $(cell).attr('colspan', colSpan);
                        $(cell).append(courseDiv);
                        let next = $(this).next();
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
        const weekTh = $("#" + $(this).attr("id") + " .weekday");
        let rowSpan = parseInt($(weekTh).attr("rowspan"), 10);
        const rowCount = $(this).children("tr").length;
        if (rowCount > 1) {
            for (let i = 1; i < rowCount; i++) {
                const row = $(this).children("tr").eq(i);
                if (isRowEmpty(row)) {
                    $(row).addClass("remove");
                    rowSpan--;
                }
            }
            $(weekTh).attr("rowspan", rowSpan);
            $("tr.remove").remove();
            const firstRow = $(this).children("tr").eq(0);
            if (isRowEmpty(firstRow) && $(this).children("tr").length > 1) {
                rowSpan--;
                $(weekTh).attr("rowspan", rowSpan);
                $(this).children("tr").eq(1).prepend($(weekTh));
                $(firstRow).remove();
            }
        }
    });

    // clear time-conflict class
    $(".days").each(function () {
        const rowCount = $(this).children("tr").length;
        if (rowCount === 1) {
            $(this).find('.time-conflict').removeClass('time-conflict');
        }
    });
    let isSaturdayEmpty = true;
    $("#Sa").children("tr").each(function () {
        if (!isRowEmpty($(this))) {
            isSaturdayEmpty = false;
            return false;
        }
    });
    if (isSaturdayEmpty) {
        $("#Sa").removeClass("hidden").addClass("hidden");
    }
    let isSundayEmpty = true;
    $("#Su").children("tr").each(function () {
        if (!isRowEmpty($(this))) {
            isSundayEmpty = false;
            return false;
        }
    });
    if (isSundayEmpty) {
        $("#Su").removeClass("hidden").addClass("hidden");
    }

    // add a spare tr to each weekday if only one row
    $(".days").each(function () {
        const rowCount = $(this).children("tr").length;
        if (rowCount === 1) {
            $(this).children("tr").find("th.weekday").attr("rowspan", 2);
            $(this).append(`
                <tr class="spare-tr">
                    <td class="h09 m00"></td>
                    <td class="h09 m30"></td>
                    <td class="h10 m00"></td>
                    <td class="h10 m30"></td>
                    <td class="h11 m00"></td>
                    <td class="h11 m30"></td>
                    <td class="h12 m00"></td>
                    <td class="h12 m30"></td>
                    <td class="h13 m00"></td>
                    <td class="h13 m30"></td>
                    <td class="h14 m00"></td>
                    <td class="h14 m30"></td>
                    <td class="h15 m00"></td>
                    <td class="h15 m30"></td>
                    <td class="h16 m00"></td>
                    <td class="h16 m30"></td>
                    <td class="h17 m00"></td>
                    <td class="h17 m30"></td>
                    <td class="h18 m00"></td>
                    <td class="h18 m30"></td>
                    <td class="h19 m00"></td>
                    <td class="h19 m30"></td>
                    <td class="h20 m00"></td>
                    <td class="h20 m30"></td>
                    <td class="h21 m00"></td>
                    <td class="h21 m30"></td>
                    <td class="h22 m00"></td>
                    <td class="h22 m30"></td>
                </tr>
            `);
        }
    });

    updateConflictStyle();
}
