/**
 * Copyright (C) 2017 Ola Benderius
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

var fs = require('fs');
var http = require('http');
const { URL } = require('url');
var querystring = require('querystring');

var opendlvlayer = require('./opendlv-editor.server-layer');
var opendlvnamespace = require('./opendlv-editor.server-namespace');
var opendlvmicroservice = require('./opendlv-editor.server-microservice');

http.createServer(function (req, res) {
  const url = new URL(req.url, 'https://opendlv.org/');

  var pathname = url.pathname;

  if (pathname == '/ajax') {
    var sendJson = function(data) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(data);
    };
  
    var query = querystring.parse(url.search.substr(1));
    switch (query.request) {
      case 'getlayers':
        opendlvlayer.getLayers(sendJson);
        break;
      case 'createlayer':
        const layer = JSON.parse(query.data);
        opendlvlayer.create(sendJson, layer);
        break;
      case 'addnamepsace':
        const namespace = JSON.parse(query.data);
        opendlvnamespace.add(sendJson, namespace);
        break;
      case 'addmicroservice':

        opendlvmicroservice.addCfsd18Microservice();

        break;
      default:
    }
  } else {
    var filename;
    var contentType;

    switch (pathname) {
      case '/opendlv-editor.client.js':
        filename = 'client/opendlv-editor.client.js';
        contentType = 'application/javascript';
        break;
      case '/opendlv-editor.client.css':
        filename = 'client/opendlv-editor.client.css';
        contentType = 'text/css';
        break;
      default:
        filename = 'client/index.html';
        contentType = 'text/html';
    }
        
    fs.readFile(filename, function(err, data) {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    });
  }
}).listen(8080); 
