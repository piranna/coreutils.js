var getUname = require('node-uname')
var decodeArguments = require('./common').decodeArguments

module.exports = uname

function uname(args) {
    var info = getUname()

    function inspect() {
        var rawParams = decodeArguments(args)
        var output = []

        var all = rawParams.a || rawParams.all
        var empty = args.length === 0 || Object.getOwnPropertyNames(rawParams).length === 0

        var params = {
            kernelName: empty || all || rawParams['kernel-name'] || rawParams['s'],
            kernelRelease: all || rawParams['kernel-release'] || rawParams['r'],
            kernelVersion:  all || rawParams['kernel-version'] || rawParams['v'],
            nodename: all || rawParams['nodename'] || rawParams['n'],
            machine: all || rawParams['machine'] || rawParams['m']
        }

        if (params.kernelName) {
            output.push(info.sysname)
        }

        if (params.nodename) {
            output.push(info.nodename)
        }

        if (params.kernelRelease) {
            output.push(info.release)
        }

        if (params.kernelVersion) {
            output.push(info.version)
        }

        if (params.machine) {
            output.push(info.machine)
        }

        // todo: add operating-system, hardware-platform and processor

        return output.join(' ')
    }

    Object.defineProperty(info, 'inspect', { value: inspect })

    return info
}