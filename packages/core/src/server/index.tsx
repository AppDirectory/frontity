import { resolve } from "path";
import Koa from "koa";
import { get } from "koa-route";
import React from "react";
import { renderToString } from "react-dom/server";
import template from "./template";
import App from "../app";
import { ChunkExtractor } from "@loadable/server";
// @ts-ignore
import stats from "../../build/static/client-chunks.json";

const app = new Koa();

const entrypoint = "other";

app.use(async (ctx, next) => {
  const extractor = new ChunkExtractor({ stats, entrypoints: [entrypoint] });
  const jsx = extractor.collectChunks(<App bundle={entrypoint} />);
  const html = renderToString(jsx);
  const scriptTags = extractor.getScriptTags();
  const linkTags = extractor.getLinkTags();
  const styleTags = extractor.getStyleTags();
  ctx.body = template({ html, scriptTags, linkTags });
  next();
});

app.use(get("/robots.txt", ctx => (ctx.body = "Disallow")));

export default () => app.callback();
