export default function getSectionObjs(data, code, section) {
    var objs = [];
    for (var j = 0; j < data[code].sections.length; j++) {
        if (data[code].sections[j].section === section) {
            objs.push(data[code].sections[j]);
        }
    }
    return objs;
}
