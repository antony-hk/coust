import clsx from 'clsx';
import $ from 'jquery';

import addSection from './addSection';
import addVirtualCourse from './addVirtualCourse';
import removeSection from './removeSection';
import removeVirtualCourse from './removeVirtualCourse';
import saveTimetableToStorage from './saveTimetableToStorage';
import setTimeConflict from './setTimeConflict';
import updateConflictStyle from './updateConflictStyle';
import { convertTime } from './util';

const NEWLINE = "&#10;";

function attachRealDraggable(cell, data, code, section, singleton) {
    $(cell).draggable({
        appendTo: "body",
        helper: "clone",
        start: function (event, ui) {
            // var lessontd = $(cell).eq(0).parentsUntil("td").parent();
            var lessondiv = $(cell).eq(0);
            $(ui.helper).css("width", $(lessondiv).outerWidth());
            $(ui.helper).css("height", $(lessondiv).outerHeight());
            $(ui.helper).addClass("move");
            $(ui.helper).removeAttr("title");
            addVirtualCourse(data, code, section, singleton);
        },
        stop: function (event, ui) {
            if ($("div.lesson.toadd." + code).length > 0) {
                var new_section = $("div.lesson.toadd." + code).eq(0).attr("name").split("_")[1];
                // remove virtual class of new section
                //$("div.lesson.virtual."+code+"."+new_section).removeClass("virtual").addClass("real").addClass("toadd");
                // remove virtual sections
                removeVirtualCourse(code);
                // remove orginal section
                removeSection(data, code, section);
                // add new section
                addSection(data, data[code], new_section, singleton, false);
            }
            else {
                removeVirtualCourse(code);
            }
        }
    });
}

function attachVirtualDraggable(cell) {
    cell.droppable({
        drop: function () {
            // drop() of droppable fires before stop() of draggable
            cell.addClass("toadd");
            cell.removeClass("virtual-hover");
        },
        over: function (event, ui) {
            cell.addClass("virtual-hover");
            console.info("Event: ", {clientX: event['clientX'], clientY: event['clientY']}, "UI: ", ui['offset']);
        },
        out: function (event, ui) {
            cell.removeClass("virtual-hover");
        }
    });
}

function getCourseBoxHTML(
    dates,
    singleton,
    virtual,
    code,
    section,
    start,
    end,
    sectionObj,
) {
    const { room, instructor } = sectionObj;

    let colorClassName = `color${window.color}`;
    if (virtual) {
        colorClassName = $(`div.lesson.real.${code}`)
            .attr("class")
            .match(/color[0-9]+/i);
    }
    if (window.courseColor?.hasOwnProperty(code)) {
        colorClassName = `color${window.courseColor?.[code]}`;
    }

    const className = clsx(
        'lesson',
        colorClassName,
        { draggable: !singleton },
        virtual ? 'virtual' : 'real',
        code,
        section,
    );

    const roomShort = (room === 'TBA' ? 'Rm: TBA' : room)
        .replace(/, Lift [0-9]+((-|,)( )*[0-9]+)?/gi, '')
        .replace(/\([0-9]+\)/gi, '')
        .replace(/Lecture Theater /gi, 'LT')
        .replace(/, [A-Z ]+/gi, '');
    
    // building the tooltip content
    let tooltip = [`${start} - ${end}`];
    if (dates) {
        tooltip.unshift(`${dates[0]} - ${dates[1]}`);
    }
    tooltip.push(`${room}`)
    if (instructor.length <= 1) {
        tooltip.push(`Instructor: ${instructor[0] ?? 'TBA'}`);
    } else {
        tooltip.push(`Instructor: `);
        tooltip.push(...instructor.map(str => `- ${str}`));
    }

    // buidling date info
    const dateStart = (dates?.[0] || '').replace('-', '');
    const dateEnd = (dates?.[1] || '').replace('-', '');
    const datePeriodText = dates?.multiple ? ` [${dates.index}]` : '';

    return `
        <div
            datestart="${dateStart}"
            dateend="${dateEnd}"
            title="${tooltip.join(NEWLINE)}"
            name="${code}_${section}"
            class="${className}"
        >
            <div>
                ${code}<br/>
                ${section}${datePeriodText}<br/>
                ${roomShort}
            </div>
        </div>
    `;
}

