# gulp-yaml-update
A configurable gulp task to update fields in a yaml document.


```
const gulp = require('gulp');
const yamlUpdate = require('gulp-yaml-update');
const details = require('./package.json');
const runSequence = require('run-sequence');

const YAML_DIRECTIVES = [
    { path: 'version', value: details.version },
    { path: 'title', env: 'development', value: `${details.title} - Development` },
    { path: 'title', env: 'production', value: `${details.title} - Production` },
    { path: 'host', env: 'development', value: 'localhost:10010' },
    { path: 'host', env: 'production', value: 'some.production.host:81' }
];

gulp.task('yaml-update-dev', () => {
    return gulp.src([
        'api/swagger/swagger.yaml'
    ])
        .pipe(yamlUpdate({
            environment: 'development',
            directives: YAML_DIRECTIVES
        }));
});

gulp.task('yaml-update-prod', () => {
    return gulp.src([
        'api/swagger/swagger.yaml'
    ])
        .pipe(yamlUpdate({
            environment: 'production',
            directives: YAML_DIRECTIVES
        }));
});

gulp.task('default', (callback) => {
    runSequence('yaml-update-prod', callback);
});
```
