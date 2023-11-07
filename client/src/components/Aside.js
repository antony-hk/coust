import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { openFaqDialog } from '../actions/faqDialog';
import DataContext from '../context';
import { CLIENT_PATH } from '../constants';
import store from '../store';
import getURL from '../utils/getURL';

import Button from './Button';

import styles from './Aside.module.css';

const Aside = () => {
    const data = useContext(DataContext);
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [copyResult, setcopyResult] = useState("")
    const [shareURL, setShareURL] = useState("")
    const dispatch = useDispatch();
    const getShareLink = () => {
        if (!data) {
            return;
        }
        setShowLinkInput(true);
        setShareURL(CLIENT_PATH
            + getURL(data.terms.current, store.getState().app.timetable).substring(2)
        );
        if (!navigator.clipboard) { //|| !window.isSecureContext) {
            setcopyResult('Press CTRL+C (Windows) to Copy.');
            return;
        }
        navigator.clipboard.writeText(shareURL).then(
            () => {
                setcopyResult('Copied to the clipboard automatically.');
            },
            () => {
                setcopyResult('Press CTRL+C (Windows) to Copy.');
            },
        );
    };

    useEffect(() => {
        getShareLink();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shareURL]);

    return (
        <div className={styles.aside}>
            <div>
                <div className={styles.shareLinkInputContainer}>
                    <input
                        id="shareLinkInput"
                        className={styles.shareLinkInput}
                        style={{ display: showLinkInput ? "block" : "none" }}
                        type="text"
                        value={shareURL}
                    />
                </div>
                <div className={styles.copyResult} id="copyResult">
                    {copyResult}
                </div>
                <div className={styles.buttonSet}>
                    <div className={styles.buttonContainer}>
                        <Button
                            className={styles.shareButton}
                            onClick={() => getShareLink(data)}
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
                    {data?.lastUpdated || ''}
                </p>
            </div>
        </div>
    );
};

export default Aside;
