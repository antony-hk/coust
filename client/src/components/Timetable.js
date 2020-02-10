import React from 'react';
import clsx from 'clsx';

import TimetableSeparator from './TimetableSeparator';

import styles from './Timetable.module.css';

// TODO: jQuery stuffs, should be removed in the future.
import $ from 'jquery';
import 'jquery-ui/ui/widgets/tooltip';
import 'jquery-ui/themes/base/tooltip.css';

function twoDigits(hour) {
    return (`${hour}`.length === 1) ? `0${hour}` : `${hour}`;
}

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

    timetable = React.createRef();

    componentDidMount() {
        const timetableEl = this.timetable.current;

        $(timetableEl).tooltip({
            position: {
                my: 'left+15 center',
                at: 'right center+5',
            },
            tooltipClass: styles.customTooltipStyle,
        });

        $(timetableEl).on('mouseover mouseleave', 'td', function (e) {
            if (e.target.className === "separator" || e.target.className === "times-tr"
                || e.target.className === "timediv" || e.target.className === "time") {

            }
            else if (e.type === 'mouseover') {
                var $el = $(this);
                $el.parent().parent().find("td").addClass("hover"); // weekday
                var hour_class = $el.attr("class").match(/h[0-2][0-9]/i);
                if (hour_class) $("." + hour_class).addClass("hover");

            }
            else {
                var $el = $(this);
                $el.parent().parent().find("td").removeClass("hover"); // weekday
                var hour_class = $el.attr("class").match(/h[0-2][0-9]/i);
                if (hour_class) $("." + hour_class).removeClass("hover");

            }
        });
    }

    _renderHour(hour, index) {
        return (
            <React.Fragment key={index}>
                <th className={styles.time}>
                    <div className={styles.timeDiv}>{twoDigits(hour)}:00</div>
                </th>
                <th className={clsx(styles.time, styles.alt)}>
                    <div className={styles.timeDiv}>
                        {twoDigits(hour)}:30
                    </div>
                </th>
            </React.Fragment>
        );
    }

    _renderWeekday(weekdayId, index) {
        return (
            <React.Fragment key={index}>
                <tbody id={weekdayId} className={clsx(styles.days, 'days')}>
                    <tr>
                        <th className={clsx(styles.weekday, 'weekday')} rowSpan={1}>
                            {this.weekdays[weekdayId]}
                        </th>
                        {this.hours.map((hour, index) => ((hour === 23) ? null : (
                            <React.Fragment key={index}>
                                <td className={`h${twoDigits(hour)} m00`} />
                                <td className={`h${twoDigits(hour)} m30`} />
                            </React.Fragment>
                        )))}
                    </tr>
                </tbody>
                {(index < this.weekdays.size - 1) ? null : <TimetableSeparator />}
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className={styles.timetableContainer}>
                <table
                    ref={this.timetable}
                    id="timetable"
                    className={clsx(styles.timetable, 'content')}
                >
                    <colgroup />
                    {this.hours.map((hour, index) => (
                        <colgroup key={index} span={2} />
                    ))}
                    <tbody>
                        <tr className={styles.timesTr}>
                            {this.hours.map((hour, index) => this._renderHour(hour, index))}
                        </tr>
                    </tbody>
                    {Object.keys(this.weekdays).map((weekdayId, index) => this._renderWeekday(weekdayId, index))}
                </table>
            </div>
        );
    }
}
