const path = require("path");
const fs = require("fs");

module.exports = {
    handle: handler
};

const mimeTypes = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpg',
	'.gif': 'image/gif',
	'.wav': 'audio/wav',
	'.mp3': 'audio/mp3',
	'.mp4': 'video/mp4',
	'.woff': 'application/font-woff',
	'.ttf': 'application/font-ttf',
	'.eot': 'application/vnd.ms-fontobject',
	'.otf': 'application/font-otf',
	'.svg': 'application/image/svg+xml'
};

function handler(request, response) {
    let filePath = '.' + request.url;

    let extname = String(path.extname(filePath)).toLowerCase();
    if (extname === "") {
        extname = ".html";
        filePath += "/index.html";
    }

    const contentType = mimeTypes[extname] || 'application/octet-stream';
    if (/srv/.test(filePath) || /coin_war.js/.test(filePath)) {
        fs.readFile('./403.html', function(error, content) {
            response.writeHead(403, {
                'Content-Type': 'text/html'
            });
            response.end(content, 'utf-8');
        });
    } else {
        fs.readFile(filePath, function(error, content) {
            if (error) {
                if (error.code == 'ENOENT') {
                    fs.readFile('./404.html', function(error, content) {
                        response.writeHead(404, {
                            'Content-Type': 'text/html'
                        });
                        response.end(content, 'utf-8');
                    });
                } else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                    response.end();
                }
            } else {
                response.writeHead(200, {
                    'Content-Type': contentType
                });
                response.end(content, 'utf-8');
            }
        });
    }
}