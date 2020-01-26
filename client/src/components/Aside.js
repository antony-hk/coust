import React, { useEffect } from 'react';

import getShareLink from '../timetable/getShareLink';

import Button from './Button';

import styles from './Aside.module.css';

// jQuery stuffs, should be removed in the future.
import $ from 'jquery';

const Aside = () => {
    useEffect(() => {
        // Link to open the dialog
        $("#show-faq").click(function (event) {
            $("#faq").dialog("open");
            event.preventDefault();
        });
    });

    return (
        <div className={styles.aside}>
            <div id="dialog" />
            <div>
                <p>
                    <input
                        id="shareLinkInput"
                        className={styles.shareLinkInput}
                        type="text"
                    />
                </p>
                <p className={styles.copyResult} id="copyResult"></p>
                <p><Button onClick={() => getShareLink()}>Get Share Link</Button></p>
                <p>
                    <Button id="show-faq" className={styles.faqButton}>
                        Show FAQ
                    </Button>
                </p>
            </div>
            <div>
                <p className={styles.lastUpdate}>
                    {`Data Last Updated: `}
                    <br />
                    <span id="update-time" />
                </p>
            </div>
        </div>
    );
};

export default Aside;
