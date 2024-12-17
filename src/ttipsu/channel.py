"""PSU channel.

This module implements the PsuChannel class representing an output channel
belonging to a PSU device.
"""

from odin.adapters.parameter_tree import ParameterTree

class PsuChannel:
    """PsuChannel class.

    Handles channel-specific commands.
    """

    def __init__(self, psu, channel_num):
        """Initialise PsuChannel object.

        Keyword arguements:
        psu -- PsuClient object
        channel_num -- which numbered channel
        """

        self.num = channel_num
        self.psu = psu

        self.status = self.get_onoff_status()

        self.voltage = 0
        self.current = 0
        self.power = 0

        self.set_voltage = self.read_set_voltage()
        self.set_current = self.read_set_current()
        
        voltage_tree = ParameterTree({
            'setting': (lambda: self.set_voltage, self.set_new_voltage),
            'output': (lambda: self.voltage, None),
        })

        current_tree = ParameterTree({
            'setting': (lambda: self.set_current, self.set_new_current),
            'output': (lambda: self.current, None),
        })

        power_tree = ParameterTree({
            'output': (lambda: self.power, None),
        })

        self.tree = ParameterTree({
            'status': (lambda: self.status, self.set_status),
            'voltage': voltage_tree,
            'current': current_tree,
            'power': power_tree
        })

    def set_status(self, status):
        """Update status in tree when it changes.

        Send command to set on/off.
        """
        if self.status != status:
            self.status = status
            if status:
                self.set_on()
            else:
                self.set_off()

    def set_new_voltage(self, voltage):
        """Update voltage.setting in tree when it changes.

        Send command to set new voltage.
        """
        if self.set_voltage != voltage:
            self.set_voltage = voltage
            self.psu.send(("V" + str(self.num) + " " + str(voltage)).encode('utf-8'))
            self.psu.set_routine()

    def set_new_current(self, current):
        """Update current.setting in tree when it changes.

        Send command to set new current.
        """
        if self.set_current != current:
            self.set_current = current
            self.psu.send(("I" + str(self.num)+ " " + str(current)).encode('utf-8'))
            self.psu.set_routine()

    def update_tree(self):
        """Update tree values from psu commands."""
        self.status = self.get_onoff_status()
        self.set_voltage = self.read_set_voltage()
        self.set_current = self.read_set_current()

    def read_voltage(self):
        """Get voltage readback from psu."""
        self.psu.send(("V" + str(self.num) + "O?").encode('utf-8'))
        voltage = float(self.psu.receive().strip()[:-1])
        return voltage

    def read_current(self):
        """Get current readback from psu."""
        self.psu.send(("I" + str(self.num) + "O?").encode('utf-8'))
        current = float(self.psu.receive().strip()[:-1])
        return current
    
    def get_power(self):
        power = self.read_voltage() * self.read_current()
        return power

    def get_name(self):
        """Create channel name from number."""
        return ("Channel " + str(self.num))

    def get_onoff_status(self):
        """Get output status of channel."""
        self.psu.send(("OP" + str(self.num) + "?").encode('utf-8'))
        status = int(self.psu.receive().strip())
        if status == 1:
            status_bool = True
        else:
            status_bool = False
        return status_bool

    def set_on(self):
        """Set channel output on."""
        self.psu.send(("OP" + str(self.num) + " 1").encode('utf-8'))
        self.psu.set_routine()

    def set_off(self):
        """Set channel output off."""
        self.psu.send(("OP" + str(self.num) + " 0").encode('utf-8'))
        self.psu.set_routine()

    def read_set_voltage(self):
        """Get voltage setting of channel."""
        self.psu.send(("V" + str(self.num) + "?").encode('utf-8'))
        set_voltage = float((self.psu.receive().strip()[3:])[:-1])
        return set_voltage

    def read_set_current(self):
        """Get current limit setting of channel."""
        self.psu.send(("I" + str(self.num) + "?").encode('utf-8'))
        set_current = float((self.psu.receive().strip()[3:])[:-1])
        return set_current
