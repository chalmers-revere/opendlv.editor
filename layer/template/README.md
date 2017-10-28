# {{ name }}

## Building using a Docker builder:

    cd docker
    make buildComplete
    make createDockerImage

## Run the resulting Docker image:

    docker run -ti --rm --net host --user odv chalmersrevere/{{ name }}-on-{{ baseimage }}:latest /bin/bash

