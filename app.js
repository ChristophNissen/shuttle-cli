var fs = require('fs'),
    util = require('util'),
    osascript = require('node-osascript'),
    colors = require('colors'),
    args = process.argv.slice(2),

    path = process.env['HOME'] + '/.shuttle.json',
    json = JSON.parse(fs.readFileSync(path, 'utf8')),

    printList = args.length == 0,

    gather = function(root, lvl, opts) {
        for (var i = 0; i < root.length; i++) {
            var obj = root[i],
                keys = Object.keys(obj);

            if (!util.isNullOrUndefined(obj['name']) && !util.isNullOrUndefined(obj['cmd'])) {
                if (printList) {
                    console.log( colors.bold.blue( Array(lvl + 1).join(' ') + opts.length ) + ": " + colors.bold(obj['name']));
                }
                opts.push(obj);
                continue;
            }

            for (var x = 0; x < keys.length; x++) {
                var key = keys[x],
                    entry = obj[key];

                if (util.isArray(entry)) {
                    if (printList) {
                        console.log( colors.bold.green( Array(lvl+1).join(' ') + key));
                    }
                    gather(entry, lvl + 1, opts);
                }

            }

        }
        return opts;
    },
    opts = gather(json.hosts, 0, []);


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

