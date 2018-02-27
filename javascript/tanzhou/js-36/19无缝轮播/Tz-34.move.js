function move(obj, json, time, callback) {
    window.requestAnimationFrame = window.requestAnimationFrame || function(fn) { return setTimeout(fn, 1000 / 60) };
    window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
    var getStyle = obj.currentStyle || getComputedStyle(obj);
    var start = {},S = {};
    for (var key in json) {
        start[key] = parseFloat(getStyle[key]);
        S[key] = json[key] - start[key];
        if (!S[key]) {
            delete start[key];
            delete json[key];
        }
    }
    var startTime = new Date();
    (function fn() {
        var prop = (new Date() - startTime) / time;
        prop >= 1 ? prop = 1 : requestAnimationFrame(fn);
        for (var key in start) {
            if (key === "opacity") {
                var value = S[key] * prop + start[key];
                obj.style[key] = value;
                obj.style.filter = "alpha(opacity=" + value * 100 + ")"
            } else {
                obj.style[key] = S[key] * prop + start[key] + "deg";
            }
        }
        if (prop === 1) { callback && callback() }
    })();
}
