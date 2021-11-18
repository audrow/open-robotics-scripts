import { Maintainer, Person } from "../../config/types.ts";

export const MAINTAINERS: Maintainer[] = [
  {
    id: "foo",
    name: "Foo Bar",
    email: "foo@fake.org",
  },
  {
    id: "bar",
    name: "Bar Baz",
    email: "bar@fake.org",
  },
  {
    id: "baz",
    name: "Baz Foo",
    email: "baz@fake.org",
  },
];

export const MAINTAINERS_READ: Person[] = MAINTAINERS.map((m) => ({
  name: m.name,
  email: m.email,
}));

export const PACKAGE_XML = `<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format2.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="2">
  <name>ros2run</name>
  <version>0.14.0</version>
  <description>
    The run command for ROS 2 command line tools.
  </description>

  <maintainer email="faux@fake.org">Faux Name</maintainer>
  <maintainer email="foo@fake.org">Foo Bar</maintainer>
  <license>Apache License 2.0</license>

  <author>Foo Bar</author>

  <author email="faux@fake.org">Faux Name</author>
  <author>Foo2 Bar</author>

  <depend>ros2cli</depend>

  <exec_depend>ros2pkg</exec_depend>

  <test_depend>ament_copyright</test_depend>
  <test_depend>ament_flake8</test_depend>
  <test_depend>ament_pep257</test_depend>
  <test_depend>ament_xmllint</test_depend>
  <test_depend>python3-pytest</test_depend>

  <export>
    <build_type>ament_python</build_type>
  </export>
</package>`;

export const PACKAGE_XML_MODIFIED = `<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format2.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="2">
  <name>ros2run</name>
  <version>0.14.0</version>
  <description>
    The run command for ROS 2 command line tools.
  </description>

  <maintainer email="foo@fake.org">Foo Bar</maintainer>
  <maintainer email="bar@fake.org">Bar Baz</maintainer>
  <maintainer email="baz@fake.org">Baz Foo</maintainer>

  <license>Apache License 2.0</license>

  <author email="faux@fake.org">Faux Name</author>
  <author>Foo Bar</author>
  <author>Foo2 Bar</author>

  <depend>ros2cli</depend>

  <exec_depend>ros2pkg</exec_depend>

  <test_depend>ament_copyright</test_depend>
  <test_depend>ament_flake8</test_depend>
  <test_depend>ament_pep257</test_depend>
  <test_depend>ament_xmllint</test_depend>
  <test_depend>python3-pytest</test_depend>

  <export>
    <build_type>ament_python</build_type>
  </export>
</package>`;

export const PACKAGE_XML_NO_MAINTAINERS = `<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format2.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="2">
  <name>ros2run</name>
  <version>0.14.0</version>
  <description>
    The run command for ROS 2 command line tools.
  </description>
  <license>Apache License 2.0</license>

  <author email="dthomas@osrfoundation.org">Dirk Thomas</author>

  <depend>ros2cli</depend>

  <exec_depend>ros2pkg</exec_depend>

  <test_depend>ament_copyright</test_depend>
  <test_depend>ament_flake8</test_depend>
  <test_depend>ament_pep257</test_depend>
  <test_depend>ament_xmllint</test_depend>
  <test_depend>python3-pytest</test_depend>

  <export>
    <build_type>ament_python</build_type>
  </export>
</package>`;

export const SETUP_PY = `from setuptools import find_packages
from setuptools import setup

package_name = 'ros2run'

setup(
    name=package_name,
    version='0.14.0',
    packages=find_packages(exclude=['test']),
    data_files=[
        ('share/' + package_name, ['package.xml']),
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
    ],
    install_requires=['ros2cli'],
    zip_safe=True,
    author='Dirk Thomas',
    author_email='dthomas@osrfoundation.org',
    maintainer='Claire Wang, Mabel Zhang',
    maintainer_email='clairewang@openrobotics.org, mabel@openrobotics.org',
    url='https://github.com/ros2/ros2cli/tree/master/ros2run',
    download_url='https://github.com/ros2/ros2cli/releases',
    keywords=[],
    classifiers=[
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python',
    ],
    description='The run command for ROS 2 command line tools.',
    long_description="""\
The package provides the run command for the ROS 2 command line tools.""",
    license='Apache License, Version 2.0',
    tests_require=['pytest'],
    entry_points={
        'ros2cli.command': [
            'run = ros2run.command.run:RunCommand',
        ],
    }
)`;

export const SETUP_PY_MODIFIED = `from setuptools import find_packages
from setuptools import setup

package_name = 'ros2run'

setup(
    name=package_name,
    version='0.14.0',
    packages=find_packages(exclude=['test']),
    data_files=[
        ('share/' + package_name, ['package.xml']),
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
    ],
    install_requires=['ros2cli'],
    zip_safe=True,
    author='Dirk Thomas',
    author_email='dthomas@osrfoundation.org',
    maintainer='Foo Bar, Bar Baz, Baz Foo',
    maintainer_email='foo@fake.org, bar@fake.org, baz@fake.org',
    url='https://github.com/ros2/ros2cli/tree/master/ros2run',
    download_url='https://github.com/ros2/ros2cli/releases',
    keywords=[],
    classifiers=[
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python',
    ],
    description='The run command for ROS 2 command line tools.',
    long_description="""\
The package provides the run command for the ROS 2 command line tools.""",
    license='Apache License, Version 2.0',
    tests_require=['pytest'],
    entry_points={
        'ros2cli.command': [
            'run = ros2run.command.run:RunCommand',
        ],
    }
)`;

export const SETUP_PY_NO_MAINTAINERS = `from setuptools import find_packages
from setuptools import setup

package_name = 'ros2run'

setup(
    name=package_name,
    version='0.14.0',
    packages=find_packages(exclude=['test']),
    data_files=[
        ('share/' + package_name, ['package.xml']),
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
    ],
    install_requires=['ros2cli'],
    zip_safe=True,
    author='Dirk Thomas',
    author_email='dthomas@osrfoundation.org',
    url='https://github.com/ros2/ros2cli/tree/master/ros2run',
    download_url='https://github.com/ros2/ros2cli/releases',
    keywords=[],
    classifiers=[
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python',
    ],
    description='The run command for ROS 2 command line tools.',
    long_description="""\
The package provides the run command for the ROS 2 command line tools.""",
    license='Apache License, Version 2.0',
    tests_require=['pytest'],
    entry_points={
        'ros2cli.command': [
            'run = ros2run.command.run:RunCommand',
        ],
    }
)`;
