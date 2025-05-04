// @ts-check

const fs = require('fs');
const gulp = require('gulp');
const cheerio = require('cheerio');
const gulpEmbedLqipAsBackground = require('..');
const rename = require('gulp-rename');

// Generated files
const fileList = ['.index.html', '.test.html', '.data-src-test.html'];

// Base pipe: generates the files from `fileList`
const lqip = () => {
  return gulp
    .src(['*.html', '*.txt', '!.*', '!data-src-test.*'])
    .pipe(
      gulpEmbedLqipAsBackground({
        rootPath: __dirname,
        // All the below parameters are optional. See plugin reference.
        lazyLoadClass: 'lazy-load',
        srcAttr: 'src',
        dataSrcAttr: '',
        scaleFactorAttr: 'data-scale-factor',
        scaleFactor: 10,
        // validFileExtensions: ['.html', '.htm'],
      }),
    )
    .pipe(
      rename((path) => {
        console.log('Processed file (normal):', path.basename);
        path.basename = `.${path.basename}`;
      }),
    )
    .pipe(gulp.dest('.'));
};

// Old way lqip
const oldWayLqip = () => {
  return gulp
    .src(['data-src-test.html', '!.*.*'])
    .pipe(
      gulpEmbedLqipAsBackground({
        rootPath: __dirname,
        lazyLoadClass: 'lazy-load',
        srcAttr: 'src',
        dataSrcAttr: 'data-src',
        // scaleFactorAttr: 'data-scale-factor',
        // scaleFactor: 10,
        // validFileExtensions: ['.html', '.htm'],
      }),
    )
    .pipe(
      rename((path) => {
        console.log('Processed file (old-way):', path.basename);
        path.basename = `.${path.basename}`;
      }),
    )
    .pipe(gulp.dest('.'));
};

// Check for expected results in the `fileList`
const validate = () => {
  // Extected 2 images to be processed, one image per file
  const expectedImages = 2;
  let foundProcessedImages = 0;

  fileList.forEach((filePath) => {
    const fileData = fs.readFileSync(filePath, { encoding: 'utf8' });

    const $ = cheerio.load(fileData);

    $('img').each((_index, element) => {
      const img = $(element);
      const styleAttr = img.attr('style');
      const hasProcessedThumbnail = styleAttr?.includes(
        'background-image: url("data:image/svg+xml;',
      );
      if (hasProcessedThumbnail) {
        foundProcessedImages++;
      }
    });
  });

  console.log(`Found ${foundProcessedImages} processed images out of ${expectedImages} expected.`)
  if (foundProcessedImages !== expectedImages) {
    Promise.reject(
      new Error(
        `Some images don't have an embedded background images (expected ${expectedImages} got ${foundProcessedImages})`,
      ),
    );

    return;
  }

  return Promise.resolve();
};

gulp.task('default', gulp.series(gulp.parallel(lqip, oldWayLqip), validate));
