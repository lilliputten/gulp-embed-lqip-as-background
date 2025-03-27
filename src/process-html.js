// @ts-check

const path = require('path');
const cheerio = require('cheerio');
const { processImage, supportedMimetypes } = require('./process-image');
const Vinyl = require('vinyl'); // eslint-disable-line no-unused-vars
const { composeSvg } = require('./compose-svg');

const validImgExtensions = Object.keys(supportedMimetypes).map((ext) => `.${ext}`);

/**
 * @param {TImageData['img']} img
 * @param {TPluginConfig} config
 * @return {string}
 */
function getImgSrcAttr(img, config) {
  const { srcAttr } = config;
  const nodeSrcAttr = img.attr('data-src-attr-name') || srcAttr;
  return (
    img.attr(nodeSrcAttr) ||
    img.attr('data-src') ||
    img.attr('data-lazy') ||
    img.attr('data-lazy-src')
  );
}

/**
 * @param {Record<string, TImageData>} allImagesData
 * @param {Vinyl} file
 * @param {TPluginConfig} config
 */
function colectImages(allImagesData, file, config) {
  const { lazyLoadClass, rootPath } = config;

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
    const src = getImgSrcAttr(img, config);
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
  const { lazyLoadClass, dataSrcAttr, rootPath } = config;

  // Get file contents again, for this specific source file
  const contents = file.contents;
  const fileContents = contents.toString('utf8');
  const $ = cheerio.load(fileContents);
  const imageList = $('img').toArray();

  // Do nothing if no images found
  if (!imageList.length) {
    return file;
  }

  // Process all the images...
  imageList.forEach((el) => {
    const img = $(el);
    const src = getImgSrcAttr(img, config);
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
    img.attr('loading', 'lazy');
    // Set extra attribute
    if (dataSrcAttr && data.base64) {
      img.attr(dataSrcAttr, data.base64);
    } else {
      const svg = composeSvg(data);
      const URI = `data:image/svg+xml;charset=utf-8,${svg}`;
      img.css('background-size', 'cover');
      img.css('background-image', `url("${URI}")`);
    }
    if (data.width) {
      img.attr('width', String(data.width));
    }
    if (data.height) {
      img.attr('height', String(data.height));
    }
  });

  // Update file contents
  const newContents = $.html(); // prettyHtml ? pretty($.html(), { ocd: true }) : $.html();
  file.contents = Buffer.from(newContents); // Buffer.from('XXX');

  // And return it
  return file;
}

module.exports = {
  colectImages,
  prepareImages,
  processHtml,
};
