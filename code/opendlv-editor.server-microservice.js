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

var nunjucks = require('nunjucks');
var dateFormat = require('dateformat');
var fs = require('fs');

function generateMicroservice(values, stagingDir) {
  const appName = nunjucks.renderString(
    '{{ series }}-{{ namespaces | join("-") }}-{{ microservice.name | lower }}',
    values);
  const microserviceName = nunjucks.renderString(
    '{{ microservice.name | lower }}', values);

  saveFile(values, stagingDir, '', 'CMakeLists.txt');
  saveFile(values, stagingDir, '', 'LICENSE-GPL-v2');
  saveFile(values, stagingDir, 'app', 'series-namespaces-microservice.cpp',
    appName + '.cpp');
  saveFile(values, stagingDir, 'include', 'microservice.hpp', 
    microserviceName + '.hpp');
  saveFile(values, stagingDir, 'man', 'series-namespaces-microservice.1', 
    appName + '.1');
  saveFile(values, stagingDir, 'src', 'microservice.cpp', 
    microserviceName + '.cpp');
  saveFile(values, stagingDir, 'testsuites', 'microservicetestsuite.hpp',
    microserviceName + 'testsuite.hpp');
}

function saveFile(values, stagingDir, path, templateName, outputName) {

  if (path == '') {
    path = '.';
  }

  if (outputName == undefined) {
    outputName = templateName;
  }

  const res = nunjucks.render(path + '/' + templateName, values);

  const microservicePath = nunjucks.renderString(
    '{{ namespaces | join("/") }}/{{ microservice.name | lower }}', values);
  const fullPath = stagingDir + '/' + microservicePath + '/' + path;
  const filename = fullPath + '/' + outputName;

  mkdirp.sync(fullPath);
  fs.writeFileSync(filename, res);
}


exports.addCfsd18Microservice = function() 
{

  var now = new Date();

  var microservices = [
    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'perception'],
      'microservice' : {
        'name' : 'Attention',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'odcore::data::CompactPointCloud'
      ],
      'outputs' : [
        {
          'stimulus'  : 'odcore::data::CompactPointCloud',
          'response' : 'opendlv::logic::perception::Attention'
        }
      ]
    },

    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'perception'],
      'microservice' : {
        'name' : 'DetectCone',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'opendlv::logic::perception::Attention'
      ],
      'outputs' : [
        {
          'stimulus'  : 'opendlv::logic::perception::Attention',
          'response' : 'opendlv::logic::perception::Object'
        }
      ]
    },

    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'perception'],
      'microservice' : {
        'name' : 'DetectConeLane',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'opendlv::logic::perception::Object'
      ],
      'outputs' : [
        {
          'stimulus'  : 'opendlv::logic::perception::Object',
          'response' : 'opendlv::logic::perception::Surface'
        }
      ]
    },

    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'perception'],
      'microservice' : {
        'name' : 'Slam',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'opendlv::logic::perception::Object',
        'opendlv::logic::perception::Geolocation'
      ],
      'outputs' : [
        {
          'stimulus'  : 'opendlv::logic::perception::Geolocation',
          'response' : 'opendlv::logic::perception::Object'
        }
      ]
    },
    
    
    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'knowledge'],
      'microservice' : {
        'name' : 'Acceleration',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'opendlv::logic::perception::Surface',
        'opendlv::system::SignalStatusMessage',
        'opendlv::system::SystemState',
        'opendlv::system::NetworkStatusMessage'
      ],
      'outputs' : [
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::AimPoint'
        },
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::PreviewPoint'
        },
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::GroundSpeedLimit'
        }
      ]
    },
    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'knowledge'],
      'microservice' : {
        'name' : 'Brake',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'opendlv::logic::perception::Surface',
        'opendlv::system::SignalStatusMessage',
        'opendlv::system::SystemState',
        'opendlv::system::NetworkStatusMessage'
      ],
      'outputs' : [
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::AimPoint'
        },
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::PreviewPoint'
        },
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::GroundSpeedLimit'
        }
      ]
    },
    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'knowledge'],
      'microservice' : {
        'name' : 'Skidpad',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'opendlv::logic::perception::Surface',
        'opendlv::system::SignalStatusMessage',
        'opendlv::system::SystemState',
        'opendlv::system::NetworkStatusMessage'
      ],
      'outputs' : [
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::AimPoint'
        },
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::PreviewPoint'
        },
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::GroundSpeedLimit'
        }
      ]
    },
    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'knowledge'],
      'microservice' : {
        'name' : 'Track',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'opendlv::logic::perception::Surface',
        'opendlv::system::SignalStatusMessage',
        'opendlv::system::SystemState',
        'opendlv::system::NetworkStatusMessage'
      ],
      'outputs' : [
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::AimPoint'
        },
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::PreviewPoint'
        },
        {
          'stimulus'  : 'opendlv::logic::perception::Surface',
          'response' : 'opendlv::logic::action::GroundSpeedLimit'
        }
      ]
    },


    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'knowledge'],
      'microservice' : {
        'name' : 'LimitLateral',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'opendlv::proxy::GroundSpeedReading'
      ],
      'outputs' : [
        {
          'stimulus'  : 'opendlv::proxy::GroundSpeedReading',
          'response' : 'opendlv::logic::action::GroundSteeringLimit'
        }
      ]
    },

    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'action'],
      'microservice' : {
        'name' : 'Lateral',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'opendlv::logic::action::GroundSteeringLimit',
        'opendlv::logic::action::AimPoint'

      ],
      'outputs' : [
        {
          'stimulus'  : 'opendlv::logic::action::AimPoint',
          'response' : 'opendlv::proxy::GroundSteeringRequest'
        }
      ]
    },
    
    {
      'series' : 'opendlv',
      'year' : dateFormat(now, 'yyyy'),
      'namespaces' : ['logic', 'cfsd18', 'action'],
      'microservice' : {
        'name' : 'Longitudinal',
        'type' : 'data'
      },
      'author' : { 
        'name' : 'Ola Benderius',
        'email' : 'ola.benderius@chalmers.se'
      },
      'date' : dateFormat(now, 'dd mmmm yyyy'),
      'inputs' : [
        'opendlv::logic::action::PreviewPoint',
        'opendlv::logic::action::GroundSpeedLimit',
        'opendlv::logic::action::AimPoint'

      ],
      'outputs' : [
        {
          'stimulus'  : 'opendlv::logic::action::AimPoint',
          'response' : 'opendlv::proxy::GroundAccelerationRequest'
        },
        {
          'stimulus'  : 'opendlv::logic::action::AimPoint',
          'response' : 'opendlv::proxy::GroundDecelerationRequest'
        }
      ]
    }


  ]
  
  const stagingDir = 'tmp';

  nunjucks.configure('template', {
    autoescape: true,
    cache: false
  });

  for (i = 0; i < microservices.length; i++) {
    const microservice = microservices[i];
    generateMicroservice(microservice, stagingDir);
  }

} 
