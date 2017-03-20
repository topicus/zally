/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const glob = require('glob');

/**
 *  This will load all js files in the gulp directory
 *  in order to load all gulp tasks
 */
glob.sync('./tools/gulp/**/*.js').map(function (file) {
  return require(file);
});

