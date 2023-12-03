import { useContext, useState } from 'react';
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
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [copyResult, setCopyResult] = useState("");
    const [shareURL, setShareURL] = useState("");
    const dispatch = useDispatch();

    const handleShareButtonClick = () => {
        if (!data) {
            return;
        };

        setShowLinkInput(true);

        const newURL =
            CLIENT_PATH +
            getURL(data.terms.current, store.getState().app.timetable)
                .substring(2);
        setShareURL(newURL);

        if (!navigator.clipboard) {
            setCopyResult('Press CTRL+C (Windows) to Copy.');
            return;
        };
        navigator.clipboard.writeText(newURL).then(
            () => {
                setCopyResult('Copied to the clipboard automatically.');
            },
            () => {
                setCopyResult('Press CTRL+C (Windows) to Copy.');
            },
        );
    };

    return (
        <div className={styles.aside}>
            <div>
                {showLinkInput && (
                    <div className={styles.shareLinkInputContainer}>
                        <input
                            className={styles.shareLinkInput}
                            type="text"
                            value={shareURL}
                        />
                    </div>
                )}
                <div className={styles.copyResult} id="copyResult">
                    {copyResult}
                </div>
                <div className={styles.buttonSet}>
                    <div className={styles.buttonContainer}>
                        <Button
                            className={styles.shareButton}
                            onClick={handleShareButtonClick}
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
