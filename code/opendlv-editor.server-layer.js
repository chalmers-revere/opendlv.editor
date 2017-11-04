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
var nodegit = require('nodegit');

var opendlvrepo = require('./opendlv-editor.server-repo');
var opendlvtemplate = require('./opendlv-editor.server-template');

exports.getLayers = function(callback) {

  allReposAreUpToDate = function(repos) {
    console.log('All repos are up to date.');

    var repoCount = repos.length;
    var parsedRepoCount = 0;
    var layers = [];

    repos.forEach(function(repo) {
      var name = repo[0];
      var repoPath = repo[1].path();

      var makefile = repoPath + '../docker/Makefile';
      if (fs.existsSync(makefile)) {

        fs.readFile(makefile, function(err, data) {
          if (err) {
            parsedRepoCount++;
            throw err;
          }

          var needles = {
            'REPOSITORY=' : '',
            'IMAGE=' : '',
            'BASE_IMAGE_VERSION=' : '', 
            'PRODUCT=' : ''
          };

          var needleCount = Object.keys(needles).length;
          var needlesFound = 0;

          var array = data.toString().split("\n");
          for (var i in array) {
            var line = array[i];
            
            for (var needle in needles) {

              if (!needles[needle]) {

                var j = line.indexOf(needle);
                if (j == 0) {
                  var value = line.substr(needle.length);
                  needles[needle] = value;
                  needlesFound++;
                }
              }
            }
            if (needlesFound == needleCount) {
              break;
            }
          }

          if (needlesFound == needleCount) {
            var image = needles['PRODUCT='] + needles['IMAGE='];
            var baseImage = needles['REPOSITORY='] + '/' + needles['IMAGE='];
            var baseImageVersion = needles['BASE_IMAGE_VERSION='];

            var versionfile = repoPath + '../VERSION';
            if (fs.existsSync(versionfile)) {
              fs.readFile(versionfile, function(err, data) {
                if (err) {
                  parsedRepoCount++;
                  throw err;
                }

                var version = data.toString().trim();

                parsedRepoCount++;

                var layer = {
                 'name' : name,
                 'image' : image,
                 'version' : version,
                 'base_image' : baseImage,
                 'base_image_version' : baseImageVersion
                };
                layers.push(layer);

                if (parsedRepoCount == repoCount) {
                  var output = {'layers' : layers};
                  var outputJson = JSON.stringify(output);
                  callback(outputJson);
                }
              });
            } else {
              parsedRepoCount++;
            }
          } else {
            parsedRepoCount++;
          }
        });
      } else {
        parsedRepoCount++;
      }
    });
  };
  
  opendlvrepo.updateOpenDlvRepos(allReposAreUpToDate);
}

exports.create = function(callback, layer) 
{
  const templateDir = 'template/layer';
//  const outputDir = 'repo/' + layer.layer;
  const outputDir = 'staging/' + layer.layer;

  const values = {
    'series' : layer.open ? 'opendlv' : 'dlv',
    'name' : layer.name,
    'year' : layer.year,
    'baseimage' : {
      'name' : layer.baseimage.name,
      'version' : layer.baseimage.version
    }
  };

  opendlvtemplate.begin(templateDir, outputDir, values);

  opendlvtemplate.saveFolder('cmake.Modules');
  opendlvtemplate.saveFolder('scripts');
  opendlvtemplate.saveFolder('thirdparty');
  opendlvtemplate.saveFolder('usecases');

  opendlvtemplate.saveRootFile('.clang-format');
  opendlvtemplate.saveRootFile('.gitignore');
  opendlvtemplate.saveRootFile('LICENSE');
  opendlvtemplate.saveRootFile('VERSION');
  opendlvtemplate.saveRootFile('ChangeLog');
  opendlvtemplate.saveRootFile('CMakeLists.txt');
  opendlvtemplate.saveRootFile('README.md');

  opendlvtemplate.saveFile('docker', 'completeBuild.sh');
  opendlvtemplate.saveFile('docker', 'Dockerfile.template');
  opendlvtemplate.saveFile('docker', 'Dockerfile.template.nonDev');
  opendlvtemplate.saveFile('docker', 'incrementalBuild.sh');
  opendlvtemplate.saveFile('docker', 'Makefile');
  opendlvtemplate.saveFile('docker/builds', '.gitignore');

  opendlvtemplate.end();
  
  var output = {
    'Status' : 'OK'
  };
  var outputJson = JSON.stringify(output);
  callback(outputJson);
}
