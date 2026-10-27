#!/usr/bin/env node
/**
 * DSA Simulator - Local Development Server (Node.js)
 * Zero external dependencies. Uses Node.js native http, fs, and path modules.
 * Default port: 8080 (matches launch.json)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
    // Basic CORS & cache control
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    let safeUrl = decodeURI(req.url.split('?')[0]);
    if (safeUrl === '/') safeUrl = '/index.html';

    const filePath = path.join(ROOT_DIR, safeUrl);

    // Prevent directory traversal
    if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`  🔬 DSA Simulator — Lab Edition Server (Node.js)`);
    console.log(`  Running locally at: http://localhost:${PORT}`);
    console.log(`  Press Ctrl+C to stop.`);
    console.log('='.repeat(60));
});
