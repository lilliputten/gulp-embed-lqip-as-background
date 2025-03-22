// @ts-check

/** @type {Record<string, string>} */
const ESCAPE_TABLE = {
  '#': '%23',
  '%': '%25',
  ':': '%3A',
  '<': '%3C',
  '>': '%3E',
  '"': "'",
};

const ESCAPE_REGEX = new RegExp(Object.keys(ESCAPE_TABLE).join('|'), 'g');

/** @param {string} match */
function escaper(match) {
  return ESCAPE_TABLE[match];
}

/**
 * @param {TImageData} data
 * @return {string} svg data
 */
function composeSvg(data) {
  const { base64, width, height } = data;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 ${width} ${height}">
    <filter id="b" color-interpolation-filters="sRGB">
    <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
    <feComponentTransfer>
        <feFuncA type="discrete" tableValues="1 1"></feFuncA>
    </feComponentTransfer>
    </filter>
    <image filter="url(#b)" preserveAspectRatio="none"
    height="100%" width="100%"
    xlink:href="${base64}">
    </image>
</svg>`;
  svg = svg.replace(/\s+/g, ' ');
  svg = svg.replace(/> </g, '><');
  svg = svg.replace(ESCAPE_REGEX, escaper);
  return svg;
}

module.exports = {
  composeSvg,
};
