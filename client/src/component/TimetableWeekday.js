import React from 'react';

function twoDigits(hour) {
    return (`${hour}`.length === 1) ? `0${hour}` : `${hour}`;
}

export default class TimetableWeekday extends React.PureComponent {
    render() {
        const {
            hours,
            id,
            label,
        } = this.props;

        return (
            <tbody id={id} className="days">
                <tr>
                    <th className="weekday" rowspan={1}>{label}</th>
                    {hours.map((hour, index) => ((hour === 23) ? null : (
                        <React.Fragment key={index}>
                            <td className={`h${twoDigits(hour)} m00`} />
                            <td className={`h${twoDigits(hour)} m30`} />
                        </React.Fragment>
                    )))}
                </tr>
            </tbody>
        );
    }
}
