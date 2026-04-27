const http = require("http");
const { createApp } = require("./router");

const port = Number(process.env.PORT || 3000);
const server = http.createServer(createApp());

server.listen(port, () => {
  console.log(`Marketing OS Sprint 0 API listening on http://localhost:${port}/v1`);
});
