const gulp = require('gulp')
const gulpImgLqip = require('..')

gulp.task('default', () => {
  gulp.src('*.html', { read: false })
    .pipe(gulpImgLqip())
})
