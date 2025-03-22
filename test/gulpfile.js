// @ts-check

const fs = require('fs');
const gulp = require('gulp');
const cheerio = require('cheerio');
const gulpEmbedLQIP = require('..');
const rename = require('gulp-rename');
// const example = require('../src/examples/gulp-example-01.js');
// const prettify = require('gulp-html-prettify');

const fileList = ['.temp/index.html', '.temp/test.html'];

const lqip = () => {
  return (
    gulp
      .src(['*.html', '*.txt', '!*-orig.*'])
      // .pipe(prettify({ indent_char: ' ', indent_size: 2 }))
      .pipe(
        gulpEmbedLQIP({
          rootPath: __dirname,
          // All the below parameters are optional. See plugin reference.
          lazyLoadClass: 'lazy-load',
          srcAttr: 'src',
          dataSrcAttr: '',
          scaleFactorAttr: 'data-scale-factor',
          scaleFactor: 10,
          validFileExtensions: ['.html', '.htm'],
        }),
      )
      // .pipe(example())
      .pipe(
        rename((path) => {
          path.basename += '-test';
        }),
      )
      .pipe(gulp.dest('.'))
    // .pipe(gulp.dest('.temp'))
  );
};

const validate = () => {
  const expectedErrors = 2;
  let errors = 0;

  fileList.forEach((filePath) => {
    const fileData = fs.readFileSync(filePath, { encoding: 'utf8' });

    const $ = cheerio.load(fileData);

    $('img').each((_index, element) => {
      if (!$(element).attr('data-src')) {
        errors++;
      }
    });
  });

  if (errors !== expectedErrors) {
    Promise.reject(
      new Error(
        `Some images don't have a data-src attribute (expected ${expectedErrors} got ${errors})`,
      ),
    );

    return;
  }

  return Promise.resolve();
};

gulp.task('default', gulp.series(lqip, validate));
