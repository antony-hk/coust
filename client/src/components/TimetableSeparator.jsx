import { memo } from 'react';
import styles from './TimetableSeparator.module.css';

const TimetableSeparator = memo(() => {
    return (
        <tr className={styles.separator}>
            <th />
            <td colSpan={28} />
        </tr>
    );
});

export default TimetableSeparator;
