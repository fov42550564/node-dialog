/**
* Module dependencies.
*/

var dialog = require('..');
var program = dialog.commander();

function range(val) {
  return val.split('..').map(Number);
}

function list(val) {
  return val.split(',');
}

program.command('setup')
    .description('run remote setup commands')
    .action(function(){
    console.log('setup');
    });

program.command('exec <cmd>')
    .description('run the given remote command')
    .action(function(cmd){
    console.log('exec "%s"', cmd);
    });

program .version('0.0.1')
  .usage('test')
  .option('-i, --integer <n>', 'An integer argument', parseInt)
  .option('-f, --float <n>', 'A float argument', parseFloat)
  .option('-r, --range <a>..<b>', 'A range', range)
  .option('-l, --list <items>', 'A list', list)
  .option('-o, --optional [value]', 'An optional value')
  .parse(process.argv);


console.log(' int: %j', program.integer);
console.log(' float: %j', program.float);
console.log(' optional: %j', program.optional);
program.range = program.range || [];
console.log(' range: %j..%j', program.range[0], program.range[1]);
console.log(' list: %j', program.list);
//console.log(' args: %j', program.args);
