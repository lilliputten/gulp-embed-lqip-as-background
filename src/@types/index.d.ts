/// <reference types="node"/>
/// <reference types="TPluginConfig"/>

declare namespace gulpEmbedLqipAsBackground {
  type PluginOptions = TPluginConfig;
}

declare function gulpEmbedLqipAsBackground(options?: gulpEmbedLqipAsBackground.PluginOptions): NodeJS.ReadWriteStream;
export = gulpEmbedLqipAsBackground;
