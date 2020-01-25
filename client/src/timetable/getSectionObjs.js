export default function getSectionObjs(code, section) {
    var objs = [];
    for (var j = 0; j < window.data[code]["sections"].length; j++) {
        if (window.data[code]["sections"][j]["section"] === section) {
            objs.push(window.data[code]["sections"][j]);
        }
    }
    return objs;
}
