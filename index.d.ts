/// <reference types="node"/>

declare namespace gulpEmbedLQIP {
  interface PluginOptions {
    /** Absolute path. Thes path is the parent for all the images, see `srcAttr` parameter. */
    rootPath: string;
    /** Image class to detect if this element should be processed. Don't process if empty. Default: 'lazy-load'. */
    lazyLoadClass: string;
    /** Source attribute. Should be relative (to the `rootPath`) path. Default: 'src'. */
    srcAttr: string;
    /** Data source attribute to additionally store the scaled image base64 content, eg 'data-src' Default: empty (don't store). */
    dataSrcAttr?: string;
    /** Downscale ratio attribute to fetch the value from specific element. Default value: 'data-scale-factor'. */
    scaleFactorAttr: string;
    /** Downscale ratio. Default value: 10. */
    scaleFactor: number; // 10
    /** Valid source file extensions. Default values: ['.html', '.htm'] */
    validFileExtensions: string[];
  }
}

declare function gulpEmbedLQIP(options?: gulpEmbedLQIP.PluginOptions): NodeJS.ReadWriteStream;
export = gulpEmbedLQIP;
