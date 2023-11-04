import $ from 'jquery';
import { convertTime } from './util';

export default function setTimeConflict(weekday, start, end) {
    let { h: startH, m: startM } = convertTime(start);
    let { h: endH, m: endM } = convertTime(end);
    if (endM <= 30) {
        endM = 0;
    } else if (endM <= 60) {
        endM = 30;
    }
    for (let i = startH; i <= endH; i++) {
        for (let j = 0; j < 60; j += 30) {
            if (i === startH && j < startM) {
                continue;
            }
            if (i === endH && j > endM) {
                break;
            }
            const h = `h${`${i}`.padStart(2, '0')}`;
            const m = `m${`${j}`.padStart(2, '0')}`;
            $.each(
                $(`#${weekday} .${h}.${m}`),
                function () {
                    if ($(this).hasClass('hidden')) {
                        const firstCell = $(this).prevUntil('.occupied').prev();
                        $(firstCell).children('.lesson')
                            .removeClass('time-conflict')
                            .addClass('time-conflict');
                    } else if ($(this).hasClass('occupied')) {
                        $(this).children('.lesson')
                            .removeClass('time-conflict')
                            .addClass('time-conflict');
                    }
                }
            );
        }
    }
}
