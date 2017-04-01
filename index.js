var Vinyl = require('vinyl');
var vinylFile = require('vinyl-file');
var through = require('through2');
var Readable = require('stream').Readable;

const isPath = function(path) {
    return typeof path === 'string';
}

const toVinylFile = function(obj, callback) {
    try {
        if (Vinyl.isVinyl(obj)) {
            callback(null, obj);
        } else if (isPath(obj)) {
            vinylFile.read(obj).then((file) => {
                callback(null, file);
            });
        } else {
            const isValid = obj.cwd && obj.base && obj.path && obj.contents;
            if (isValid) {
                var jsFile = new Vinyl();
                callback(null, Object.assign(jsFile, obj));
            } else {
                throw new Error('Options need to have a path, a base and cwd when providing object')
            }
        }
    } catch (err) {
        callback(err, null);
    }
}

const toStream = function(param) {
    const contents = [];
    if (Array.isArray(param)) {
        contents.push(...param);
    } else {
        contents.push(param);
    }

    vinylFiles = [];
    var readable = through.obj(function(file, _, callback) {
        this.push(file);
        callback();
    })
    var count = 0;
    contents.forEach((content) => {
        toVinylFile(content, function(err, vinylFile) {
            if (err) {
                console.log(err);
                throw err;
            }
            readable.write(vinylFile);
            if (++count == contents.length) {
                readable.end();
            }
        });
    });
    return readable;
}

module.exports = toStream;