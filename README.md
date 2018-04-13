# gulp-yaml-update
[![CircleCI](https://circleci.com/gh/ocrosby/gulp-yaml-update.svg?style=svg)](https://circleci.com/gh/ocrosby/gulp-yaml-update)
[![Coverage Status](https://coveralls.io/repos/github/ocrosby/gulp-yaml-update/badge.svg?branch=master)](https://coveralls.io/github/ocrosby/gulp-yaml-update?branch=master)

A configurable gulp task to update fields in a yaml document.

## Overview
Whenever I'm working on a swagger based API project I always run into a bit of difficulty 
in the build process when it comes to the way Swagger retrieves it's host from the 
swagger.yaml file.  I thought it might be useful to have something that could easily swap
out my host settings (at least) based on the environment I'm building for prior to the
generation of the swagger.json file.  

This custom gulp task is intended to address that situation.  It is my hope that it will
allow it's users to choose selected attributes to update at build time in order to make
swapping from your localhost to other environments a bit easier.

## Directives
The thought behind the array of directive objects is that I needed something that specified
some sort of mapping between environment and property setting within the swagger definition.

Internally the plugin determines the current environment and selects which directives to apply
based on that value.  Those directives that exist in the array without an env property are simply
always applied as is.

Another interesting twist is that this even allowed me to substitute values from the package.json
into the modified swagger definition.  This is useful for things like version or allowing
you to control the title displayed in the swagger docs from a property in the package.json file. 

## Example Usage
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
