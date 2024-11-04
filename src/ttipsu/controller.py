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

    def __init__(self, background_task_interval, connections):
        """Initialise PsuController object.

        Create PsuDevice objects and parameter trees
        """
        self.background_task_interval = background_task_interval

        self.connections = connections

        self.devices = []
        self.device_trees = {}

        for i in range(len(self.connections)):
            connection = self.connections[i].split(":")
            host = connection[0]
            port = int(connection[1])
            device = PsuDevice(host, port, self.background_task_interval)
            self.devices.append(device)
            self.device_trees[str(i + 1)] = device.tree

        bg_task = ParameterTree({
            'interval': (lambda: self.background_task_interval, self.set_task_interval),
        })

        self.param_tree = ParameterTree({
            'background_task': bg_task,
            'connections': self.connections,
            'devices': ParameterTree(self.device_trees)
        })

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
