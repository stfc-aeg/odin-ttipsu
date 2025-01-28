"""PSU controller.

This module implements the PsuController class which manages PSU device connections.

Also implements the PsuError class.
"""

import logging

from odin.adapters.parameter_tree import ParameterTree, ParameterTreeError

from .device import PsuDevice


class PsuError(Exception):
    """Simple exception class to wrap lower-level exceptions."""
    pass

class PsuController():
    """PsuController class."""

    def __init__(self, background_task_interval, connections, graph_adapter):
        """Initialise PsuController object.

        Create PsuDevice objects and parameter trees
        """
        self.background_task_interval = background_task_interval

        self.connections = connections

        self.graph_adapter = graph_adapter
        self.plot_names = []

        self.devices = []
        self.device_trees = {}

        for i in range(len(self.connections)):
            connection = self.connections[i].split(":")
            host = connection[0]
            port = int(connection[1])
            device_num = str(i + 1)
            device = PsuDevice(host, port, device_num, self.background_task_interval)
            self.devices.append(device)
            self.device_trees[device_num] = device.tree

        bg_task = ParameterTree({
            'interval': (lambda: self.background_task_interval, self.set_task_interval),
        })

        self.param_tree = ParameterTree({
            'background_task': bg_task,
            'connections': self.connections,
            'devices': ParameterTree(self.device_trees),
            'plots': (lambda: self.plot_names, None)
        })

        self.load_graphs()

    def get(self, path):
        """Get the parameter tree."""
        return self.param_tree.get(path)

    def set(self, path, data):
        """Set parameters in the parameter tree."""
        try:
            self.param_tree.set(path, data)
        except ParameterTreeError as e:
            raise PsuError(e)

    def set_task_interval(self, interval):
        """Set background task interval."""
        logging.debug("Setting background task interval to %f", interval)
        self.background_task_interval = float(interval)

    def load_graphs(self):
        """Create datasets in graphing adapter."""
        for device in self.devices:
            channel_names = []
            for channel in device.get_channels():
                voltage_name = "device" + str(device.num) + "_channel" + str(channel.num) + "_voltage"
                current_name = "device" + str(device.num) + "_channel" + str(channel.num) + "_current"
                power_name = "device" + str(device.num) + "_channel" + str(channel.num) + "_power"

                self.graph_adapter.add_dataset("ttipsu", ("devices/" + str(device.num) + "/channels/" + str(channel.num) + "/voltage/output"), 1, 60, ("1min/device" + str(device.num) + "/channel" + str(channel.num) + "/voltage"))
                self.graph_adapter.add_dataset("ttipsu", ("devices/" + str(device.num) + "/channels/" + str(channel.num) + "/current/output"), 1, 60, ("1min/device" + str(device.num) + "/channel" + str(channel.num) + "/current"))
                self.graph_adapter.add_dataset("ttipsu", ("devices/" + str(device.num) + "/channels/" + str(channel.num) + "/power/output"), 1, 60, ("1min/device" + str(device.num) + "/channel" + str(channel.num) + "/power"))

                self.graph_adapter.add_avg_dataset(5, 60, ("1min/device" + str(device.num) + "/channel" + str(channel.num) + "/voltage"), ("5mins/device" + str(device.num) + "/channel" + str(channel.num) + "/voltage"))
                self.graph_adapter.add_avg_dataset(5, 60, ("1min/device" + str(device.num) + "/channel" + str(channel.num) + "/current"), ("5mins/device" + str(device.num) + "/channel" + str(channel.num) + "/current"))
                self.graph_adapter.add_avg_dataset(5, 60, ("1min/device" + str(device.num) + "/channel" + str(channel.num) + "/power"), ("5mins/device" + str(device.num) + "/channel" + str(channel.num) + "/power"))

                self.graph_adapter.add_avg_dataset(60, 1440, ("1min/device" + str(device.num) + "/channel" + str(channel.num) + "/voltage"), ("24hr/device" + str(device.num) + "/channel" + str(channel.num) + "/voltage"))
                self.graph_adapter.add_avg_dataset(60, 1440, ("1min/device" + str(device.num) + "/channel" + str(channel.num) + "/current"), ("24hr/device" + str(device.num) + "/channel" + str(channel.num) + "/current"))
                self.graph_adapter.add_avg_dataset(60, 1440, ("1min/device" + str(device.num) + "/channel" + str(channel.num) + "/power"), ("24hr/device" + str(device.num) + "/channel" + str(channel.num) + "/power"))

                self.graph_adapter.initialize_tree()
                