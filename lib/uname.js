var getUname = require('node-uname')
var decodeArguments = require('./common').decodeArguments

module.exports = uname

function uname(args) {
    var params = decodeArguments(args)
    var info = getUname()

    if (params.a || params.all) {
        return [info.sysname, info.nodename, info.release, info.version, info.machine].join(' ')
    }

    var output = []

    if (params.s || params['kernel-name']) {
        output.push(info.sysname)
    }

    if (params.n || params['nodename']) {
        output.push(info.nodename)
    }

    if (params.r || params['kernel-release']) {
        output.push(info.release)
    }

    if (params.v || params['kernel-version']) {
        output.push(info.version)
    }

    if (params.m || params['machine']) {
        output.push(info.machine)
    }

    // todo: add operating-system, hardware-platform and processor

    if(output.length === 0) {
        output.push(info.sysname)
    }

    return output.join(' ')
}