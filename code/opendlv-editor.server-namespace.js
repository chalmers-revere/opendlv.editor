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
var opendlvtemplate = require('./opendlv-editor.server-template');

exports.add = function(callback, namespace) 
{
  const templateDir = 'template/layer';
  const outputDir = 'repo/' + layer.layer;
  opendlvtemplate.begin(templateDir, outputDir, layer);



  opendlvtemplate.end();
  
  var output = {
    'Status' : 'OK'
  };
  var outputJson = JSON.stringify(output);
  callback(outputJson);
}



/*
#!/usr/bin/python

import fileinput
import os
import shutil

from jinja2 import Environment,FileSystemLoader

layer_dir = '../tmp'

namespace = 'sim'

values = {
        "series" : "opendlv",
        "layer" : "sim",
        "year" : "2017",
        "namespace" : namespace
        }

snippet_files = {
        "CMakeLists.txt.snippet" : "CMakeLists.txt",
        "incrementalBuild.sh.snippet" : "docker/incrementalBuild.sh"
        }

template_files = {
        "CMakeLists.txt"
        }

snippet_folder = "snippet"
template_folder = "template"
namespace_dst = "code"

environment = Environment(
        loader=FileSystemLoader(snippet_folder)
        )

for snippet_file, dst_file in snippet_files.items():

    dst = layer_dir + '/' + dst_file

    template = environment.get_template(snippet_file)
    output = template.render(values)
    
    for line in fileinput.FileInput(dst, inplace=1):
        if "### NAMESPACE BEGIN ###" in line:
            line = line.replace(line, line + '\n\n' + output)
        print(line, end='')


namespace_dir = layer_dir + '/' + namespace_dst + '/' + namespace
os.makedirs(namespace_dir)

environment = Environment(
        loader=FileSystemLoader(template_folder)
        )

for template_file in template_files:
    
    template = environment.get_template(template_file)
    output = template.render(values)

    dst = namespace_dir + '/' + template_file
    
    with open(dst, "w") as dst_file:
        print(output, file=dst_file)

*/
