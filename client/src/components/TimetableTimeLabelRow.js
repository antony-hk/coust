import React from 'react';

function twoDigits(hour) {
    return (`${hour}`.length === 1) ? `0${hour}` : `${hour}`;
}

export default class TimetableDay extends React.PureComponent {
    render() {
        return (
            <tr className="times-tr">
                {this.props.hours.map((hour, index) => (
                    <React.Fragment key={index}>
                        <td className="time">
                            <div className="timediv">
                                {twoDigits(hour)}:00
                            </div>
                        </td>
                        <td className="time alt">
                            <div className="timediv">
                                {twoDigits(hour)}:30
                            </div>
                        </td>
                    </React.Fragment>
                ))}
            </tr>
        );
    }
}
