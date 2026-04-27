const http = require("http");
const { loadConfig } = require("./config");
const { createApp } = require("./router");

const config = loadConfig();
const server = http.createServer(createApp());

server.listen(config.port, () => {
  console.log(`Marketing OS Sprint 0 API listening on http://localhost:${config.port}/v1`);
});
