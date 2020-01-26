import $ from 'jquery';

import compactTable from './compactTable';

export default function removeVirtualCourse(code) {
    $("td.occupied div.lesson.virtual." + code).each(function () {
        var cell = $(this).parent();
        var colspan = $(cell).attr("colspan");
        $(cell).removeAttr("colspan");
        $(cell).removeClass("occupied");
        var next = $(cell).next();
        for (var i = 1; i < colspan; i++) {
            $(next).removeClass("hidden");
            next = $(next).next();
        }
        $(this).remove();
    });
    compactTable();
}
