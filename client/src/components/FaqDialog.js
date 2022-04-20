import { useSelector, useDispatch } from 'react-redux';

import { closeFaqDialog } from '../actions/faqDialog';

import Dialog from './Dialog';
import Presentation from './Presentation';

import styles from './FaqDialog.module.css';

const FaqDialog = () => {
    const isFaqDialogOpened = useSelector(state => state.app.isFaqDialogOpened);
    const dispatch = useDispatch();

    if (!isFaqDialogOpened) {
        return null;
    }

    const dialogActions = [
        { label: 'Close', onClick: () => dispatch(closeFaqDialog) },
    ];

    return (
        <Presentation>
            <Dialog title="FAQ" actions={dialogActions}>
                <div className={styles.faq}>
                    <p>
                        <strong>Q:</strong> Is data always up-to-date?<br />
                        <strong>A:</strong> No, data have to be manually updated by running <a rel="noopener noreferrer" target="_blank" href="//coust.442.hk/json/mkdata.php">this page</a> to obtain and save data from <a rel="noopener noreferrer" target="_blank" href="https://w5.ab.ust.hk/wcq/cgi-bin/">HKUST Class Schedule and Quota</a> by crawling and parsing the website, i.e. data are correct up to the latest time of running the data retrieving page.<br />
                    </p>
                    <p>
                        <strong>Q:</strong> What is READ-ONLY Mode?<br />
                        <strong>A:</strong> In READ-ONLY Mode, you can only view the timetable. And your original timetable in non read mode will not be affected. You may exit read mode and view your own timetable by clicking the logo (which returns to the home page).<br />
                    </p>
                    <p>
                        <strong>Q:</strong> What browsers does the web-app support?<br />
                        <strong>A:</strong> This web-app supports the latest version of Chrome, Firefox, Safari and Microsoft Edge.<br />
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
            </Dialog>
        </Presentation>
    );
};

export default FaqDialog;
