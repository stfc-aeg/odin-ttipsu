"""
Graphing Adapter for Odin Control.
Implements means of monitoring a stream of data, with specified time intervals.
this is done so that GUI elements (such as using chart.js) can be easily implemented

Ashley Neaves, STFC Detector Systems Software Group"""

import logging

from odin.adapters.adapter import (ApiAdapter, ApiAdapterRequest,
                                   ApiAdapterResponse, request_types, response_types)
from odin.util import decode_request_body
from odin.adapters.parameter_tree import ParameterTree, ParameterTreeError
from tornado.ioloop import PeriodicCallback, IOLoop
import time
import json


class GraphDataset():

    def __init__(self, time_interval, adapter, get_path, retention, name=None):
        self.time_interval = time_interval
        self.data = []
        self.timestamps = []
        self.adapter_name = adapter
        self.adapter = None
        self.get_path = get_path
        self.retention = retention
        self.name = name

        self.max = max(self.data, default=0)
        self.min = min(self.data, default=0)

        self.data_loop = PeriodicCallback(self.get_data, self.time_interval * 1000)

        logging.debug("Created Dataset %s, interval of %f seconds", name, self.time_interval)

        self.param_tree = ParameterTree({
            "name": (self.name, None),
            "data": (lambda: self.data, None),
            "timestamps": (lambda: self.timestamps, None),
            "interval": (self.time_interval, None),
            "retention": (self.retention * self.time_interval, None),
            "loop_running": (lambda: self.data_loop.is_running(), None),
            "max": (lambda: self.max, None),
            "min": (lambda: self.min, None)
        })

    def get_data(self):
        cur_time = time.strftime("%H:%M:%S", time.localtime())
        response = self.adapter.get(self.get_path, ApiAdapterRequest(None))
        data = response.data[self.get_path.split("/")[-1]]

        self.data.append(data)
        self.timestamps.append(cur_time)
        if len(self.data) > self.retention:
            self.data.pop(0)
            self.timestamps.pop(0)

        self.max = max(self.data)
        self.min = min(self.data)

    def get_adapter(self, adapter_list):
        self.adapter = adapter_list[self.adapter_name]

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True)


class AvgGraphDataset(GraphDataset):
    
    def __init__(self, time_interval, retention, name, source):
        super().__init__(time_interval, adapter=None, get_path=None, retention=retention, name=name)
        
        self.source = source
        self.num_points_get = int(self.time_interval / self.source.time_interval)

        self.min_list = []
        self.max_list = []

        logging.debug("This is an averaging dataset, averaging from %s", self.source)

    def get_data(self):
        cur_time = time.strftime("%H:%M:%S", time.localtime())
        data = self.source.data[-self.num_points_get:]  # slice, get last x elements

        data_min = min(data)
        data_max = max(data)

        # data = list(zip(*data))[1]  # zip the timestamps and data of target list into separate
        data = data = sum(data) / len(data)

        self.min_list.append(data_min)
        self.max_list.append(data_max)

        self.data.append(data)
        self.timestamps.append(cur_time)

        if len(self.data) > self.retention:
            self.data.pop(0)
            self.timestamps.pop(0)

            self.min_list.pop(0)
            self.max_list.pop(0)

        self.min = min(self.min_list)
        self.max = max(self.max_list)

    def get_adapter(self, adapter_list):
        pass  # method empty on purpose as we don't need the adapter for this type of dataset


class GraphAdapter(ApiAdapter):

    def __init__(self, **kwargs):

        super(GraphAdapter, self).__init__(**kwargs)

        self.dataset_config = self.options.get("config_file")

        self.dataset_trees = {}

        self.datasets = {}

        self.param_tree = ParameterTree({})

        self.load_config() 

    def load_config(self):

        logging.debug("loading config file")

        with open(self.dataset_config) as f:
            config = json.load(f)
            for name, info in config.items():
                try:
                    if info.get('average', False):
                        self.add_avg_dataset(info['interval'], info['retention'], name, info['source'], name) #test this!
                    else:
                        self.add_dataset(info['adapter'], info['get_path'], info['interval'], info['retention'], name, name)
                    
                except KeyError as err:
                    logging.error("Error creating dataset %s: %s", (name), err)

        self.param_tree = ParameterTree({
            name: dataset.param_tree for (name, dataset) in self.dataset_trees.items()
        }) 

    def add_to_dict(self, location, data, dict):
        param_dict = dict
        parts = location.strip("/").split("/")
        for path_part in parts:
            try:
                if path_part != parts[-1]:
                    param_dict = param_dict[path_part]
                else:
                    param_dict[path_part] = data
            except KeyError:
                param_dict[path_part] = {}
                param_dict = param_dict[path_part]

    def add_dataset(self, adapter, path, interval, retention, name, location):

        dataset = GraphDataset(
            time_interval=interval,
            adapter=adapter,
            get_path=path,
            retention=retention,
            name=name
            )

        self.add_to_dict(location, dataset.param_tree, self.dataset_trees)
        self.add_to_dict(location, dataset, self.datasets)

        self.param_tree = ParameterTree(self.dataset_trees)

    def add_avg_dataset(self, interval, retention, name, source, location):

        source_dataset = self.datasets[source.split("/")[0]][source.split("/")[1]][source.split("/")[2]][source.split("/")[3]]

        dataset = AvgGraphDataset(
            time_interval=interval,
            retention=retention,
            name=name,
            source=source_dataset 
        )

        self.add_to_dict(location, dataset.param_tree, self.dataset_trees)
        self.add_to_dict(location, dataset, self.datasets)

        self.param_tree = ParameterTree(self.dataset_trees)

    def initialize(self, adapters):
        self.adapters = dict((k, v) for k, v in adapters.items() if v is not self)

        logging.debug("Received following dict of Adapters: %s", self.adapters)
        # logging.debug("Getting adapter %s", self.target_adapter)

        for name, time in self.datasets.items():
            for name, device in time.items():
                for name, channel in device.items():
                    for name, dataset in channel.items():
                        dataset.get_adapter(self.adapters)
                        dataset.data_loop.start()


    def get(self, path, request):
        """
        Handle an HTTP GET request.

        This method handles an HTTP GET request, returning a JSON response.

        :param path: URI path of request
        :param request: HTTP request object
        :return: an ApiAdapterResponse object containing the appropriate response
        """

        try:
            response = self.param_tree.get(path)
            content_type = 'application/json'
            status = 200
        except ParameterTreeError as param_error:
            response = {'response': "Graphing Adapter GET Error: %s".format(param_error)}
            content_type = 'application/json'
            status = 400

        return ApiAdapterResponse(response, content_type=content_type, status_code=status)
