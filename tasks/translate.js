var fs = require("fs");

var shorthandRegex = function (repeats, hasSuffix) {
    var pattern = '(padding|margin|border\\-width|border\\-color|border\\-style)\\s*:\\s*';
    for (var i = 0; i < repeats; i++) {
        pattern += '([\\-\\d\\w\\.%#\\(\\),\\s]+)' + (i < repeats - 1 ? ' ' : '');
    }
    return new RegExp(pattern + (hasSuffix ? '([;}])' : ''), 'g');
};

//  var p = shorthandRegex(4, false);

var getOppositeDir = function (dir) {
    return dir == "left" ? "right" : "left";
};

//todo 优化replace正则
var replaceMBPLR = /(padding|margin|border|border-top|border-bottom)(-)(left|right)/g;
var replaceFTLR = /(float|text-align)\s*(:)\s*(left|right)/g;
var positionLR = /(\s+|{)(left|right)\s*(:)\s*/g;

var borderRadiusLR = /(border-radius)\s*(:)\s*((?:[\d\w\.]+\s*){1,4})/g;
var convertBorderRadius = function (property, symbol, value) {
    var arr = value.split(/\s+/);
    var len = arr.length;
    var valStr = "";
    switch (len) {
        case 1:
            valStr = value;
            break;
        case 2:
            valStr = arr[1] + " " + arr[0];
            break;
        case 3:
            valStr = arr[1] + " " + arr[0] + " " + arr[1] + " " + arr[2];
            break;
        case 4:
            valStr = arr[1] + " " + arr[0] + " " + arr[3] + " " + arr[2];
            break;
    }
    return property + symbol + " " + valStr;
};

var replaceLR = new RegExp([
    replaceMBPLR.source,
    replaceFTLR.source,
    positionLR.source,
    borderRadiusLR.source,
    shorthandRegex(4, false).source
].join('|'), 'g');


var translate = function (source) {
    return source
        .replace(replaceLR, function () {
            var args = arguments;
            for (var i = 0; i < 4; i++) {
                if (i == 3) {
                    return convertBorderRadius(args[i * 3 + 1], args[i * 3 + 2], args[i * 3 + 3]);
                }
                if (args[i * 3 + 3]) {
                    if (args[i * 3 + 3] == ":") {//positionLR
                        // left:xx ==> right:xx
                        return args[i * 3 + 1] + getOppositeDir(args[i * 3 + 2]) + ": ";
                    }
                    //property+symbol+value
                    var symbol = args[i * 3 + 2];
                    symbol = symbol == "-" ? symbol : symbol + " ";// xx:right==> xx: left; 多加个空格，符合代码规范
                    return args[i * 3 + 1] + symbol + getOppositeDir(args[i * 3 + 3]);
                }
            }

            // top right bottom left ==> top left bottom right
            return args[i * 3 + 1] + ': ' + args[i * 3 + 2] + ' ' + args[i * 3 + 5] + ' ' + args[i * 3 + 4] + ' ' + args[i * 3 + 3];
        });
};


var rmRtlComment = function (str) {
    return str.replace(/\/\*rtl([\s\S]*?)(rtl\*\/)/g, function (match, value) {
        return translate(value);
    });
};

var trans = function (path) {
    var source = "", ret = "";
    try {
        source = fs.readFileSync(/*process.cwd() + "/" +*/ path, "UTF-8");
        ret = rmRtlComment(translate(source));
    } catch (e) {
        console.error(e);
        return;
    }
    return ret;
};

module.exports = trans;


