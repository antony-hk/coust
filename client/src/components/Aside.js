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
            <div>
                <div className={styles.shareLinkInputContainer}>
                    <input
                        id="shareLinkInput"
                        className={styles.shareLinkInput}
                        type="text"
                    />
                </div>
                <div className={styles.copyResult} id="copyResult" />
                <div className={styles.buttonSet}>
                    <div className={styles.buttonContainer}>
                        <Button
                            className={styles.shareButton}
                            onClick={() => getShareLink()}
                        >
                            Get Share Link
                        </Button>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button
                            className={styles.faqButton}
                            onClick={() => dispatch(openFaqDialog)}
                        >
                            Show FAQ
                        </Button>
                    </div>
                </div>
            </div>
            <div>
                <p className={styles.lastUpdate}>
                    {`Data last updated: `}
                    <br />
                    <span id="update-time" />
                </p>
            </div>
        </div>
    );
};

export default Aside;
