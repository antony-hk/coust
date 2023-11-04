import addSection from './addSection';
import getSections from './getSections';

// TODO: Redux flow should be put back into React components
import store from '../store';
import { getAddCourseAction } from '../actions/course';

export default function addCourse(data, courseCode, registeredSections) {
    // TODO: Redux flow should be put back into React components
    const timetable = store.getState().app.timetable;

    if (!courseCode) {
        console.log('No course code');
        return false;
    }

    if (!data.hasOwnProperty(courseCode)) {
        console.log(`Course not found: ${courseCode}`);
        return false;
    }

    if (timetable.hasOwnProperty(courseCode)) {
        console.warn('Course already added!');

        return false;
    }

    // TODO: Redux flow should be put back into React components
    store.dispatch(getAddCourseAction(courseCode));

    const course = data[courseCode];

    const sections = getSections(data, courseCode);
    if (registeredSections) {
        registeredSections.forEach(section => {
            const isSectionSingleton = (sections[section.match(/[A-Z]+/i)].length === 1);

            addSection(
                data,
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
                data,
                course,
                firstSection,
                isSectionSingleton,
                false,
            );
        });
    }

    window.courseColor[courseCode] = window.color;
    window.color = (window.color + 1) % 10;

    return false; // always return false to avoid form submitting
}
