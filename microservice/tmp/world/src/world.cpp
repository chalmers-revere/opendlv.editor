/**
* Copyright (C) 2017 Chalmers Revere
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

#include "world.hpp"

namespace opendlv {
namespace sim {

World::World(int32_t const &a_argc, char **a_argv) :
  TimeTriggeredConferenceClientModule(a_argc, a_argv, "sim-world")
{
}

World::~World()
{
}

odcore::data::dmcp::ModuleExitCodeMessage::ModuleExitCode World::body()
{
  while (getModuleStateAndWaitForRemainingTimeInTimeslice() ==
      odcore::data::dmcp::ModuleStateMessage::RUNNING) {

    opendlv::coord::Frame o2();
    Container c2(o2);
    m_conference.send(c2);
  }
  return odcore::data::dmcp::ModuleExitCodeMessage::OKAY;
}

void World::nextContainer(odcore::data::Container &a_container)
{
  if (a_container.getDataType() == opendlv::coord::KinematicState::ID()) {
    // auto kinematicState = a_container.getData<opendlv::coord::KinematicState>();

    opendlv::coord::DynamicState o1();
    Container c1(o1);
    m_conference.send(c1);
  }
}

void World::setUp()
{
  // std::string const exampleConfig = 
  //   getKeyValueConfiguration().getValue<std::string>(
  //     "sim-world.example-config");

  // if (isVerbose()) {
  //   std::cout << "Example config is " << exampleConfig << std::endl;
  // }
}

void World::tearDown()
{
}

}
}
