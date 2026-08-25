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
                        <strong>Q:</strong> Is data always up to date?<br />
                        <strong>A:</strong> No. Data is updated manually by running <a rel="noopener noreferrer" target="_blank" href="//coust.442.hk/mkdata.php">the crawler page</a>, which immediately crawls and parses <a rel="noopener noreferrer" target="_blank" href="https://w5.ab.ust.hk/wcq/cgi-bin/">HKUST Class Schedule and Quota</a>. Therefore, data is only current as of the last time the crawler page was run. A migration to use GitHub Actions or something similar for daily updates is planned.<br />
                    </p>
                    <p>
                        <strong>Q:</strong> What browsers does CoUST support?<br />
                        <strong>A:</strong> CoUST supports the latest versions of Chrome, Firefox, Safari and Microsoft Edge.<br />
                    </p>
                    <p>
                        <strong>If you have any enquiries, please contact us on <a rel="noopener noreferrer" target="_blank" href="https://github.com/antony-hk/coust">GitHub</a>.</strong><br />
                    </p>
                    <p>
                        <strong>GitHub repository:</strong> <a rel="noopener noreferrer" target="_blank" href="https://github.com/antony-hk/coust">https://github.com/antony-hk/coust</a><br />
                    </p>
                    <p>
                        <strong>This project was originally founded by <a rel="noopener noreferrer" target="_blank" href="https://github.com/antony-hk">Antony Tse</a> and <a rel="noopener noreferrer" target="_blank" href="https://github.com/avery-chung">Avery Chung</a>.</strong><br />
                        <br />
                        <strong>Main developer:</strong> <a rel="noopener noreferrer" target="_blank" href="https://github.com/antony-hk">Antony Tse</a><br />
                        <strong>Contributors: <a rel="noopener noreferrer" target="_blank" href="https://github.com/avery-chung">Avery Chung</a>, <a rel="noopener noreferrer" target="_blank" href="https://github.com/tin-cheng">Tin Cheng</a></strong>
                    </p>
                </div>
            </Dialog>
        </Presentation>
    );
};

export default FaqDialog;
