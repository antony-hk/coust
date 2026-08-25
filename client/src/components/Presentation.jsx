import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import styles from './Presentation.module.css';

const Presentation = (props) => {
    const bodyNode = document.body;

    useEffect(() => {
        bodyNode.style.overflow = 'hidden';

        return () => {
            bodyNode.style.overflow = null;
        };
    });

    return ReactDOM.createPortal(
        <div className={styles.presentation}>
            <div className={styles.backdrop} />
            <div className={styles.content}>
                {props.children}
            </div>
        </div>,
        bodyNode,
    );
};

export default Presentation;
