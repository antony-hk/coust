import clsx from 'clsx';

import styles from './Button.module.css';

const Button = (props) => {
    return (
        <button
            {...props}
            className={clsx(styles.button, props.className)}
        >
            <span className={styles.text}>
                {props.children}
            </span>
        </button>
    )
};

export default Button;
