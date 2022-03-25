/*
 * The text input is provided from doing the following command inside a ROS 2
 * workspace from source
 * ```bash
 * vcs log src --limit-untagged -s -l 1 | grep '^==='
 * ```
 *
 * The full setup process and command is as follows:
 * ```bash
 * mkdir -p ws/src
 * cd ws
 * wget https://raw.githubusercontent.com/ros2/ros2/master/ros2.repos
 * vcs import src < ros2.repos
 * vcs log src --limit-untagged -s -l 1 | grep '^==='
 * ```
 */

// TODO pipe into this file for input
const text = `
=== src/ament/ament_cmake (git) ===
=== src/ament/ament_lint (git) ===
=== src/ament/google_benchmark_vendor (git) ===
=== src/ament/uncrustify_vendor (git) ===
=== src/eProsima/Fast-DDS (git) ===
=== src/eclipse-iceoryx/iceoryx (git) ===
=== src/ignition/ignition_cmake2_vendor (git) ===
=== src/ignition/ignition_math6_vendor (git) ===
=== src/ros-perception/image_common (git) ===
=== src/ros-tooling/keyboard_handler (git) ===
=== src/ros-tooling/libstatistics_collector (git) ===
=== src/ros-tracing/ros2_tracing (git) ===
=== src/ros-visualization/rqt_console (git) ===
=== src/ros-visualization/rqt_msg (git) ===
=== src/ros-visualization/rqt_topic (git) ===
=== src/ros-visualization/tango_icons_vendor (git) ===
=== src/ros/robot_state_publisher (git) ===
=== src/ros/urdfdom (git) ===
=== src/ros/urdfdom_headers (git) ===
=== src/ros2/common_interfaces (git) ===
=== src/ros2/console_bridge_vendor (git) ===
=== src/ros2/example_interfaces (git) ===
=== src/ros2/geometry2 (git) ===
=== src/ros2/launch (git) ===
=== src/ros2/launch_ros (git) ===
=== src/ros2/libyaml_vendor (git) ===
=== src/ros2/message_filters (git) ===
=== src/ros2/mimick_vendor (git) ===
=== src/ros2/orocos_kinematics_dynamics (git) ===
=== src/ros2/pybind11_vendor (git) ===
=== src/ros2/rcl (git) ===
=== src/ros2/rclcpp (git) ===
=== src/ros2/rclpy (git) ===
=== src/ros2/rmw (git) ===
=== src/ros2/rmw_connextdds (git) ===
=== src/ros2/rmw_cyclonedds (git) ===
=== src/ros2/rmw_dds_common (git) ===
=== src/ros2/rmw_fastrtps (git) ===
=== src/ros2/rmw_implementation (git) ===
=== src/ros2/ros1_bridge (git) ===
=== src/ros2/ros2cli (git) ===
=== src/ros2/rosbag2 (git) ===
=== src/ros2/rosidl (git) ===
=== src/ros2/rosidl_dds (git) ===
=== src/ros2/rosidl_runtime_py (git) ===
=== src/ros2/rosidl_typesupport (git) ===
=== src/ros2/rviz (git) ===
=== src/ros2/system_tests (git) ===
=== src/ros2/test_interface_files (git) ===
=== src/ros2/tinyxml2_vendor (git) ===
=== src/ros2/tinyxml_vendor (git) ===
`;

export function getRepoUrls(text: string) {
  return text
    .split("\n")
    .map(getRepoUrl)
    .filter((l) => l.length > 0)
    .join("\n");
}

export function getRepoUrl(line: string) {
  const repoAndOwner = getOwnerAndRepo(line);
  if (repoAndOwner.length === 0) {
    return "";
  }
  return `https://github.com/${repoAndOwner}`;
}

export function getOwnerAndRepos(text: string) {
  return text
    .split("\n")
    .map(getOwnerAndRepo)
    .filter((l) => l.length > 0)
    .join("\n");
}

export function getOwnerAndRepo(line: string) {
  const match = line.match(/^=== src\/(.*) \(git\) ===$/);
  return match ? match[1] : line;
}

console.log(
  getRepoUrls(text),
);
