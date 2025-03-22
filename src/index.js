// @ts-check

const path = require('path');
const through = require('through2');
const PluginError = require('plugin-error');
const { processHtml, colectImages, prepareImages } = require('./process-html');
const stream = require('stream'); // eslint-disable-line no-unused-vars
const Vinyl = require('vinyl'); // eslint-disable-line no-unused-vars

const PLUGIN_NAME = 'gulp-embed-lqip-as-background';

/** @type {TPluginConfig} */
const defaultConfig = {
  rootPath: '',
  lazyLoadClass: 'lazy-load',
  srcAttr: 'src',
  dataSrcAttr: '',
  scaleFactorAttr: 'data-scale-factor',
  scaleFactor: 10,
  validFileExtensions: ['.html', '.htm'],
};

/**
 * @param {TPluginPartialConfig} [pluginConfig]
 */
function plugin(pluginConfig = {}) {
  /** @type {Vinyl[]} */
  const files = [];

  /** Fully resolved config
   * @type {TPluginConfig}
   */
  const config = {
    ...defaultConfig,
    ...pluginConfig,
  };

  if (!config.rootPath || !path.isAbsolute(config.rootPath)) {
    throw new Error(`${PLUGIN_NAME}: rootPath must be absolute`);
  }

  /**
   * @param {Vinyl} file
   * @param {string} _encoding - ignored if file contains a Buffer
   * @param {TDoneCallback} done - Call this function (optionally with an error argument and data) when you are done processing the supplied chunk.
   */
  function aggregate(file, _encoding, done) {
    if (file.isStream()) {
      // @see vinyl-buffer
      return done(new PluginError(PLUGIN_NAME, 'Streams not supported!'));
    }
    files.push(file);
    done();
  }

  /**
   * @this {stream.Transform}
   * @param {TDoneCallback} done
   */
  function transform(done) {
    // Extract all the images from all the aggregated source files...
    const collectedImagesData = files.reduce((collectedImagesData, file) => {
      colectImages(collectedImagesData, file, config);
      return collectedImagesData;
    }, /** @type {Record<string, TImageData>} */ ({}));

    // Enrich all the images with base64-encoded downscalled images...
    Promise.all(prepareImages(collectedImagesData, config))
      .then((resolvedImagesList) => {
        // Convert enriched images list back into the hash
        const allImagesData = resolvedImagesList.reduce((allImagesData, data) => {
          allImagesData[data.fullPath] = data;
          return allImagesData;
        }, /** @type {Record<string, TImageData>} */ ({}));

        // Process all the source files and update all found images with placeholder data...
        const results = files.map((file) => processHtml(allImagesData, file, config));

        // And finally return all the files to fulp...
        results.forEach((file) => {
          this.push(file);
        });

        done();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('[index:plugin] error', error);
        debugger; // eslint-disable-line no-debugger
        done(new PluginError(PLUGIN_NAME, error));
      });
  }

  return through.obj(aggregate, transform);
}

module.exports = plugin;
