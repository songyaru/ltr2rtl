var convert = function (opts) {
    var trans = require("./translate.js");
    var fs = require("fs");
    var path = require("path");
    var mkDir = require("./mkdir.js");


    var fromDir = opts.ltr ? /\/rtl\// : /\/ltr\//; //转换命令，搜寻ltr或rtl下的css文件
    var toDir = opts.ltr ? "/ltr/" : "/rtl/";//转换后的生成路劲

    var jsonConfig = {
        src: "./",
        dest: "./"
    };


    var destDir = path.normalize(jsonConfig.dest);

    mkDir(destDir);
    var src = jsonConfig.src;
    var srcArray = [];
    var read = function (p) {
        var filePath = path.normalize(p);
        if (!fs.existsSync(filePath)) {
            return;
        }

        var extName = path.extname(filePath).toLowerCase();

        if (!extName && fs.statSync(filePath).isDirectory()) {
            var files = fs.readdirSync(filePath);
            for (var i = 0, len = files.length; i < len; i++) {
                read(filePath + "/" + files[i]);
            }
        } else if (extName == ".css") {
            if (fromDir.test(filePath)) {
                srcArray.push(filePath);
            }
        }

    };

    if (typeof src == "string") {
        src = [src];
    }
    for (var i = 0, len = src.length; i < len; i++) {
        var f = src[i];
        read(f);
    }

    for (var i = 0, len = srcArray.length; i < len; i++) {
        if (i == 0) {
            console.log("\n===========================This file(s) generated !===========================\n");
        }
        var file = srcArray[i];

        var destFile = file.replace(fromDir, toDir);
        var destDirPath = destDir + "/" + path.dirname(destFile).replace(/^(\w\:)*/, "") + "/";
        mkDir(destDirPath);
        if (opts.ltr && opts.fix) {
            destFile = destDirPath + path.basename(destFile, path.extname(destFile)).replace(/(.+)(?:-rtl)$/, "$1") + ".css";
        } else {
            destFile = destDirPath + path.basename(destFile, path.extname(destFile)) + opts.fix + ".css";
        }

        var rtlString = trans(file);
        fs.writeFileSync(destFile, rtlString);
        console.log(path.normalize(destFile));
        if (i == len - 1) {
            console.log("\n===========================", len, "file(s) done !===========================\n");
        }
    }
    if (i == 0) {
        console.log("\n===========================No file generated !===========================\n");
    }

};
module.exports = convert;
