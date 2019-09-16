function shallowCopy(o) {
    var copy = {}
    for (var k in o) {
        copy[k] = o[k];
    }
    return copy;
}
function NotStringNumber(strNumber) {
    if (strNumber && (typeof strNumber === "string") && strNumber.match(/^[0-9]+\.?[0-9]*$/)) {
        return false;
    } else {
        return true;
    }
}
function NotNumber(strNumber) {
    if (strNumber && (typeof strNumber === "number")) {
        return false;
    } else {
        return true;
    }
}
function notPositiveStringNumber(strNumber) {
    if (strNumber && (typeof strNumber === "string") && strNumber.match(/^[1-9][0-9]*$/)) {
        return false;
    } else {
        return true;
    }
}
module.exports = {
    shallowCopy: shallowCopy,
    NotStringNumber: NotStringNumber,
    notPositiveStringNumber: notPositiveStringNumber,
    NotNumber: NotNumber,
}

