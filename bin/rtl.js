#! /usr/bin/env node

var convert = require('../tasks/convert');
var program = require('commander');

var argOpts = {'ltr': false, 'fix': ""};



function main() {
    program
      .version(require('../package.json').version)
      .usage('[options]')
      .option('-r, --reverse', '从rtl转为ltr.')
      .option('-f, --suffix', '添加后缀:转为xxx-rtl.css')
      .parse(process.argv);

    if(program.reverse) argOpts.ltr = true;
    if(program.suffix) argOpts.fix = "-rtl";
    
    convert(argOpts);
}
main();

