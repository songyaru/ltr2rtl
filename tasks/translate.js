var fs = require("fs");

var shorthandRegex = function (repeats, hasSuffix) {
    var pattern = '(padding|margin|border\\-width|border\\-color|border\\-style|border\\-radius)\\s*:\\s*';
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
var replaceMBPLR = /(padding|margin|border)(-)(left|right)/g;
var replaceFTLR = /(float|text-align)\s*(:)\s*(left|right)/g;
var positionLR = /(\s+|{)(left|right)\s*(:)\s*/g;
var replaceLR = new RegExp([
    replaceMBPLR.source,
    replaceFTLR.source,
    positionLR.source,
    shorthandRegex(4, false).source
].join('|'), 'g');
var translate = function (source) {
    return source
//        .replace(p, function (match, property, top, right, bottom, left) { //左右互换
//          return property + ':' + top + ' ' + left + ' ' + bottom + ' ' + right;
//        })
        .replace(replaceLR, function () {
            var args = arguments;
            for (var i = 0; i < 3; i++) {
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
    /*        .replace(replaceMBPLR, function (match, property, value) {
     return property + "-" + (value == "left" ? "right" : "left");
     })
     .replace(replaceFTLR, function (match, property, value) {
     return property + ":" + (value == "left" ? "right" : "left");
     })
     .replace(positionLR, function (match, prefix, value) {
     return prefix + (value == "left" ? "right" : "left") + ":";
     });*/
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


