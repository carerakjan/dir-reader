var recursive = require('recursive-readdir');
var parse = require('parse-filepath');
var path = require('path');

var ignore = 'meta-data';
var delimiter = '/';
var metaData = {};
var themes = [];
var files = [];
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

function getTheme(file) {
    var parsed = file.split(delimiter);
    if(parsed.length === 2) return file;

    parsed = parsed.slice(1, -1);
    var theme = parsed.join(delimiter);

    if(!Boolean(themes.indexOf(theme) + 1)) {
        themes.push(theme);
    }

    return file;
}

function compact(result, file) {
    if(file) {
        result.push(file);
    }
    return result;
}

recursive('./autoscripts', function (err, fs) {
    files = (raw = fs).map(removeExt).map(replaceSlash).map(getJson).reduce(compact, []).map(getTheme);
});