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

#ifndef {{ series | upper }}_{{ namespaces | join("_") | upper }}_{{ microservice.name | upper }}_HPP
#define {{ series | upper }}_{{ namespaces | join("_") | upper }}_{{ microservice.name | upper }}_HPP

{% if microservice.type == "time" -%}
#include <opendavinci/odcore/base/module/TimeTriggeredConferenceClientModule.h>
{% else -%}
#include <opendavinci/odcore/base/module/DataTriggeredConferenceClientModule.h>
{% endif -%}
#include <opendavinci/odcore/data/Container.h>

#include <odvdopendlvstandardmessageset/GeneratedHeaders_ODVDOpenDLVStandardMessageSet.h>

namespace {{ series }} {
{% for namespace in namespaces -%}
namespace {{ namespace }} {
{% endfor -%}
{% if microservice.type == "time" %}
class {{ microservice.name }} : public odcore::base::module::TimeTriggeredConferenceClientModule {
{%- else %}
class {{ microservice.name }} : public odcore::base::module::DataTriggeredConferenceClientModule {
{%- endif %}
 public:
  {{ microservice.name }}(int32_t const &, char **);
  {{ microservice.name }}({{ microservice.name }} const &) = delete;
  {{ microservice.name }} &operator=({{ microservice.name }} const &) = delete;
  virtual ~{{ microservice.name }}();
  virtual void nextContainer(odcore::data::Container &);

 private:
{%- if microservice.type == "time" %}
  odcore::data::dmcp::ModuleExitCodeMessage::ModuleExitCode body();
{%- endif %}
  void setUp();
  void tearDown();
};

{% for namespace in namespaces -%}
}
{% endfor -%}
}

#endif
