export default function storeValue(key, value) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(key, value);
    } else {
        const d = new Date();
        d.setTime(d.getTime() + (window.COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000));
        document.cookie = `${key}=${value}; expires=${d.toGMTString}`;
    }
}
