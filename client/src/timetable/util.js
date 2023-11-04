// 03:30PM --> { h: 15, m: 30 }
export function convertTime(timeStr) {
    let time = parseInt(timeStr.substr(0, 2).concat(timeStr.substr(3, 2)), 10);
    if (timeStr.substr(5, 2) === 'PM' && timeStr.substr(0, 2) !== '12') {
        time += 1200;
    }
    return {
        h: Math.floor(time / 100),
        m: time % 100,
    }
}
