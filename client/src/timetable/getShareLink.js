import $ from 'jquery';

import getURL from './getURL';

export default function getShareLink(data) {
    let url = getURL(data);
    url = window.CLIENT_PATH + url.substring(2);
    $("#shareLinkInput").val(url).show().select();
    const failMsg = "Press CTRL+C (Windows) to Copy.";
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            $("#copyResult").text('Copied to the clipboard automatically.');
        } else {
            $("#copyResult").text(failMsg);
        } 
    } catch (e) {
        $("#copyResult").text(failMsg);
    }
}