// create the course box in timetable
export default function addCourseBox(data, code, section, weekday, start, end, singleton, virtual, dates, sectionObj) {
    if ($(`#${weekday}`).hasClass('hidden')) {
        $(`#${weekday}`).removeClass('hidden');
    }

    const { h: startH, m: startM } = convertTime(start);
    const { h: endH, m: endM } = convertTime(end);

    const h = `h${`${startH}`.padStart(2, '0')}`;
    const m = `m${`${Math.ceil(startM / 30) * 30 % 60}`.padStart(2, '0')}`;

    const spanCount = Math.ceil((endH * 60 + endM - startH * 60 - startM) / 30);

    let isAdded = false;
    let hasConflict = false;
    $(`#${weekday}`)
        .children("tr")
        .each(function () {
            if (isAdded) {
                return false; // break the loop
            }
            const cell = $(this).children(`td.${h}.${m}`).eq(0);
            if (
                $(cell).hasClass('occupied') ||   // Occupied by a course
                $(cell).hasClass('hidden')
            ) {
                // skip this row as the cell is being ocuppied
                hasConflict = true;
            } else {
                // check if all cells needed are available
                let isAvailable = true;
                let nextCell = $(cell).next();
                for (let i = 1; i < spanCount; i++) {
                    if ($(nextCell).hasClass('occupied') || $(nextCell).hasClass('hidden')) {
                        isAvailable = false;
                    }
                    nextCell = $(nextCell).next();
                }
                // add the course box if all cells available
                if (isAvailable) {
                    const html = getCourseBoxHTML(
                        dates,
                        singleton,
                        virtual,
                        code,
                        section,
                        start,
                        end,
                        sectionObj,
                    );

                    $(cell).append(html);
                    $(cell).addClass('occupied');
                    $(cell).attr('colspan', spanCount);
                    // hide the next few cells
                    let next = $(cell).next();
                    for (let i = 1; i < spanCount; i++) {
                        $(next).addClass('hidden');
                        next = $(next).next();
                    }
                    isAdded = true;

                    if (virtual) {
                        // attach jQuery droppable
                        const virtualCell = $(`div.lesson.virtual.${code}.${section}`);
                        attachVirtualDraggable(virtualCell);
                    } else if (!singleton) {
                        // attach jQuery draggable
                        const realCell = $(`div.lesson.real.${code}.${section}`);
                        attachRealDraggable(realCell, data, code, section, singleton);
                    }
                } else {
                    // look for next row
                    hasConflict = true;
                }
            }
        });

    if (!isAdded) {
        // if no current existing rows available, create a new row
        
        // increase rowspan of weekday header
        const newRowSpan = parseInt($(`#${weekday} th`).attr("rowspan"), 10) + 1;
        $(`#${weekday} th`).attr("rowspan", newRowSpan);

        const rowHtml = `
            <tr>
                <td class="h09 m00"></td>
                <td class="h09 m30"></td>
                <td class="h10 m00"></td>
                <td class="h10 m30"></td>
                <td class="h11 m00"></td>
                <td class="h11 m30"></td>
                <td class="h12 m00"></td>
                <td class="h12 m30"></td>
                <td class="h13 m00"></td>
                <td class="h13 m30"></td>
                <td class="h14 m00"></td>
                <td class="h14 m30"></td>
                <td class="h15 m00"></td>
                <td class="h15 m30"></td>
                <td class="h16 m00"></td>
                <td class="h16 m30"></td>
                <td class="h17 m00"></td>
                <td class="h17 m30"></td>
                <td class="h18 m00"></td>
                <td class="h18 m30"></td>
                <td class="h19 m00"></td>
                <td class="h19 m30"></td>
                <td class="h20 m00"></td>
                <td class="h20 m30"></td>
                <td class="h21 m00"></td>
                <td class="h21 m30"></td>
                <td class="h22 m00"></td>
                <td class="h22 m30"></td>
            </tr>`;
        $(`#${weekday}`).append(rowHtml);
        
        // recall this function
        return addCourseBox(data, code, section, weekday, start, end, singleton, virtual, dates, sectionObj);
    }

    if (hasConflict) {
        setTimeConflict(weekday, start, end);
    }

    $(`div.lesson.${code}`)
        .parentsUntil("tr")
        .parent()
        .removeClass("spare-tr");

    // save timetable to cookies
    saveTimetableToStorage(data);
    updateConflictStyle();
    if (window.readMode) {
        $(".lesson.draggable").draggable("disable")
    };
}
