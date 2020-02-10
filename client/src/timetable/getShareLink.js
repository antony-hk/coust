import $ from 'jquery';

import getURL from './getURL';

export default function getShareLink() {
    var url = getURL();
    url = window.CLIENT_PATH + url.substr(2);
    $("#shareLinkInput").val(url).show().select();
    var failmsg = "Press CTRL+C (Windows) to Copy.";
    try {
        var successful = document.execCommand('copy');
        if (successful) $("#copyResult").text('Copied to the clipboard automatically.');
        else $("#copyResult").text(failmsg);
    } catch (e) {
        $("#copyResult").text(failmsg);
    }
}
