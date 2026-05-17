const assert = require("node:assert/strict");
const { Readable } = require("node:stream");
const test = require("node:test");
const { createServerHandler } = require("../src/server");

test("GET /nashir serves the Nashir static UI HTML", async () => {
  const handler = createServerHandler();
  const response = await request(handler, "/nashir");

  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /^text\/html/);
  assert.match(response.body, /<title>Nashir Campaign Evidence UI<\/title>/);
  assert.match(response.body, /<script src="\.\/app\.js"><\/script>/);
});

test("Nashir static JS and CSS assets load", async () => {
  const handler = createServerHandler();
  const script = await request(handler, "/app.js");
  const styles = await request(handler, "/styles.css");
  const namespacedScript = await request(handler, "/nashir/app.js");
  const namespacedStyles = await request(handler, "/nashir/styles.css");

  assert.equal(script.status, 200);
  assert.match(script.headers["content-type"], /^application\/javascript/);
  assert.match(script.body, /fetch\(/);

  assert.equal(styles.status, 200);
  assert.match(styles.headers["content-type"], /^text\/css/);
  assert.match(styles.body, /\.shell/);

  assert.equal(namespacedScript.status, 200);
  assert.equal(namespacedStyles.status, 200);
});

test("unknown Nashir static asset returns 404", async () => {
  const handler = createServerHandler();
  const response = await request(handler, "/nashir/missing.js");

  assert.equal(response.status, 404);
  assert.match(response.headers["content-type"], /^text\/plain/);
});

test("existing API routes still work behind the static server", async () => {
  const handler = createServerHandler();
  const response = await request(handler, "/v1/health");
  const body = JSON.parse(response.body);

  assert.equal(response.status, 200);
  assert.equal(body.data.status, "ok");
});

test("HEAD /nashir returns headers without body", async () => {
  const handler = createServerHandler();
  const response = await request(handler, "/nashir", "HEAD");

  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /^text\/html/);
  assert.equal(response.body, "");
});

test("read failure returns controlled 500", async (t) => {
  const fs = require("fs/promises");
  t.mock.method(fs, "readFile", async () => {
    const err = new Error("disk error");
    throw err;
  });
  const handler = createServerHandler();
  const response = await request(handler, "/nashir");

  assert.equal(response.status, 500);
  assert.match(response.headers["content-type"], /^text\/plain/);
});

async function request(handler, path, method = "GET") {
  const req = Readable.from([]);
  req.method = method;
  req.url = path;
  req.headers = {};

  return await new Promise((resolve, reject) => {
    const chunks = [];
    let headersSent = false;
    const res = {
      statusCode: 200,
      headers: {},
      get headersSent() {
        return headersSent;
      },
      writeHead(status, headers) {
        headersSent = true;
        this.statusCode = status;
        this.headers = normalizeHeaders(headers);
      },
      end(payload) {
        if (payload) {
          chunks.push(Buffer.isBuffer(payload) ? payload : Buffer.from(String(payload)));
        }
        resolve({
          status: this.statusCode,
          headers: this.headers,
          body: Buffer.concat(chunks).toString("utf8")
        });
      }
    };

    Promise.resolve(handler(req, res)).catch(reject);
  });
}

function normalizeHeaders(headers = {}) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])
  );
}
