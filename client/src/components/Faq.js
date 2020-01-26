import React, { useEffect } from 'react';

// jQuery stuffs, should be removed in the future.
import $ from 'jquery';
import 'jquery-ui/themes/base/button.css';
import 'jquery-ui/themes/base/dialog.css';
import 'jquery-ui/ui/widgets/dialog';

import styles from './Faq.module.css';

const Faq = (props) => {
    useEffect(() => {
        // UI stuff
        $('#faq').dialog({
            autoOpen: false,
            width: 800,
            buttons: [
                {
                    text: 'Close',
                    click: function () {
                        $(this).dialog('close');
                    }
                }
            ]
        });
    });

    return (
        <div
            title="FAQ"
            id="faq"
            className={styles.faq}
        >
            <p>
                <strong>Q:</strong> Is data always up-to-date?<br />
                <strong>A:</strong> No, data have to be manually updated by running <a rel="noopener noreferrer" target="_blank" href="//coust.442.hk/json/mkdata.php">this page</a> to obtain and save data from <a rel="noopener noreferrer" target="_blank" href="https://w5.ab.ust.hk/wcq/cgi-bin/">HKUST Class Schedule and Quota</a> by crawling and parsing the website, i.e. data are correct up to the latest time of running the data retrieving page.<br />
            </p>
            <p>
                <strong>Q:</strong> What is READ-ONLY Mode?<br />
                <strong>A:</strong> In READ-ONLY Mode, you can only view the timetable. And your original timetable in non read mode will not be affected. You may exit read mode and view your own timetable by clicking the logo (which returns to the home page).<br />
            </p>
            <p>
                <strong>Q:</strong> Does the web app supports all browsers?<br />
                <strong>A:</strong> No, the web app uses jQuery and thus requires browser version supporting jQuery (e.g. IE9+).<br />
            </p>
            <p>
			    <strong>If you any enquires, please find us on <a href="https://www.facebook.com/CoUST.HK">our Facebook page</a>.</strong><br />
			</p>
            <p>
                <strong>GitHub:</strong> <a rel="noopener noreferrer" target="_blank" href="https://github.com/antonytse/CoUST">https://github.com/antonytse/CoUST</a><br />
            </p>
            <p>
                <strong>Authors:</strong> Alan Chung, Antony Tse<br />
            </p>
        </div>
    );
};

export default Faq;
