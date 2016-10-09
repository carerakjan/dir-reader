var recursive = require('recursive-readdir');
var parse = require('parse-filepath');
var path = require('path');

var ignore = 'meta-data';
var delimiter = '/';
var metaData = {};
var files = [];
var dirs = [];
var raw = [];

function replaceSlash(file) {
    return file.split(path.sep).join(delimiter);
}

function removeExt(file) {
    var parsed = parse(file);
    return path.join(parsed.dir, parsed.name);
}

function getJson(file) {
    if(Boolean(file.indexOf(ignore) + 1)) {
        var key = replaceSlash(path.normalize(file.split(ignore).join('')));
        metaData[key] = require('./' + file);
        return null;
    }
    return file;
}

function reducePath(file) {
    var parsed = file.split(delimiter);
    var start = parsed.indexOf('autoscripts');
    return parsed.slice(start < 0 ? 0 : start).join(delimiter);
}

function getDirs(file) {
    var parsed = file.split(delimiter);
    if(parsed.length === 2) return file;

    parsed = parsed.slice(1, -1);
    var dir = parsed.join(delimiter);

    if(!Boolean(dirs.indexOf(dir) + 1)) {
        dirs.push(dir);
    }

    return file;
}

function compact(result, file) {
    if(file) {
        result.push(file);
    }
    return result;
}

module.exports = function(options) {

    var somePath = options['somePath'];
    var success = options['success'];
    var error = options['error'];

    recursive(somePath, function (err, fs) {

        try {

            if(err) {
                throw err;
            }

            files = (raw = fs)
                .map(removeExt)
                .map(replaceSlash)
                .map(getJson)
                .reduce(compact, [])
                .map(reducePath)
                .map(getDirs);

            success && success({
                raw: raw,
                dirs: dirs,
                files: files,
                metaData: metaData
            });

        } catch (e) {
            error && error(e);
        }

    });

};