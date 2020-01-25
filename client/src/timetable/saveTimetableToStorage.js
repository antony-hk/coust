import storeValue from './storeValue';

export default function saveTimetableToStorage() {
    if (window.readMode) return; // reading others timetable
    var timetableStr = "";
    for (var code in window.timetable) {
        var sectionStr = "";
        for (var i = 0; i < window.timetable[code].length; i++) {
            if (i !== 0) sectionStr += ",";
            sectionStr += window.timetable[code][i];
        }
        timetableStr += code + ":_" + sectionStr + "!";
    }
    storeValue("timetable", encodeURIComponent(timetableStr));
    storeValue("timetable-semester", window.semester["num"]);
}
