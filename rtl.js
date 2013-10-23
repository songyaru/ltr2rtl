#! /usr/bin/env node

//todo 命令行help信息
(function () {
  var trans = require("./tasks/translate.js");
  var fs = require("fs");
  var path = require("path");
  var mkDir = require("./tasks/mkdir.js");


  var jsonConfig = {
    src: "./",
    dest: "./"
  };
  var configFile = "package.json";
  if (fs.existsSync(configFile)) {
    try {
      var configs = JSON.parse(fs.readFileSync(configFile, "UTF-8"));
      for(var keys in configs){
        jsonConfig[keys]=configs[keys];
      }
    } catch (e) {
      console.log("\n======package.json file error\n", e);
      return;
    }
  } else {
    console.log("\n======package.json file not found ,use default configuration======\n");
  }


  var destDir = path.normalize(jsonConfig.dest);
//  fs.exists(destDir, function (exists) {
//    !exists && fs.mkdirSync(destDir);
//  });
  mkDir(destDir);
  var src = jsonConfig.src;
  var srcArray = [];
  var read = function (p) {
    var filePath = path.normalize(p);
    if (!fs.existsSync(filePath)) {
      return;
    }

    var extName = path.extname(filePath).toLowerCase();

    if (!extName&&fs.statSync(filePath).isDirectory()) {
      var files = fs.readdirSync(filePath);
      for (var i = 0, len = files.length; i < len; i++) {
        read(filePath + "/" + files[i]);
      }
    } else if (extName == ".css") {
      if (/[-_]rtl\.css$/.test(filePath)) {
        console.log("this rtl css files exits :", filePath);
        return;
      }
      srcArray.push(filePath);
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
    var destDirPath = destDir + "/" + path.dirname(file).replace(/^(\w\:)*/, "") + "/";
    mkDir(destDirPath);
    var dest = destDirPath + path.basename(file, path.extname(file)) + "-rtl" + ".css";
    var rtlString = trans(file);
    fs.writeFileSync(dest, rtlString);
    console.log(path.normalize(dest));
    if (i == len - 1) {
      console.log("\n===========================", len, "file(s) done !===========================\n");
    }
  }
  if (i == 0) {
    console.log("\n===========================No file generated !===========================\n");
  }

})();
