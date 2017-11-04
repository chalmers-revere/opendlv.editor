
var http = require('http');
var nunjucks = require('nunjucks');
var dateFormat = require('dateformat');
var fs = require('fs');
var mkdirp = require('mkdirp');

function saveFile(values, stagingDir, path, templateName, outputName) {

  if (path == '') {
    path = '.';
  }

  if (outputName == undefined) {
    outputName = templateName;
  }

  const res = nunjucks.render(path + '/' + templateName, values);

  const microservicePath = nunjucks.renderString(
    '{{ microservice.name | lower }}', values);
  const fullPath = stagingDir + '/' + microservicePath + '/' + path;
  const filename = fullPath + '/' + outputName;

  mkdirp.sync(fullPath);
  fs.writeFileSync(filename, res);
}


http.createServer(function (req, res) {

  var now = new Date();

  var values = {
    'series' : 'opendlv',
    'year' : dateFormat(now, 'yyyy'),
    'namespaces' : ['sim'],
    'microservice' : {
      'name' : 'World',
      'type' : 'time'
    },
    'author' : { 
      'name' : 'Ola Benderius',
      'email' : 'ola.benderius@chalmers.se'
    },
    'date' : dateFormat(now, 'dd mmmm yyyy'),
    'inputs' : [
      'opendlv::coord::KinematicState'
    ],
    'outputs' : [
      {
        'stimulus'  : 'opendlv::coord::KinematicState',
        'response' : 'opendlv::coord::DynamicState'
      },
      {
        'stimulus'  : 'time',
        'response' : 'opendlv::coord::Frame'
      }
    ]
  }
  
  const stagingDir = 'tmp';

  nunjucks.configure('template', {
    autoescape: true,
    cache: false
  });

  const appName = nunjucks.renderString(
    '{{ series }}-{{ namespaces | join("-") }}-{{ microservice.name | lower }}',
    values);
  const microserviceName = nunjucks.renderString(
    '{{ microservice.name | lower }}', values);

  saveFile(values, stagingDir, '', 'CMakeLists.txt');
  saveFile(values, stagingDir, '', 'LICENSE-GPL-v2');
  saveFile(values, stagingDir, 'app', 'series-namespaces-microservice.cpp', appName + '.cpp');
  saveFile(values, stagingDir, 'include', 'microservice.hpp', microserviceName + '.hpp');
  saveFile(values, stagingDir, 'man', 'series-namespaces-microservice.1', appName + '.1');
  saveFile(values, stagingDir, 'src', 'microservice.cpp', microserviceName + '.cpp');
  saveFile(values, stagingDir, 'testsuites', 'microservicetestsuite.hpp', microserviceName + 'testsuite.hpp');

}).listen(8080); 
