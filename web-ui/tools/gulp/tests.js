'use strict';

const gulp = require('gulp');
const mochaSpawn = require('gulp-spawn-mocha');
const mocha = require('gulp-mocha');

gulp.task('test:unit', () => {
  // here we need mochaSpawn because it works while "watching". see test:unit:watch
  return gulp.src(['test/unit/server/**/*.spec.js'], {read: false})
    .pipe(mochaSpawn({
      env: { NODE_PATH: './' },
      istanbul: true
    }));
});

gulp.task('test:unit:watch', ['test:unit'], function () {
  return gulp
    .watch('{src,test/unit}/server/**/*.js', {debounceDelay: 2000}, ['test:unit']);
});

gulp.task('test:unit:junit-report', function () {
  return gulp.src(['test/unit/server/**/*.spec.js'], { read: false })
    .pipe(mocha({
      reporter: 'mocha-junit-reporter',
      reporterOptions: {
        mochaFile: './target/unit/junit/junit.xml'
      }
    }));
});

