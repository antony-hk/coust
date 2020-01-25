import $ from 'jquery';

import storeValue from './storeValue';

export default function switchView() {
    if ($("#timetable_wrapper").hasClass("vertical-timetable")) {
        $("#timetable_wrapper").removeClass("vertical-timetable");
        storeValue('vertical', false);
    }
    else {
        $("#timetable_wrapper").addClass("vertical-timetable");
        storeValue('vertical', true);
    }
    window.scrollTo(0, 0);
}
