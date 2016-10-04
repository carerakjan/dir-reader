var recursive = require('recursive-readdir');
var parse = require('parse-filepath');
var path = require('path');

var ignore = 'meta-data';
var metaData = {};
var themes = [];
var files = [];
var all = [];

function removeExt(file) {
    var parsed = parse(file);
    return path.join(parsed.dir, parsed.name);
}

function getJson(file) {
    if(Boolean(file.indexOf(ignore) + 1)) {
        metaData[file.split(ignore + '/').join('')] = require('./' + file);
        return null;
    }
    return file;
}

function getTheme(file) {
    var buffer = file.split('/');
    if(buffer.length === 2) return file;
    if(!Boolean(themes.indexOf(buffer[1]) +1)) {
        themes.push(buffer[1]);
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
    files = (all = fs).map(removeExt).map(getJson).reduce(compact, []).map(getTheme);
});