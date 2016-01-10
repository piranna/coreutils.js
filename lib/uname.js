var getUname = require('node-uname');
var decodeArguments = require('./common').decodeArguments;

module.exports = uname;

function uname(args) {
    var params = decodeArguments(args);
    var info = getUname();

    function inspect(depth, context) {
        var output = [];

        params.all = params.a || params.all;
        params['kernel-name'] = params['kernel-name'] || args.length === 0 || Object.getOwnPropertyNames(params).length === 0;

        if (params.all || params.s || params['kernel-name']) {
            output.push(info.sysname)
        }

        if (params.all || params.n || params.nodename) {
            output.push(info.nodename)
        }

        if (params.all || params.r || params['kernel-release']) {
            output.push(info.release)
        }

        if (params.all || params.v || params['kernel-version']) {
            output.push(info.version)
        }

        if (params.all || params.m || params.machine) {
            output.push(info.machine)
        }

        // todo: add operating-system, hardware-platform and processor

        return output.join(' ')
    }

    Object.defineProperty(info, 'inspect', { value: inspect });

    return info
}