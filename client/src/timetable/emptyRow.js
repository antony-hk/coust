import $ from 'jquery';

// row: tr element object
export default function emptyRow(row) {
    var empty = true;
    $(row).children("td").each(function () {
        if ($(this).hasClass("occupied") || $(this).hasClass("hidden")) {
            empty = false;
        }
    });
    return empty;
}
