"""PSU device.

This module implements the PsuDevice class representing an individual
connection with a PSU device.
"""

import logging
import socket
import time

from odin.adapters.parameter_tree import ParameterTree
from tornado.ioloop import PeriodicCallback

from .channel import PsuChannel


class PsuDevice():
    """PsuDevice class.

    Handles local/remote modes of the device, initialises PsuChannel objects.
    """

    def __init__(self, host, port, device_num, interval):
        """Initialise PsuDevice object.

        Keyword arguements:
        host -- host address
        port -- port number
        interval -- interval at which to run background tasks

        Check model id and assign number of channels.
        """

        self.host = host
        self.port = port
        self.num = device_num
        self.interval = interval

        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        self.channels = []
        self.channel_trees = {}
        self.remote_enable = 0

        try:
            self.s.settimeout(3)
            self.s.connect((self.host, self.port))
        except OSError:
            print("Host: " + self.host)
            print("Port: " + str(self.port))
            print("Can't connect to host")
            quit()

        if "MX180TP" in self.identification():
            self.id = "MX180TP"
            self.num_of_channels = 3
        if "MX100QP" in self.identification():
            self.id = "MX100QP"
            self.num_of_channels = 4

        self.create_channels()

        self.tree = ParameterTree({
            'id': self.id,
            'host': self.host,
            'num_of_channels': self.num_of_channels,
            'channels': ParameterTree(self.channel_trees),
            'remote_enable': (lambda: self.remote_enable, self.set_remote_enable),
            'bg_task_uptime': (self.get_uptime, None),
        })

        if self.remote_enable:
            self.start_background_tasks()

    def create_channels(self):
        """Initialise PsuChannel obejcts and add to tree."""
        for channel_num in range(self.num_of_channels):
            channel = PsuChannel(self, channel_num+1)
            self.channels.append(channel)
            self.channel_trees[str(channel_num + 1)] = channel.tree

    def cleanup(self):
        """Stop background tasks."""
        self.stop_background_tasks()

    def set_remote_enable(self, remote_enable):
        """Update remote_enable in tree when it changes.

        If enabled start background tasks and add local changes to tree,
        if disabled stop background tasks and send local mode command.
        """
        remote_enable = bool(remote_enable)
        if remote_enable != self.remote_enable:
            if remote_enable:
                self.start_background_tasks()
                self.update_trees()
            else:
                self.stop_background_tasks()
                self.local()

    def start_background_tasks(self):
        """Start background tasks.

        Create periodic callback for psu commands.
        """
        logging.debug(
            "Launching background tasks with interval %.2f secs",
            self.interval
        )
        self.remote_enable = True
        self.background_task = PeriodicCallback(
            self.background_callback, self.interval * 1000
        )
        self.background_task.start()
        self.update_trees()
        self.start_time = time.time() 

    def stop_background_tasks(self):
        """Stop background tasks."""
        self.remote_enable = False
        self.background_task.stop()
        self.uptime_axis = []

    def get_uptime(self):
        """Get uptime of background tasks"""
        if self.remote_enable:
            uptime = time.time() - self.start_time 
        else:
            uptime = 0
        return uptime

    def background_callback(self):
        """Get voltage and current output readback from psu."""
        for channel in self.channels:
            voltage = channel.read_voltage()
            current = channel.read_current()
            power = channel.get_power()
            channel.voltage = voltage
            channel.current = current
            channel.power = power

    def update_trees(self):
        """Update tree values for each channel."""
        for channel in self.channels:
            channel.update_tree()

    def send(self, msg):
        """Send command to psu."""
        try:
            self.s.sendall(msg)
        except TimeoutError:
            print("Timed out")
            quit()
        except BrokenPipeError:
            print("Connection broken")
            quit()

    def receive(self):
        """Receive and decode message from psu."""
        try:
            msg = self.s.recv(1024).decode()
            return msg
        except TimeoutError:
            print("Timed out")
            quit()
        except BrokenPipeError:
            print("Connection broken")
            quit()

    def identification(self):
        """"Get identification of psu device.

        In the form <NAME>, <model>, <serial>, <version>
        <NAME> -- manufacturer's name
        <model> -- instrument type
        <serial> -- interface serial number
        <version> -- firmware version
        """
        self.send(b"*IDN?")
        id = self.receive()
        return id

    def set_routine(self):
        """Query if operation has completed.

        Must be called after sending a 'set' command.
        """
        self.send(b"*OPC?")
        self.receive()

    def local(self):
        """Set to local command mode."""
        self.send(b"LOCAL")
        self.set_routine()

    def get_num_channels(self):
        """Get number of channels."""
        return self.num_of_channels

    def get_id(self):
        """Get id."""
        return self.id
    
    def get_host(self):
        """Get host IP address"""
        return self.host
    
    def get_num(self):
        return self.num
    
    def get_channels(self):
        return self.channels
