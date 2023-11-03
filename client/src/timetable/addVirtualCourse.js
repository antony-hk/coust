import addSection from './addSection';
import getSections from './getSections';
import updateConflictStyle from './updateConflictStyle';

// add course boxes of available sections of the section type
export default function addVirtualCourse(data, code, section) {
    var sectiontype = section.match(/[A-Z]+/i);
    var sections = getSections(data, code);
    var singleton = (sections[sectiontype].length === 1);
    for (var i = 0; i < sections[sectiontype].length; i++) {
        if (sections[sectiontype][i] === section) {
            continue;
        }
        addSection(data, data[code], sections[sectiontype][i], singleton, true);
    }
    updateConflictStyle();
}
