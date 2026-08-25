import $ from 'jquery';

// Separate module: ES imports are hoisted, so setting the global alongside the
// jQuery UI imports would run too late. Keep it out of jquery-ui.js.
window.jQuery = $;
window.$ = $;
