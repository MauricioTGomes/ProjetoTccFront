var formatForCalc = function (vlr) {

    if (/null|undefined|Invalid|NaN/.test(vlr)) {
        return 0;
    }

    if (typeof vlr != "string") {
        vlr = vlr.toString();
    }
    if (vlr.length <= 6) {
        return parseFloat(vlr.replace(",", "."));
    }
    vlr = vlr.replace(".", "");
    vlr = vlr.replace(",", ".");
    return parseFloat(vlr);
};

var formatMoney = function (valor, c, d, t) {
    var n = valor,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

export {formatForCalc, formatMoney}