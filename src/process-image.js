// @ts-check

const path = require('path');
const jimp = require('jimp');

/** @type {Record<string, string>} */
const supportedMimetypes = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
};

/**
 * @param {string} extMimeType
 * @param {Buffer} data
 */
function toBase64(extMimeType, data) {
  return `data:${extMimeType};base64,${data.toString('base64')}`;
}

/**
 * @param {TImageData} data
 * @param {TPluginConfig} config
 * @return {Promise<TProcessImageResult>}
 */
function processImage(data, config) {
  const { fullPath, img } = data;
  const dataScaleFactor = parseInt(img.attr('data-scale-factor'));
  const scaleFactor =
    isNaN(dataScaleFactor) || !dataScaleFactor ? config.scaleFactor : dataScaleFactor;
  return new Promise((resolve, reject) => {
    const extension = path.extname(fullPath).split('.').pop();
    const ext = supportedMimetypes[extension];

    jimp
      .read(fullPath)
      .then((origImage) => {
        const resized = origImage.clone().resize(scaleFactor, jimp.AUTO);
        const promise = resized.getBufferAsync(ext);
        return promise
          .then((data) => {
            const base64 = toBase64(supportedMimetypes[extension], data);
            /** @type {TProcessImageResult} */
            const imgResult = {
              base64,
              width: origImage.bitmap.width,
              height: origImage.bitmap.height,
            };
            resolve(imgResult);
          })
          .catch(reject);
      })
      .catch(reject);
    /*
    jimp
      .read(fullPath)
      // TODO: Additionally extract the scale factor from the image attribute (`data-scale-factor`)
      .then((image) => image.resize(scaleFactor, jimp.AUTO))
      .then((image) => image.getBufferAsync(ext))
      .then((data) => {
        const base64 = toBase64(supportedMimetypes[extension], data);
        const imgData = {
          base64,
          width:
        };
        return resolve({
          base64,
        });
      })
      .catch(reject);
    */
  });
}

module.exports = {
  processImage,
  supportedMimetypes,
};
