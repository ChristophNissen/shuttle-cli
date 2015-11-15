var fs = require('fs');
var util = require('util');
var osascript = require('node-osascript');
var path = process.env['HOME'] + '/.shuttle.json';
var json = JSON.parse(fs.readFileSync(path, 'utf8'));

var opts = [];
var id = 0;


printRecursive = function(base, lvl, print) {

    if (util.isArray(base)) {
        for (var i = 0; i < base.length; i++) {
            printRecursive(base[i], lvl + 1, print);
        }
    } else if (util.isObject(base)) {
        var keys = Object.keys(base);
        for (var x = 0; x < keys.length; x++) {
            var key = keys[x];
            if (util.isArray(base[key])) {
            	console.log( Array(lvl).join(' ') + key );
                printRecursive(base[key], lvl + 1, print);
            } else {
            	console.log( Array(lvl).join(' ') + (id++) + ': ' + base.name );
            	opts.push(base);
            	return;
            }
        }
    }

}

var args = process.argv.slice(2);
var print = false;

if (args.length == 0) {
    print = true;
}

printRecursive(json.hosts, 0, print);


for (i = 0; i < args.length; i++) {
    var arg = args[i];
    if (parseInt(arg) !== undefined && opts[arg] !== undefined) {
        osascript.execute('tell application "Terminal" to do script "' + opts[arg].cmd + '"');
        continue;
    }
    for (x = 0; x < opts.length; x++) {
        if (opts[x].name == arg) {
            osascript.execute('tell application "Terminal" to do script "' + opts[x].cmd + '"');
        }
    }
}
