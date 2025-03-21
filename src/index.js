// @ts-check

'use strict';

const path = require('path');
const through = require('through2');
const PluginError = require('plugin-error');
const { processHtml } = require('./process-html');
const stream = require('stream'); // eslint-disable-line no-unused-vars
// const { Transform, Stream } = require('stream');

const PLUGIN_NAME = 'gulp-embed-lqip-as-background';
const validFileExtensions = ['.html', '.htm'];
const defaultConfig = {
  attribute: 'data-src',
  pretty: true,
  srcAttr: 'src',
};

module.exports = (
  /** @type {string} */ rootPath,
  /** @type {Record<string, string | number | boolean | undefined>} */ config = {},
) => {
  /**
   * @type {any[]}
   */
  const files = [];

  config = Object.assign(defaultConfig, config);

  if (!path.isAbsolute(rootPath)) {
    throw new Error(`${PLUGIN_NAME}: rootPath must be absolute`);
  }

  config.rootPath = rootPath;

  /**
   * @param {any} file
   * @param {BufferEncoding} encoding
   * @param {(error?: Error) => void} done
   */
  function aggregate(file, encoding, done) {
    console.log('XXX', {
      file,
    });
    debugger;
    if (file.isStream()) {
      return done(new PluginError(PLUGIN_NAME, 'Streams not supported!'));
    }

    if (!validFileExtensions.includes(path.extname(file.path).toLowerCase())) {
      return done(new PluginError(PLUGIN_NAME, 'Only htm(l) files are supported!'));
    }

    files.push(file);
    done();
  }

  /**
   * @this {stream.Transform}
   * @param {(error?: Error) => void} done
   */
  function transform(done) {
    const promiseFileList = files.map((file) => processHtml(file, config));

    Promise.all(promiseFileList)
      .then(() => done())
      .catch((error) => done(new PluginError(PLUGIN_NAME, error)));
  }

  return through.obj(aggregate, transform);
};
