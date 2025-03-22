/// <reference types="cheerio" />
/// <reference types="domhandler" />

interface TImageData extends Partial<TProcessImageResult> {
  img: cheerio.Cheerio<domhandler.Element>;
  el: domhandler.Element;
  src: string;
  fullPath: string;
  // base64?: string;
}
