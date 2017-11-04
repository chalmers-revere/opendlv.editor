#!/bin/bash

# completeBuild.sh - Script to build {{ layer }}
# Copyright (C) 2016 Christian Berger
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

BUILD_AS=$1
UID_AS=$2
PACKAGING_ENABLED=$3

# Adding user for building.
groupadd $BUILD_AS
useradd $BUILD_AS -g $BUILD_AS

cat <<EOF > /opt/{{ layer }}.build/build.sh
#!/bin/bash
export PATH=/usr/lib/ccache:$PATH
export CCACHE_DIR=/opt/ccache

cd /opt/{{ layer }}.build

echo "[Docker builder] Complete build of {{ layer }}."
cmake -E remove_directory .
CCACHE_DIR=/opt/ccache PATH=/usr/lib/ccache:/opt/od4/bin:$PATH cmake -D CXXTEST_INCLUDE_DIR=/opt/{{ layer }}.sources/thirdparty/cxxtest -D OPENDAVINCI_DIR=/opt/od4 -D PACKAGING_ENABLED=$PACKAGING_ENABLED -D ODVDOPENDLVSTANDARDMESSAGESET_DIR=/opt/opendlv.core -D CMAKE_INSTALL_PREFIX=/opt/{{ layer }} /opt/{{ layer }}.sources

CCACHE_DIR=/opt/ccache PATH=/usr/lib/ccache:/opt/od4/bin:$PATH make -j4
EOF

chmod 755 /opt/{{ layer }}.build/build.sh
chown $UID_AS:$UID_AS /opt/{{ layer }}.build/build.sh
chown -R $UID_AS:$UID_AS /opt

su -m `getent passwd $UID_AS|cut -f1 -d":"` -c /opt/{{ layer }}.build/build.sh

