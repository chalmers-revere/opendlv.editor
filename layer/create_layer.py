#!/usr/bin/python

import os
import shutil

from jinja2 import Environment,FileSystemLoader

layer_dir = "../tmp"

values = { 
        "name" : "opendlv.sim",
        "year" : "2017",
        "baseimage" : "opendlv-core-on-opendavinci-on-base"
        }

copy_items = { 
        "cmake.Modules",
        "scripts",
        "thirdparty",
        "usecases",
        "LICENSE",
        "VERSION"
        }

template_files = { 
        "ChangeLog",
        "CMakeLists.txt",
        "README.md",
        "docker/completeBuild.sh",
        "docker/Dockerfile.template",
        "docker/Dockerfile.template.nonDev",
        "docker/incrementalBuild.sh",
        "docker/Makefile",
        "docker/builds/.gitignore"
        }

template_folder = "template"

os.makedirs(layer_dir)

for copy_item in copy_items:

    src = template_folder + '/' + copy_item
    dst = layer_dir + '/' + copy_item

    if os.path.isfile(src):
        shutil.copy(src, dst)
    else:
        shutil.copytree(src, dst)


environment = Environment(
        loader=FileSystemLoader(template_folder)
        )

for template_file in template_files:
    
    template = environment.get_template(template_file)
    output = template.render(values)

    dst = layer_dir + '/' + template_file
    
    dir_name = os.path.dirname(dst)
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)

    with open(dst, "w") as dst_file:
        print(output, file=dst_file)
