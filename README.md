# gulp-image-lqip

[![npm version](https://img.shields.io/npm/v/gulp-image-lqip.svg)](https://www.npmjs.com/package/gulp-image-lqip)
[![Build Status](https://github.com/Johann-S/gulp-image-lqip/workflows/Tests/badge.svg)](https://github.com/Johann-S/gulp-image-lqip/actions?workflow=Tests)
[![dependencies Status](https://img.shields.io/david/Johann-S/gulp-image-lqip.svg)](https://david-dm.org/Johann-S/gulp-image-lqip)
[![devDependency Status](https://img.shields.io/david/dev/Johann-S/gulp-image-lqip.svg)](https://david-dm.org/Johann-S/gulp-image-lqip?type=dev)

> Parses your HTML files to find images and adds a data-src attribute to them which contains their Base64 representation.

[Demo](https://gulp-image-lqip.netlify.com/)

## Install

```bash
npm install --save-dev gulp-image-lqip
```

## Usage

```javascript
const gulp = require('gulp');
const gulpEmbedLQIP = require('gulp-image-lqip');

gulp.task('default', () => {
  return (
    gulp
      .src('*.html')
      // `gulp-image-lqip` needs filepaths
      // so you can't have any plugins before it
      .pipe(gulpEmbedLQIP(__dirname))
  );
});
```

## Supported files

Currently `['jpeg', 'jpg', 'png', 'gif']` files are supported.

Attention: No transparency is supported.

## API

### gulpEmbedLQIP(rootPath, options)


#### options

Type: `Object`

##### rootPath

- Type: `string`
- **Required**

Define the rootPath for the images (probably that's the website root), it must be an **absolute** path.


##### lazyLoadClass

- Type: `string`
- Default: `"lazy-load"`

Image class to detect if this element should be processed. Don't check the class if empty.


##### srcAttr

- Type: `string`
- Default: `"src"`
- **Required**

Attribute which contain your image.


##### dataSrcAttr

- Type: `string`
- Default: `""`

Data source attribute to additionally store the scaled image base64 content, eg 'data-src'. Don't store if empty.


##### scaleFactorAttr

- Type: `string`
- Default: `"data-scale-factor"`

Downscale ratio attribute to fetch the value from specific element. It'll override a value form the global `scaleFactor` attribute (see below).


##### scaleFactor

- Type: `number`
- Default: `10`
- **Required**

Downscale image ratio. Default value: 10.


##### validFileExtensions

- Type: `string[]`
- Default: `['.html', '.htm']`
- **Required**

Valid source file extensions.


## Thanks

- [Johann Servoire's gulp-image-lqip](https://github.com/Johann-S/gulp-image-lqip) for an idea and a base for my own features.
- [Nikita Dubko](https://mefody.dev/) for a method of embedding preview thumbnail into the image elemnts as a backround svg object.

## License

MIT © [Lilliputten & Noble](https://lilliputten.com/)
