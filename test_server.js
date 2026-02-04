const http = require('http');
const fs = require('fs');

const hostname = 'localhost';
const port = 4000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Node.js server is running on port 4000\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    fs.writeFileSync('server_started.txt', 'Server started successfully on port 4000 at ' + new Date().toISOString());
});
