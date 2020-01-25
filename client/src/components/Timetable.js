import React from 'react';

import TimetableSeparator from './TimetableSeparator';
import TimetableTimeLabelRow from './TimetableTimeLabelRow';
import TimetableWeekday from './TimetableWeekday';

export default class Timetable extends React.PureComponent {
    hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    weekdays = {
        Mo: 'MON',
        Tu: 'TUE',
        We: 'WED',
        Th: 'THU',
        Fr: 'FRI',
        Sa: 'SAT',
        Su: 'SUN',
    };

    render() {
        return (
            <table id="timetable" className="content">
                <colgroup />
                {this.hours.map((hour, index) => (
                    <colgroup key={index} span={2} />
                ))}
                <tbody id="times">
                    <TimetableTimeLabelRow hours={this.hours} />
                </tbody>
                {Object.keys(this.weekdays).map((weekdayId, index) => (
                    <React.Fragment key={index}>
                        <TimetableWeekday
                            hours={this.hours}
                            id={weekdayId}
                            label={this.weekdays[weekdayId]}
                        />
                        {(index < this.weekdays.size - 1) ? null : <TimetableSeparator />}
                    </React.Fragment>
                ))}
            </table>
        );
    }
}
