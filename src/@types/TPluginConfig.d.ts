// type TPluginConfig = Record<string, string | number | boolean | undefined>;
interface TPluginConfig {
  /** Absolute path. Thes path is the parent for all the images, see `srcAttr` parameter. */
  rootPath: string;
  /** Image class to detect if this element should be processed. Don't process if empty. Default: 'lazy-load'. */
  lazyLoadClass: string;
  /** Source attribute name. Should be relative (to the `rootPath`) path. Would be fetched from the `data-src-attr-name` of the node. Also the following attributes will be checked: `data-src`, `data-lazy`, `data-lazy-src`. Default: 'src'. */
  srcAttr: string;
  /** Data source attribute name to additionally store the scaled image base64 content, eg 'data-src'. Default: empty (don't store). Specify to produce old-way attributes (see an example in the `demo` folder). */
  dataSrcAttr?: string;
  /** Downscale ratio attribute name to fetch the value from specific element. It'll override a value form the global `scaleFactor` attribute (see below). Default value: 'data-scale-factor'. */
  scaleFactorAttr: string;
  /** Downscale ratio. Default value: 10. */
  scaleFactor: number; // 10
  /** Valid source file extensions. Default values: ['.html', '.htm'] */
  validFileExtensions: string[];
}
type TPluginPartialConfig = Partial<TPluginConfig>;
