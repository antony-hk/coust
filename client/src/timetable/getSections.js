export default function getSections(data, code) {
    if (!data.hasOwnProperty(code)) {
        return null;
    }

    const course = data[code];
    const { sections } = course;

    const ret = {};
    sections.forEach(section => {
        const type = section.section.match(/[A-Za-z]+/i);

        if (!(type in ret)) {
            ret[type] = [];
        }

        let isDuplicate = false;
        for (let j = 0; j < ret[type].length; j++) {
            if (section.section === ret[type][j]) {
                isDuplicate = true;
            }
        }

        if (!isDuplicate) {
            ret[type].push(section.section);
        }
    });

    return ret;
}
