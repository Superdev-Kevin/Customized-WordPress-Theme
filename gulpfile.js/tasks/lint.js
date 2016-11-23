const gulp = require('gulp')
const changedInPlace = require('gulp-changed-in-place')
const stylint = require('gulp-stylint')
const standard = require('gulp-standard')
const phpcs = require('gulp-phpcs')

module.exports = function (config) {
  gulp.task('lint', ['lint:stylus', 'lint:js', 'lint:php'])

  gulp.task('lint:stylus', function () {
    const task = gulp.src(config.lint.stylus)
    .pipe(changedInPlace({firstPass: true}))
    .pipe(stylint())
    .pipe(stylint.reporter())
    if (global.watchMode) {
      return task
    } else {
      return task
      .pipe(stylint.reporter('fail', { failOnWarning: true }))
    }
  })

  gulp.task('lint:js', function () {
    let opts = {}
    if (!global.watchMode) {
      opts = {
        breakOnError: true,
        breakOnWarning: true
      }
    }
    return gulp.src(config.lint.js)
    .pipe(changedInPlace({firstPass: true}))
    .pipe(standard())
    .pipe(standard.reporter('default', opts))
  })

  gulp.task('lint:php', function () {
    const task = gulp.src(config.lint.php)
    .pipe(changedInPlace({firstPass: true}))
    .pipe(phpcs(config.lint.phpcs))
    .pipe(phpcs.reporter('log'))
    if (global.watchMode) {
      return task
    } else {
      return task
      .pipe(phpcs.reporter('fail', {failOnFirst: false}))
    }
  })
}
