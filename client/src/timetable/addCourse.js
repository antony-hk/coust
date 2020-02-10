import $ from 'jquery';

import addSection from './addSection';
import getSections from './getSections';

// TODO: Redux flow should be put back into React components
import store from '../store';
import { getAddCourseAction } from '../actions/course';

export default function addCourse(courseCode, registeredSections) {
    if (!window.loaded) {
        console.log('Please try again later as data is still loading...');
        return false;
    }

    if (!courseCode) {
        console.log('No course code');
        return false;
    }

    if (!window.data.hasOwnProperty(courseCode)) {
        console.log(`Course not found: ${courseCode}`);
        return false;
    }

    if (window.timetable.hasOwnProperty(courseCode)) {
        console.warn('Course already added!');

        return false;
    }

    window.timetable[courseCode] = [];
    const course = window.data[courseCode];

    // remove from search hints of autocomplete
    const hintsText = `${courseCode}: ${course.name}`;
    for (let i = 0; i < window.searchHints.length;) {
        if (window.searchHints[i] === hintsText) {
            window.searchHints.splice(i, 1);
            break;
        } else {
            i++;
        }
    }

    const sections = getSections(courseCode);
    if (registeredSections) {
        registeredSections.forEach(section => {
            const isSectionSingleton = (sections[section.match(/[A-Z]+/i)].length === 1);

            addSection(
                course,
                section,
                isSectionSingleton,
                false,
            );
        });
    } else {
        const sectionTypes = Object.keys(sections);
        sectionTypes.forEach(type => {
            // add the first section of each section type
            const firstSection = sections[type][0];
            const isSectionSingleton = (sections[type].length === 1);

            addSection(
                course,
                firstSection,
                isSectionSingleton,
                false,
            );
        });
    }

    window.courseColor[courseCode] = window.color;
    window.color = (window.color + 1) % 10;
    $('#add').val(''); // clear input text

    // TODO: Redux flow should be put back into React components
    store.dispatch(getAddCourseAction(courseCode));

    return false; // always return false to avoid form submitting
}
