const gulp = require('gulp');
const clean = require('gulp-clean');
const jshint = require('gulp-jshint');
const jsonlint = require('gulp-jsonlint');
const runSequence = require('run-sequence');
const checkstyleFileReporter = require('jshint-checkstyle-file-reporter');
const exec = require('child_process').exec;


gulp.task('clean', () => {
    return gulp.src([
        '*.log',
        '.nyc_output',
        'coverage',
        'xunit.xml',
        'checkstyle.xml'
    ])
        .pipe(clean());
});

gulp.task('lint', (callback) => {
    runSequence('jsonlint', 'jshint', callback);
});

gulp.task('jsonlint', () => {
    return gulp.src([
        './*.json'
    ])
        .pipe(jsonlint())
        .pipe(jsonlint.reporter());
});

gulp.task('jshint', () => {
    return gulp.src([
        './src/**/*.js',
        './test/**/*.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter(checkstyleFileReporter))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', (callback) => {
    exec('npm run test', function (err, stdout, stderr) {
        if (stdout && stdout.length > 0) {
            console.log(stdout.trim());
        }

        if (stderr && stderr.length > 0) {
            console.error(stderr.trim());
        }

        callback(err);
    });
});

gulp.task('report-coverage', (callback) => {
    exec('npm run cover', function (err, stdout, stderr) {
        if (stdout && stdout.length > 0) {
            console.log(stdout.trim());
        }

        if (stderr && stderr.length > 0) {
            console.error(stderr.trim());
        }

        callback(err);
    });
});


gulp.task('default', (callaback) => {
    runSequence('clean', 'lint', 'test', callaback);
});
