<!--
 @since 2025.03.22, 06:17
 @changed 2025.03.22, 08:50
-->

# gulp-embed-lqip-as-background

[![npm version](https://img.shields.io/npm/v/gulp-embed-lqip-as-background.svg)](https://www.npmjs.com/package/gulp-embed-lqip-as-background)

> Parses your HTML files to find images and adds a data-src attribute to them which contains their Base64 representation.

This plugin does the same as [Johann Servoire's gulp-image-lqip](https://github.com/Johann-S/gulp-image-lqip), but doesn't require JS on the client side -- it embeds a downscaled image into an image's style `background` and sets `loading=lazy` attribute to allow the browser to control the images loading.

In case if you specify the `dataSrcAttr` options parameter, then it'll behave in original way: by storing the downscaled preview in the specified attribute instead of `style:background` object.

Another improvement are:

- This plugin returns relevant vinyl streams and allow further processing of the stream. It means that now you must to handle the resulting streams (at least to write them into the destination).
- It automatically sets the `width`, `height` and `loading=lazy` attributes for the processed images.
- It doesn't try to prettify the results. So, you should care about that by yourself (take a look at the [gulp-html-prettify](https://www.npmjs.com/package/gulp-html-prettify) plugin).

(Probably it's possible to improve the solution using scroll events intersection observer if you don't trust the browser's loading algorithm.)

You can see the real-case usage example on my other project page:

## Build info (auto-generated)

- Project info: gulp-embed-lqip-as-background v.0.0.8 / 2025.03.22 23:13:17 +0300

## Resources:

- The project's repository: https://github.com/lilliputten/gulp-embed-lqip-as-background

- Real usage case: https://github.com/lilliputten/tubecaster-landing/blob/main/gulpfile.js

- Real usage deployed site: [TubeCasterBot promotional landing](https://tubecaster.lilliputten.com/)

## Install

```bash
npm install --save-dev gulp-embed-lqip-as-background
```

## Usage

```javascript
const gulp = require('gulp');
const gulpEmbedLqipAsBackground = require('gulp-embed-lqip-as-background');

gulp.task('default', () => {
  return gulp
    .src(['*.html'])
    .pipe(
      gulpEmbedLqipAsBackground({
        // It requires an absolute path of the image's root (website root in your project).
        // This argument is required.
        rootPath: __dirname,
        // The following arguments are optional. See the options' reference below.
        // dataSrcAttr: 'data-src', // Specify to produce old-way attributes (see an example in the `demo` folder).
        // lazyLoadClass: 'lazy-load',
        // srcAttr: 'src',
        // scaleFactorAttr: 'data-scale-factor',
        // scaleFactor: 10,
        // validFileExtensions: ['.html', '.htm'],
      }),
    )
    .pipe(gulp.dest('.'));
});
```

## Supported files

Currently `['jpeg', 'jpg', 'png', 'gif']` files are supported.

Attention: No transparency is supported.

## API

### gulpEmbedLqipAsBackground(options)

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

Data source attribute to additionally store the scaled image base64 content, eg 'data-src'.

Specify to produce old-way attributes (see an example in the `demo` folder).

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
- [Nikita Dubko's 11ty site](https://github.com/MeFoDy/mefody.dev) for a method of embedding preview thumbnail into the image elemnts as a backround svg object.

## License

MIT © [Lilliputten & Noble](https://lilliputten.com/)
