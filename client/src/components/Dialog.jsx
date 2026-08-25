
import styles from './Dialog.module.css';
import Button from './Button';

const Dialog = (props) => {
    return (
        <div className={styles.dialog}>
            <div className={styles.title}>{props.title}</div>
            <div className={styles.content}>
                {props.children}
            </div>
            <div className={styles.actions}>
                {props.actions.map((action, index) => (
                    <Button
                        key={index}
                        onClick={action.onClick}
                    >
                        {action.label}
                    </Button>
                ))}
            </div>
        </div>
    )
};

export default Dialog;
