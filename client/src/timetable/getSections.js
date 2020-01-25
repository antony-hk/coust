export default function getSections(code) {
    if (!window.loaded) {
        return null;
    }
    if (!window.data.hasOwnProperty(code)) {
        return null;
    }
    var course = window.data[code];
    var sections = course["sections"];
    var types = {};
    for (var i = 0; i < sections.length; i++) {
        var type = sections[i]["section"].match(/[A-Za-z]+/i);
        if (typeof types[type] === "undefined") {
            types[type] = [];
        }
        var duplicate = false;
        for (var j = 0; j < types[type].length; j++) {
            if (sections[i]["section"] === types[type][j]) {
                duplicate = true;
            }
        }
        if (!duplicate) {
            types[type].push(sections[i]["section"]);
        }
    }
    var keys = [];
    for (var k in types) {
        keys.push(k);
    }
    types["types"] = keys;
    return types;
}
