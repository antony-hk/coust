import storeValue from './storeValue';

// TODO: Redux flow should be put back into React components
import store from '../store';

export default function saveTimetableToStorage(data) {
    if (window.readMode) {
        return; // reading others timetable
    }

    // TODO: Redux flow should be put back into React components
    const timetable = store.getState().app.timetable;

    let timetableStr = "";
    for (const code in timetable) {
        let sectionStr = "";
        for (let i = 0; i < timetable[code].length; i++) {
            if (i !== 0) sectionStr += ",";
            sectionStr += timetable[code][i];
        }
        timetableStr += code + ":_" + sectionStr + "!";
    }
    storeValue("timetable", encodeURIComponent(timetableStr));
    storeValue("timetable-semester", data.terms.current.num);
}
