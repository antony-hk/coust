import React from 'react';

export default class TimetableSeparator extends React.PureComponent {
    render() {
        return (
            <tr className="separator">
                <th />
                <td colSpan={28} />
            </tr>
        );
    }
}
