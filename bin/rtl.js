#! /usr/bin/env node

var fs = require('fs'), path = require('path');

// 合并文件
var convert = require('../tasks/convert');

// 命令参数
var argOpts = {'ltr': false, 'fix': ""};

// 帮助函数
function help() {
    var app = path.basename(__filename);
    console.log('Usage: node ' + path.basename(__filename) + ' [options]');
    console.log();
    console.log('Global options:');
    console.log(' --path(-p) <File path>');
    console.log(' --file(-f) <JavaScript file | CSS file>');
    console.log(' --type(-t) <File type>');
    console.log();
    console.log('Example:');
    console.log(' JavaScript');
    console.log('  File: ./test.js');
    console.log('  Usage: node ' + app + ' --path ./ --file test --type js -output test.combine.js');
    console.log(' CSS');
    console.log('  File: ./test.css');
    console.log('  Usage: node ' + app + ' --path ./ --file test.css --type css --output test.combine.css');
    process.exit();
}
// 入口
function main() {
    process.argv.forEach(function (val, index, array) {
        if (index > 1) {
            var args = val.split("");
            args.forEach(function (v, i) {
                if (v == "r") {
                    argOpts.ltr = true;
                } else if (v == "f") {
                    argOpts.fix = "-rtl";

                }
            });
        }
    });


    convert(argOpts);

}
main();

