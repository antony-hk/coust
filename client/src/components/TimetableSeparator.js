import React from 'react';
import styles from './TimetableSeparator.module.css';

export default class TimetableSeparator extends React.PureComponent {
    render() {
        return (
            <tr className={styles.separator}>
                <th />
                <td colSpan={28} />
            </tr>
        );
    }
}
