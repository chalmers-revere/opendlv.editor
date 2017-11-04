/**
* Copyright (C) {{ year }} Chalmers Revere
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
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301,
* USA.
*/

#include <iostream>

#include <opendavinci/odcore/data/TimeStamp.h>
#include <opendavinci/odcore/strings/StringToolbox.h>
#include <opendavinci/odcore/wrapper/Eigen.h>

#include "{{ microservice.name | lower }}.hpp"

namespace {{ series }} {
{% for namespace in namespaces -%}
namespace {{ namespace }} {
{%- endfor %}

{{ microservice.name }}::{{ microservice.name }}(int32_t const &a_argc, char **a_argv) :
{%- if microservice.type == "time" %}
  TimeTriggeredConferenceClientModule(a_argc, a_argv, "{{ namespaces | join("-") }}-{{ microservice.name | lower }}")
{%- else %}
  DataTriggeredConferenceClientModule(a_argc, a_argv, "{{ namespaces | join("-") }}-{{ microservice.name | lower }}")
{%- endif %}
{
}

{{ microservice.name }}::~{{ microservice.name }}()
{
}

{% if microservice.type == "time" -%}
odcore::data::dmcp::ModuleExitCodeMessage::ModuleExitCode {{ microservice.name }}::body()
{
  while (getModuleStateAndWaitForRemainingTimeInTimeslice() ==
      odcore::data::dmcp::ModuleStateMessage::RUNNING) {
  {%- for output in outputs %}
    {%- if output.stimulus == "time" %}

    {{ output.response }} o{{ loop.index }}();
    Container c{{ loop.index }}(o{{ loop.index }});
    m_conference.send(c{{ loop.index }});
    {%- endif %}
  {%- endfor %}
  }
  return odcore::data::dmcp::ModuleExitCodeMessage::OKAY;
}
{%- endif %}

void {{ microservice.name }}::nextContainer(odcore::data::Container &a_container)
{
{%- for input in inputs %}
  if (a_container.getDataType() == {{ input }}::ID()) {
    // auto kinematicState = a_container.getData<opendlv::coord::KinematicState>();
  {%- for output in outputs %}
    {%- if output.stimulus == input %}

    {{ output.response }} o{{ loop.index }}();
    Container c{{ loop.index }}(o{{ loop.index }});
    m_conference.send(c{{ loop.index }});
    {%- endif %}    
  {%- endfor %}
  }
{%- endfor %}
}

void {{ microservice.name }}::setUp()
{
  // std::string const exampleConfig = 
  //   getKeyValueConfiguration().getValue<std::string>(
  //     "{{ namespaces | join("-") }}-{{ microservice.name | lower }}.example-config");

  // if (isVerbose()) {
  //   std::cout << "Example config is " << exampleConfig << std::endl;
  // }
}

void {{ microservice.name }}::tearDown()
{
}

{% for namespace in namespaces -%}
}
{%- endfor %}
}
