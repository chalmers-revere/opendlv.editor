#!/usr/bin/python

import os
import shutil

from jinja2 import Environment,FileSystemLoader

namespaces = ['sim', 'gui']

values = { 
        "name" : "opendlv.sim",
        "year" : "2017",
        "namespaces" : namespaces,
        "baseimage" : "opendlv-core-on-opendavinci-on-base"
        }

output_folder = "tmp"

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

namespace_src = "code/_NAMESPACE_/"
namespace_dst = "code"

namespace_template_files = {
        "CMakeLists.txt"
        }

template_folder = "template"

os.makedirs(output_folder)

for copy_item in copy_items:

    src = template_folder + '/' + copy_item
    dst = output_folder + '/' + copy_item

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

    dst = output_folder + '/' + template_file
    
    dir_name = os.path.dirname(dst)
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)

    with open(dst, "w") as dst_file:
        print(output, file=dst_file)

for namespace in namespaces:

    namespace_dir = output_folder + '/' + namespace_dst + '/' + namespace
    os.makedirs(namespace_dir)

    for template_file in namespace_template_files:
    
        template = environment.get_template(namespace_src + '/' + template_file)
        output = template.render(values)

        dst = namespace_dir + '/' + template_file
    
        dir_name = os.path.dirname(dst)
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)

        with open(dst, "w") as dst_file:
            print(output, file=dst_file)

