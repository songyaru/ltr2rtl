#! /usr/bin/env node

var convert = require('../tasks/convert');

var argOpts = {'ltr': false, 'fix': ""};

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

