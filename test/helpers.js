const { Readable } = require("stream");
const { createApp } = require("../src/router");
const { createSeedStore } = require("../src/store");

async function createTestServer() {
  const store = createSeedStore();
  const app = createApp({ store });

  async function request(method, path, options = {}) {
    const req = Readable.from(options.body ? [Buffer.from(JSON.stringify(options.body))] : []);
    req.method = method;
    req.url = `/v1${path}`;
    req.headers = {
      "content-type": "application/json",
      ...(options.userId ? { "x-user-id": options.userId } : {}),
      ...(options.headers || {})
    };

    return await new Promise((resolve) => {
      const res = {
        statusCode: 200,
        headers: {},
        writeHead(status, headers) {
          this.statusCode = status;
          this.headers = headers;
        },
        end(payload) {
          resolve({
            status: this.statusCode,
            body: payload ? JSON.parse(payload) : null
          });
        }
      };

      app(req, res);
    });
  }

  return {
    request,
    store,
    close: () => undefined
  };
}

module.exports = {
  createTestServer
};
