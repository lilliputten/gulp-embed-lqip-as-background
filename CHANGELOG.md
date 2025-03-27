<!--
 @since 2025.03.22, 06:17
 @changed 2025.03.27, 06:18
-->

# CHANGELOG

## [v.0.0.11](https://github.com/lilliputten/gulp-embed-lqip-as-background/releases/tag/v.0.0.11) - 2025.03.27

- Updated image source fetching logic: Now the source attribute name can be specified in the `data-src-attr-name` node attribue. Also additinally looging for value in the following attributes: `data-src`, `data-lazy`, `data-lazy-src`.
- Updated version: 0.0.11.

[Compare with the previous version](https://github.com/lilliputten/gulp-embed-lqip-as-background/compare/v.0.0.10...v.0.0.11)

## [v.0.0.10](https://github.com/lilliputten/gulp-embed-lqip-as-background/releases/tag/v.0.0.10) - 2025.03.22

- The plugin returns a stream to allow further processing of the source files.
- Added extra parameters to more flexible control of the behavior: `lazyLoadClass`, `srcAttr`, `dataSrcAttr`, `scaleFactorAttr`, `scaleFactor`, `validFileExtensions`.
- The thumbnail image is embedded into the "style:background" property as an svg object, which is a thumbnail, while the main image has not been uploaded.
- Added old-way mode: if an `dataSrcAttr` is specified, then plugin generates the preview into this particular attribute, but not in the background object.
- Added TS typings.

[Compare with the previous version](https://github.com/lilliputten/gulp-embed-lqip-as-background/compare/v.0.0.8...v.0.0.10)
