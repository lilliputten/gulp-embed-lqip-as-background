<!--
 @since 2025.03.22, 06:17
 @changed 2025.03.24, 22:05
-->

# Gulp LQIP small image placeholder generator plugin

[![npm version](https://img.shields.io/npm/v/gulp-embed-lqip-as-background.svg)](https://www.npmjs.com/package/gulp-embed-lqip-as-background)

Gulp plugin which generates HTML image placeholders using lqip technique and allows to embed them into the image background to get rid of client-side javascript.

It parses your HTML files to find images and adds a data-src attribute to them which contains their Base64 representation.

([LQIP](https://cloudinary.com/blog/low_quality_image_placeholders_lqip_explained) stands for "Low-quality image placeholders" technique to provide already prepared small resource-effective image previews.)

This plugin does the same as [Johann Servoire's gulp-image-lqip](https://github.com/Johann-S/gulp-image-lqip), but doesn't require JS on the client side -- it embeds a downscaled image into an image's style `background` (as an svg object) and sets `loading=lazy` attribute to allow the browser to control the images loading.

In case if you specify the `dataSrcAttr` options parameter, then it'll behave in original way: by storing the downscaled preview in the specified attribute instead of `style:background` object.

Another improvement are:

- This plugin returns relevant vinyl streams and allow further processing of the stream. It means that now you must to handle the resulting streams (at least to write them into the destination).
- It automatically sets the `width`, `height` and `loading=lazy` attributes for the processed images.
- It doesn't try to prettify the results. So, you should care about that by yourself (take a look at the [gulp-html-prettify](https://www.npmjs.com/package/gulp-html-prettify) plugin).

(Probably it's possible to improve the solution using scroll events intersection observer if you don't trust the browser's loading algorithm.)

You can see the real-case usage example on my other project page:

## Build info (auto-generated)

- Project info: gulp-embed-lqip-as-background v.0.0.10 / 2025.03.24 21:50:13 +0300

## Resources:

- The project's repository: https://github.com/lilliputten/gulp-embed-lqip-as-background

Real use case:

- Real use case: https://github.com/lilliputten/tubecaster-landing/blob/main/gulpfile.js

- Deployed site: [TubeCasterBot promotional landing](https://tubecaster.lilliputten.com/)

Demos (see by a browser in a cloned repo):

- Test result for [test/test.html](test/test.html): [demo/demo-style-background-svg-object.html](demo/demo-style-background-svg-object.html) (See 'Example case' section below.)
- Original plugin test (uses `data-src` attribute and in-page js code): [demo/demo-data-src-attr.html](demo/demo-data-src-attr.html)

## Install

```bash
npm install --save-dev gulp-embed-lqip-as-background
```

or

```bash
pnpm i -D  gulp-embed-lqip-as-background
```

...etc...

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
        // This argument is only required.
        rootPath: __dirname,
        // The following arguments are optional, default values are displayed. See the options' reference below.
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

No transparency is supported.

The images with a generated `background:style` svg objects mostly should have `display: inline-block` css rule to be displayed correctly (see bootstrap classes `figure` or v5's `inline-block`).

## Example case

A tag in the source file ([test/test.html](test/test.html)):

```html
<img
  src="img/csb.jpg"
  class="img-fluid lazy-load figure"
  data-scale-factor="5"
/>
```

Generated code ([demo/demo-style-background-svg-object.html](demo/demo-style-background-svg-object.html)):

```html
<img
  src="img/csb.jpg"
  class="img-fluid lazy-load figure"
  data-scale-factor="5"
  loading="lazy"
  style="background-size: cover; background-image: url(&quot;data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http%3A//www.w3.org/2000/svg' xmlns%3Axlink='http%3A//www.w3.org/1999/xlink' viewBox='0 0 600 599'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='.5'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='1 1'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter='url(%23b)' preserveAspectRatio='none' height='100%25' width='100%25' xlink%3Ahref='data%3Aimage/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAUABQMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP1V/ZI/aK8Rfs3wfH7w58P/AAZ8PYdF8YftF/ELx7JZNoup2Is7zWYdFtXjZtJ1uxW9vJIdPgm1PUHjhj1HUpLvUYtPsJby6SX8vp8SZxkt6eGq4XE0sZbGtZjQr4urRq11epCnVWLo2otcnLBwupRlNybm7ft+c8F5DmawFSrSxODr4TB0sBVeWVaGDoYr2FOnUWInQlha7jVk68lK9Weiik1FJL//2Q=='%3E%3C/image%3E%3C/svg%3E&quot;);"
  width="600"
  height="599"
/>

```

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

Downscale image ratio. Default value: 10.

##### validFileExtensions

- Type: `string[]`
- Default: `['.html', '.htm']`

Valid source file extensions.

## Thanks

- [Johann Servoire's gulp-image-lqip](https://github.com/Johann-S/gulp-image-lqip) for an idea and a base for my own features.
- [Nikita Dubko's 11ty site](https://github.com/MeFoDy/mefody.dev) for a method of embedding preview thumbnail into the image elemnts as a backround svg object.

## License

MIT © [Lilliputten & Noble](https://lilliputten.com/)
