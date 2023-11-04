import $ from 'jquery';

import 'jquery-ui/ui/core';

import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';

import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';

import 'jquery-ui/themes/base/autocomplete.css';
import 'jquery-ui/themes/base/draggable.css';
import 'jquery-ui/themes/base/menu.css';

import './color.css';
import './override-jquery-ui.css';

import compactTable from './timetable/compactTable';
import loadFromUrlOrStorage from './timetable/loadFromUrlOrStorage';

window.jQuery = $;
require('jquery-ui-touch-punch');

// TODO: Remove global variables
window.readMode = false;
window.color = 0;
window.courseColor = [];

window.API_PATH = 'https://coust.442.hk/';
window.CLIENT_PATH = 'https://coust.github.io/';
window.COOKIE_EXPIRE_DAYS = 50;

function oldTimetableScript(data) {
    // load courses added from cookies
    loadFromUrlOrStorage(data);
    compactTable();
}

export default oldTimetableScript;
