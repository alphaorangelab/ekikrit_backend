const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const PORT = 3000;

server.listen(PORT, console.log(`app is listening on port ${PORT}`));
