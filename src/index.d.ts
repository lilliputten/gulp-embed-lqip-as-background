/// <reference types="node"/>
/// <reference types="TPluginConfig"/>

declare namespace gulpEmbedLQIP {
  type PluginOptions = TPluginConfig;
}

declare function gulpEmbedLQIP(options?: gulpEmbedLQIP.PluginOptions): NodeJS.ReadWriteStream;
export = gulpEmbedLQIP;
