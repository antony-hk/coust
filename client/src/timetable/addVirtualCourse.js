import addSection from './addSection';
import getSections from './getSections';
import updateConflictStyle from './updateConflictStyle';

// add course boxes of available sections of the section type
export default function addVirtualCourse(data, code, section) {
    const sectionType = section.match(/[A-Z]+/i);
    const sections = getSections(data, code);
    const isSingleton = (sections[sectionType].length === 1);
    for (let i = 0; i < sections[sectionType].length; i++) {
        if (sections[sectionType][i] === section) {
            continue;
        }
        addSection(
            data,
            data[code],
            sections[sectionType][i],
            isSingleton,
            true,
        );
    }
    updateConflictStyle();
}
