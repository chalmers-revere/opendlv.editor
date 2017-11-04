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

var https = require('https');
var nodegit = require('nodegit');
var path = require('path');

exports.updateOpenDlvRepos = function(callback) {
  var username = 'chalmers-revere';

  var options = {
    host: 'api.github.com',
    path: '/users/' + username + '/repos',
    method: 'GET',
    headers: {'user-agent': 'node.js'}
  };

  var request = https.request(options, function(response) {
    var body = '';
    response.on('data', function(chunk) {
      body += chunk.toString('utf8');
    });

    response.on('end', function() {

      var repos = JSON.parse(body);

      var reposCount = repos.length;
      var updatedReposCount = 0;
      var repositories = [];

      repos.forEach(function(repo) {
        var name = repo.name;
        var url = repo.html_url;

        var cloneOptions = {};
        var localPath = path.join(__dirname, 'repo/' + name);

        var cloneRepository = nodegit.Clone(url, localPath, cloneOptions);

        var errorAndAttemptOpen = function() {
          return nodegit.Repository.open(localPath);
        };

        cloneRepository.catch(errorAndAttemptOpen).then(function(repository) {
          repositories.push([name, repository]);
          repository.fetch('origin').then(function() {
            repository.mergeBranches('master', 'master').then(function() {
              console.log('Layer ' + name + ' was updated.');
              updatedReposCount++;
              if (updatedReposCount == reposCount) {
                callback(repositories);
              }
            });
          });
        });
      });
    });
  });

  request.end();
};
