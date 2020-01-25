import getURL from './getURL';

export default function shareTimetable() {
    var url = getURL();
    url = window.CLIENT_PATH + url.substr(2);
    window.FB.ui(
        {
            method: 'share',
            href: url
        }, function (response) {
        }
    );
}
