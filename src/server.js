const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const { loadConfig } = require("./config");
const { createApp } = require("./router");

const NASHIR_UI_DIR = path.join(__dirname, "..", "ui", "nashir");

const appJsAsset = { file: "app.js", contentType: "application/javascript; charset=utf-8" };
const stylesCssAsset = { file: "styles.css", contentType: "text/css; charset=utf-8" };

const NASHIR_STATIC_ASSETS = new Map([
  ["/nashir/app.js", appJsAsset],
  ["/nashir/styles.css", stylesCssAsset]
]);

function createServer(options = {}) {
  return http.createServer(createServerHandler(options));
}

function createServerHandler(options = {}) {
  const app = options.app || createApp(options);
  const fileCache = new Map();

  return async function serverHandler(req, res) {
    try {
      if (await serveNashirStatic(req, res, fileCache)) {
        return;
      }
      return await app(req, res);
    } catch (err) {
      console.error("Server handler failed:", err);
      if (!res.headersSent) {
        res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      }
      if (!res.writableEnded) {
        res.end("Internal Server Error");
      }
    }
  };
}

async function serveNashirStatic(req, res, fileCache) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return false;
  }

  const url = new URL(req.url, "http://localhost");
  const pathname = url.pathname;

  if (pathname === "/nashir") {
    res.writeHead(301, { location: "/nashir/" });
    res.end();
    return true;
  }

  if (pathname === "/nashir/") {
    return sendStaticFile(res, "index.html", "text/html; charset=utf-8", req.method, fileCache);
  }

  const asset = NASHIR_STATIC_ASSETS.get(pathname);
  if (asset) {
    return sendStaticFile(res, asset.file, asset.contentType, req.method, fileCache);
  }

  if (pathname.startsWith("/nashir/")) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end(req.method === "HEAD" ? undefined : "Not Found");
    return true;
  }

  return false;
}

async function sendStaticFile(res, fileName, contentType, method, fileCache) {
  let content = fileCache.get(fileName);
  if (content === undefined) {
    const filePath = path.join(NASHIR_UI_DIR, fileName);
    try {
      content = await fs.readFile(filePath);
    } catch (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        res.end(method === "HEAD" ? undefined : "Not Found");
      } else {
        res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
        res.end(method === "HEAD" ? undefined : "Internal Server Error");
      }
      return true;
    }
    fileCache.set(fileName, content);
  }
  res.writeHead(200, {
    "content-type": contentType,
    "content-length": content.length,
    "cache-control": "no-cache"
  });
  res.end(method === "HEAD" ? undefined : content);
  return true;
}

if (require.main === module) {
  const config = loadConfig();
  const server = createServer();

  server.listen(config.port, () => {
    console.log(`Marketing OS Sprint 0 API listening on http://localhost:${config.port}/v1`);
  });
}

module.exports = {
  createServer,
  createServerHandler
};
