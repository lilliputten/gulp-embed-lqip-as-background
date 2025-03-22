// @ts-check

const path = require('path');
const cheerio = require('cheerio');
// const pretty = require('pretty');
const { processImage, supportedMimetypes } = require('./process-image');
const Vinyl = require('vinyl'); // eslint-disable-line no-unused-vars
const { composeSvg } = require('./compose-svg');

const validImgExtensions = Object.keys(supportedMimetypes).map((ext) => `.${ext}`);

/**
 * @param {Record<string, TImageData>} allImagesData
 * @param {Vinyl} file
 * @param {TPluginConfig} config
 */
function colectImages(allImagesData, file, config) {
  const { lazyLoadClass, srcAttr, rootPath } = config;

  // Do nothing if it's not a valid file
  const extension = path.extname(file.path).toLowerCase();
  const isValidFile = config.validFileExtensions.includes(extension);
  if (!isValidFile) {
    return;
  }

  // Get file contents
  const contents = file.contents;
  const fileContents = contents.toString('utf8');
  const $ = cheerio.load(fileContents);

  // Find all the images in this specific file...
  const imageList = $('img').toArray();

  // Do nothing if no images has been found
  if (!imageList.length) {
    return;
  }

  // Process found images and collect them into the `allImagesData` object...
  imageList.forEach((el) => {
    const img = $(el);
    const src = img.attr(srcAttr);
    // Has already exists?
    if (allImagesData[src]) {
      return;
    }
    // Has required class?
    if (lazyLoadClass && !img.hasClass(lazyLoadClass)) {
      return;
    }
    // Has valid src?
    if (!src || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
      return;
    }
    // Has supported extension?
    const fullPath = path.join(rootPath, src);
    if (!validImgExtensions.includes(path.extname(fullPath).toLowerCase())) {
      return;
    }
    // If all the conditions met, add this image...
    /** @type {TImageData} */
    const data = {
      el,
      img,
      src,
      fullPath,
    };
    allImagesData[fullPath] = data;
  });
}

/**
 * @param {Record<string, TImageData>} allImagesData
 * @param {TPluginConfig} config
 */
function prepareImages(allImagesData, config) {
  return Object.values(allImagesData).map((data) => {
    return processImage(data, config).then((imgResult) => {
      data.base64 = imgResult.base64;
      data.width = imgResult.width;
      data.height = imgResult.height;
      return data;
    });
  });
}

/**
 * @param {Record<string, TImageData>} allImagesData
 * @param {Vinyl} file
 * @param {TPluginConfig} config
 */
function processHtml(allImagesData, file, config) {
  const { lazyLoadClass, srcAttr, dataSrcAttr, rootPath } = config;

  // Get file contents again, for this specific source file
  const contents = file.contents;
  const fileContents = contents.toString('utf8');
  const $ = cheerio.load(fileContents);
  const imageList = $('img').toArray();

  // Do nothing if no images found
  if (!imageList.length) {
    return file;
  }

  /* // DEBUG
   * console.log('[process-html:processHtml] image', file.path, {
   *   images: imageList.map((el) => $(el).attr(srcAttr)),
   * });
   */

  // Process all the images...
  imageList.forEach((el) => {
    const img = $(el);
    const src = img.attr(srcAttr);
    const fullPath = path.join(rootPath, src);
    const data = allImagesData[fullPath];
    // Has processed data?
    if (!data) {
      return;
    }
    // Has required class?
    if (lazyLoadClass && !img.hasClass(lazyLoadClass)) {
      return;
    }
    const svg = composeSvg(data);
    const URI = `data:image/svg+xml;charset=utf-8,${svg}`;
    /* // DEBUG
     * console.log('[process-html:processHtml] image', file.path, src, {
     *   // svg,
     *   // URI,
     *   // img,
     *   src,
     *   fullPath,
     *   // data,
     *   // imageList,
     *   'file.path': file.path,
     *   // file,
     * });
     */
    img.attr('loading', 'lazy');
    img.css('background-size', 'cover');
    img.css('background-image', `url("${URI}")`);
    // Set extra attribute
    if (dataSrcAttr && data.base64) {
      img.attr(dataSrcAttr, data.base64);
    }
    if (data.width) {
      img.attr('width', String(data.width));
    }
    if (data.height) {
      img.attr('height', String(data.height));
    }
  });

  try {
    // Update file contents
    const newContents = $.html(); // prettyHtml ? pretty($.html(), { ocd: true }) : $.html();
    file.contents = Buffer.from(newContents); // Buffer.from('XXX');

    // And return it
    return file;
  } catch (error) {
    console.error('[process-html:processHtml] error', error);
    debugger;
    // return reject(error);
    throw error;
  }
}

module.exports = {
  colectImages,
  prepareImages,
  processHtml,
};
