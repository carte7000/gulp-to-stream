const gulp = require('gulp');
const through = require('through2');
const vinylFile = require('vinyl');
const toStream = require('./index');
const concat = require('concat-stream');

gulp.task('test', () => {
    toStream('test/test.json').pipe(through.obj(
        function(file, encoding, callback) {
            console.log(file.contents.toString())
        }
    ))
    toStream({
        cwd: '/',
        base: '/',
        path: '/test/json',
        contents: new Buffer('loading from object works')
    }).pipe(through.obj(
        function(file, encoding, callback) {
            console.log(file.contents.toString())
        }
    ))
    toStream(Object.assign(new vinylFile(), {
        cwd: '/',
        base: '/',
        path: '/test/json',
        contents: new Buffer('loading from vinyl file works')
    })).pipe(through.obj(
        function(file, encoding, callback) {
            console.log(file.contents.toString())
        }
    ))

    toStream(['test/test.json', {
        cwd: '/',
        base: '/',
        path: '/test/json',
        contents: new Buffer('loading from array of object works')
    }, Object.assign(new vinylFile(), {
        cwd: '/',
        base: '/',
        path: '/test/json',
        contents: new Buffer('loading from array of vinyl file works')
    })]).pipe(concat(function(res) {
        console.log(res.toString())
    }));
});