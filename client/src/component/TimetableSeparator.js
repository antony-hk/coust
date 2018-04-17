import React from 'react';

export default class TimetableSeparator extends React.PureComponent {
    render() {
        return (
            <tr className="separator">
                <th />
                <td colspan={28} />
            </tr>
        );
    }
}
