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
