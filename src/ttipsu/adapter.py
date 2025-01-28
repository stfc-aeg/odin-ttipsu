"""TTI PSU Adapter."""

import logging

from odin.adapters.adapter import ApiAdapter, ApiAdapterResponse, request_types, response_types
from odin.adapters.parameter_tree import ParameterTreeError
from tornado.escape import json_decode

from .controller import PsuController, PsuError


class TtiPsuAdapter(ApiAdapter):
    """TtiPsuAdapter class."""

    def __init__(self, **kwargs):
        """Initialize the PsuAdapter object.

        This constructor initializes the PsuAdapter object.

        :param kwargs: keyword arguments specifying options
        """
        # Intialise superclass
        super(TtiPsuAdapter, self).__init__(**kwargs)

    def initialize(self, adapters):
        adapters_list = dict((k, v) for k, v in adapters.items() if v is not self)
        graph_adapter = adapters_list["graphing"]

        # Parse options
        background_task_interval = float(self.options.get('background_task_interval', 1.0))
        connections = self.options.get('connections').split(" ")

        self.controller = PsuController(background_task_interval, connections, graph_adapter)
        logging.debug('PsuAdapter loaded')

    @response_types('application/json', default='application/json')
    def get(self, path, request):
        """Handle an HTTP GET request.

        This method handles an HTTP GET request, returning a JSON response.

        :param path: URI path of request
        :param request: HTTP request object
        :return: an ApiAdapterResponse object containing the appropriate response
        """
        try:
            response = self.controller.get(path)
            status_code = 200
        except ParameterTreeError as e:
            response = {'error': str(e)}
            status_code = 400

        content_type = 'application/json'

        return ApiAdapterResponse(response, content_type=content_type,
                                  status_code=status_code)

    @request_types('application/json')
    @response_types('application/json', default='application/json')
    def put(self, path, request):
        """Handle an HTTP PUT request.

        This method handles an HTTP PUT request, returning a JSON response.

        :param path: URI path of request
        :param request: HTTP request object
        :return: an ApiAdapterResponse object containing the appropriate response
        """
        content_type = 'application/json'

        try:
            data = json_decode(request.body)
            self.controller.set(path, data)
            response = self.controller.get(path)
            status_code = 200
        except PsuError as e:
            response = {'error': str(e)}
            status_code = 400
        except (TypeError, ValueError) as e:
            response = {'error': 'Failed to decode PUT request body: {}'.format(str(e))}
            status_code = 400

        logging.debug(response)

        return ApiAdapterResponse(response, content_type=content_type,
                                  status_code=status_code)

    def delete(self, path, request):
        """Handle an HTTP DELETE request.

        This method handles an HTTP DELETE request, returning a JSON response.

        :param path: URI path of request
        :param request: HTTP request object
        :return: an ApiAdapterResponse object containing the appropriate response
        """
        response = 'PsuAdapter: DELETE on path {}'.format(path)
        status_code = 200

        logging.debug(response)

        return ApiAdapterResponse(response, status_code=status_code)

    def cleanup(self):
        """Clean up adapter state at shutdown.

        This method cleans up the adapter state when called by the server at e.g. shutdown.
        It simplied calls the cleanup function of the PsuController instance.
        """
        self.controller.cleanup()
