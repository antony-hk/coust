import $ from 'jquery';

import compactTable from './compactTable';

export default function removeVirtualCourse(code) {
    $(`td.occupied div.lesson.virtual.${code}`).each(function () {
        const cell = $(this).parent();
        const colSpan = $(cell).attr("colspan");
        $(cell).removeAttr("colspan");
        $(cell).removeClass("occupied");
        let next = $(cell).next();
        for (let i = 1; i < colSpan; i++) {
            $(next).removeClass("hidden");
            next = $(next).next();
        }
        $(this).remove();
    });
    compactTable();
}
