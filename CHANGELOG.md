<!--
 @since 2025.03.22, 06:17
 @changed 2025.03.22, 08:25
-->

# CHANGELOG

## [v.0.0.2](https://github.com/lilliputten/gulp-embed-lqip-as-background/releases/tag/v.0.0.2) - 2025.03.22

- The plugin returns a stream to allow further processing of the source files.
- Added extra parameters to more flexible control of the behavior: `lazyLoadClass`, `srcAttr`, `dataSrcAttr`, `scaleFactorAttr`, `scaleFactor`, `validFileExtensions`.
- The thumbnail image is embedded into the "style:background" property as an svg object, which is a thumbnail, while the main image has not been uploaded.
- Added old-way mode: if an `dataSrcAttr` is specified, then plugin generates the preview into this particular attribute, but not in the background object.
- Added TS typing.
