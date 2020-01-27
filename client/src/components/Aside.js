import React from 'react';
import { useDispatch } from 'react-redux';

import { openFaqDialog } from '../actions/faqDialog';
import getShareLink from '../timetable/getShareLink';

import Button from './Button';

import styles from './Aside.module.css';

const Aside = (props) => {
    const dispatch = useDispatch();

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
                    <Button
                        className={styles.faqButton}
                        onClick={() => dispatch(openFaqDialog)}
                    >
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
