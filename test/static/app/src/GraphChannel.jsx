import './App.css';
import React from 'react';
import Plot from 'react-plotly.js';
import 'odin-react/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import {useState} from 'react';

import { ToggleSwitch } from 'odin-react';

function GraphChannel(props) {

    const {PsuEndPoint, GraphEndPoint, device_num, channel_num, channel, timescale} = props;

    const [powermode, setPowermode] = useState(false);

    const [showsettings, setShowSettings] = useState(true);
    const [showmax, setShowMax] = useState(false);
    const [showmin, setShowMin] = useState(false);

    var layout_1min = {
        showlegend: false,
        autosize: true,
        yaxis: {title: {text: "voltage (V)", font: {color: 'rgb(71, 124, 181)'}},
                tickfont: {color: 'rgb(71, 124, 181)'},
                rangemode: 'tozero',
                range: [0, 1.2*channel.voltage.setting],
                visible: (!powermode ? true : false)
            },

        yaxis2: {title: {text: "current (A)", font: {color: 'rgb(245, 144, 44)'}}, 
                tickfont: {color: 'rgb(245, 144, 44)'},
                rangemode: 'tozero',
                range: [0, 1.1*channel.current.setting], 
                overlaying:'y', side:'right',
                visible: (!powermode ? true : false)
            },
        
        yaxis3: {title: {text: "power (W)"},
                rangemode: 'tozero',
                visible: (powermode ? true : false),
                range: [0, 1.2*channel.power.max]
            },

        xaxis: {title:"time", 
                showticklabels: true,
                tickmode: "linear",
                dtick: 5
            },

        shapes: [
            {
                type: 'line',
                yref: 'y2',
                xref: 'paper',
                x0: 0,
                y0: channel.current.setting,
                x1: 1,
                y1: channel.current.setting,
                line: {
                    color: 'rgb(245, 144, 44)',
                    width: 2,
                    dash: 'dashdot'
                },
                label: {
                    font: {
                        color: 'rgb(245, 144, 44)'
                    },
                    text: "current limit",
                    yanchor: 'bottom',
                    textposition: 'end'
                },
                visible: (!powermode ? true : false)
            },
            
            {
                type: 'line',
                yref: 'y',
                xref: 'paper',
                x0: 0,
                y0: channel.voltage.setting,
                x1:  1,
                y1: channel.voltage.setting,
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dashdot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "voltage setting",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (!powermode ? true : false)
            }
        ]
    }

    var layout_5mins = {
        showlegend: false,
        autosize: true,
        yaxis: {title: {text: "voltage (V)", font: {color: 'rgb(71, 124, 181)'}},
                tickfont: {color: 'rgb(71, 124, 181)'},
                rangemode: 'tozero',
                range: [0, 1.2*channel.voltage.setting],
                visible: (!powermode ? true : false)
            },

        yaxis2: {title: {text: "current (A)", font: {color: 'rgb(245, 144, 44)'}}, 
                tickfont: {color: 'rgb(245, 144, 44)'},
                rangemode: 'tozero',
                range: [0, 1.1*channel.current.setting], 
                overlaying:'y', side:'right',
                visible: (!powermode ? true : false)
            },
        
        yaxis3: {title: {text: "power (W)"},
                rangemode: 'tozero',
                visible: (powermode ? true : false),
                range: [0, 1.2*(GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max : [])]
            },

        xaxis: {title:"time", 
                showticklabels: true,
                tickmode: "linear",
                dtick: 5
            },

        shapes: [
            {
                type: 'line',
                yref: 'y2',
                xref: 'paper',
                x0: 0,
                y0: channel.current.setting,
                x1: 1,
                y1: channel.current.setting,
                line: {
                    color: 'rgb(245, 144, 44)',
                    width: 2,
                    dash: 'dashdot'
                },
                label: {
                    font: {
                        color: 'rgb(245, 144, 44)'
                    },
                    text: "current limit",
                    yanchor: 'bottom',
                    textposition: 'end'
                },
                visible: (!powermode ? true : false) && (showsettings ? true : false) ? true: false
            },
            
            {
                type: 'line',
                yref: 'y',
                xref: 'paper',
                x0: 0,
                y0: channel.voltage.setting,
                x1:  1,
                y1: channel.voltage.setting,
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dashdot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "voltage setting",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (!powermode ? true : false) && (showsettings ? true : false) ? true: false
            },

            {
                type: 'line',
                yref: 'y',
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.max ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.max : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.max ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.max : []),
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "voltage max",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (!powermode ? true : false) && (showmax ? true : false) ? true : false
            },

            {
                type: 'line',
                yref: 'y2',
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.max ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.max : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.max ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.max : []),
                line: {
                    color: 'rgb(245, 144, 44)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(245, 144, 44)'
                    },
                    text: "current max",
                    yanchor: 'bottom',
                    textposition: 'end'
                },
                visible: (!powermode ? true : false) && (showmax ? true : false) ? true : false
            },

            {
                type: 'line',
                yref: 'y',
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.min ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.min : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.min ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.min : []),
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "voltage min",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (!powermode ? true : false) && (showmin ? true : false) ? true : false
            },

            {
                type: 'line',
                yref: 'y2',
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.min ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.min : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.min ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.min : []),
                line: {
                    color: 'rgb(245, 144, 44)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(245, 144, 44)'
                    },
                    text: "current min",
                    yanchor: 'bottom',
                    textposition: 'end'
                },
                visible: (!powermode ? true : false) && (showmin ? true : false) ? true : false
            },

            {
                type: 'line',
                yref: (powermode ? 'y3' : 'y'),
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.min ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.min : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.min ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.min : []),
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "power min",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (powermode ? true : false) && (showmin ? true : false) ? true : false
            },

            {
                type: 'line',
                yref: (powermode ? 'y3' : 'y'),
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max : []),
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "power max",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (powermode ? true : false) && (showmax ? true : false) ? true : false
            }

        ]
    }

    var layout_24hr = {
        showlegend: false,
        autosize: true,
        yaxis: {title: {text: "voltage (V)", font: {color: 'rgb(71, 124, 181)'}},
                tickfont: {color: 'rgb(71, 124, 181)'},
                rangemode: 'tozero',
                range: [0, 1.2*channel.voltage.setting],
                visible: (!powermode ? true : false)
            },

        yaxis2: {title: {text: "current (A)", font: {color: 'rgb(245, 144, 44)'}}, 
                tickfont: {color: 'rgb(245, 144, 44)'},
                rangemode: 'tozero',
                range: [0, 1.1*channel.current.setting], 
                overlaying:'y', side:'right',
                visible: (!powermode ? true : false)
            },
        
        yaxis3: {title: {text: "power (W)"},
                rangemode: 'tozero',
                visible: (powermode ? true : false),
                range: [0, 1.2*(GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max : [])]
            },

        xaxis: {title:"time", 
                showticklabels: true,
                tickmode: "linear",
                dtick: 60
            },

        shapes: [
            {
                type: 'line',
                yref: 'y2',
                xref: 'paper',
                x0: 0,
                y0: channel.current.setting,
                x1: 1,
                y1: channel.current.setting,
                line: {
                    color: 'rgb(245, 144, 44)',
                    width: 2,
                    dash: 'dashdot'
                },
                label: {
                    font: {
                        color: 'rgb(245, 144, 44)'
                    },
                    text: "current limit",
                    yanchor: 'bottom',
                    textposition: 'end'
                },
                visible: (!powermode ? true : false) && (showsettings ? true : false) ? true: false
            },
            
            {
                type: 'line',
                yref: 'y',
                xref: 'paper',
                x0: 0,
                y0: channel.voltage.setting,
                x1:  1,
                y1: channel.voltage.setting,
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dashdot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "voltage setting",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (!powermode ? true : false) && (showsettings ? true : false) ? true: false
            },

            {
                type: 'line',
                yref: 'y',
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.max ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.max : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.max ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.max : []),
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "voltage max",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (!powermode ? true : false) && (showmax ? true : false) ? true : false
            },

            {
                type: 'line',
                yref: 'y2',
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.max ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.max : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.max ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.max : []),
                line: {
                    color: 'rgb(245, 144, 44)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(245, 144, 44)'
                    },
                    text: "current max",
                    yanchor: 'bottom',
                    textposition: 'end'
                },
                visible: (!powermode ? true : false) && (showmax ? true : false) ? true : false
            },

            {
                type: 'line',
                yref: 'y',
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.min ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.min : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.min ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.min : []),
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "voltage min",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (!powermode ? true : false) && (showmin ? true : false) ? true : false
            },

            {
                type: 'line',
                yref: 'y2',
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.min ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.min : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.min ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.min : []),
                line: {
                    color: 'rgb(245, 144, 44)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(245, 144, 44)'
                    },
                    text: "current min",
                    yanchor: 'bottom',
                    textposition: 'end'
                },
                visible: (!powermode ? true : false) && (showmin ? true : false) ? true : false
            },

            {
                type: 'line',
                yref: (powermode ? 'y3' : 'y'),
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.min ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.min : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.min ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.min : []),
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "power min",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (powermode ? true : false) && (showmin ? true : false) ? true : false
            },

            {
                type: 'line',
                yref: (powermode ? 'y3' : 'y'),
                xref: 'paper',
                x0: 0,
                y0: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max : []),
                x1:  1,
                y1: (GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.max : []),
                line: {
                    color: 'rgb(71, 124, 181)',
                    width: 2,
                    dash: 'dot'
                },
                label: {
                    font: {
                        color: 'rgb(71, 124, 181)'
                    },
                    text: "power max",
                    yanchor: 'bottom',
                    textposition: 'start'
                },
                visible: (powermode ? true : false) && (showmax ? true : false) ? true : false
            }
        ]
    }

    var voltage = {
        x: GraphEndPoint.data?.["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.timestamps ? GraphEndPoint.data["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.timestamps : [],
        y: GraphEndPoint.data?.["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.data ? GraphEndPoint.data["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.data : [],
        type: 'scatter',
        name: "voltage",
        visible: (!powermode ? true : false)
    };

    var current = {
        x: GraphEndPoint.data?.["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.timestamps ? GraphEndPoint.data["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.timestamps : [],
        y: GraphEndPoint.data?.["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.data ? GraphEndPoint.data["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.data : [],
        yaxis: 'y2',
        type: 'scatter',
        name: "current",
        visible: (!powermode ? true : false)
    };

    var power = {
        x: GraphEndPoint.data?.["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.timestamps ? GraphEndPoint.data["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.timestamps : [],
        y: GraphEndPoint.data?.["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.data ? GraphEndPoint.data["1min"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.data : [],
        yaxis: 'y3',
        type: 'scatter',
        name: "power",
        visible: (powermode ? true : false)
    };

    var data_1min = powermode ? [voltage, current, power] : [voltage, current];

    var voltage_24hr = {
        x: GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.timestamps ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.timestamps : [],
        y: GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.data ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.data : [],
        type: 'scatter',
        name: "voltage_24hr",
        visible: (!powermode ? true : false)
    };

    var current_24hr = {
        x: GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.timestamps ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.timestamps : [],
        y: GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.data ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.data : [],
        yaxis: 'y2',
        type: 'scatter',
        name: "current_24hr",
        visible: (!powermode ? true : false)
    };

    var power_24hr = {
        x: GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.timestamps ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.timestamps : [],
        y: GraphEndPoint.data?.["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.data ? GraphEndPoint.data["24hr"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.data : [],
        yaxis: 'y3',
        type: 'scatter',
        name: "power_24hr",
        visible: (powermode ? true : false)
    };

    var data_24hr = powermode ? [voltage_24hr, current_24hr, power_24hr] : [voltage_24hr, current_24hr];


    var voltage_5mins = {
        x: GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.timestamps ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.timestamps : [],
        y: GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.data ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.voltage?.data : [],
        type: 'scatter',
        name: "voltage_5mins",
        visible: (!powermode ? true : false)
    };

    var current_5mins = {
        x: GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.timestamps ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.timestamps : [],
        y: GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.data ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.current?.data : [],
        yaxis: 'y2',
        type: 'scatter',
        name: "current_5mins",
        visible: (!powermode ? true : false)
    };

    var power_5mins = {
        x: GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.timestamps ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.timestamps : [],
        y: GraphEndPoint.data?.["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.data ? GraphEndPoint.data["5mins"]?.["device" + String(device_num)]?.["channel" + String(channel_num)]?.power?.data : [],
        yaxis: 'y3',
        type: 'scatter',
        name: "power_5mins",
        visible: (powermode ? true : false) 
    };

    var data_5mins = powermode ? [voltage_5mins, current_5mins, power_5mins] : [voltage_5mins, current_5mins];

    function PowerToggle() {
        setPowermode(!powermode)
    }; 

    function SettingsToggle() {
        setShowSettings(!showsettings)
    };

    function MaxToggle() {
        setShowMax(!showmax)
    };

    function MinToggle() {
        setShowMin(!showmin)
    };

    const selection = {
        "1min": [data_1min, layout_1min],
        "5mins": [data_5mins, layout_5mins],
        "24hr": [data_24hr, layout_24hr]
    };

    return (
        <Container fluid>
            <Accordion.Header>{"Channel " + String(channel_num)}</Accordion.Header>
            <Accordion.Body>

                <Row>
                    <Col>
                    <ToggleSwitch checked={powermode} label="Power view" onClick={PowerToggle}/>
                    </Col>
                </Row>

                <Row><p></p></Row>

                <Row>
                    <Col>
                        <ToggleSwitch checked={showsettings} label="Settings" onClick={SettingsToggle} disabled={timescale==="1min" || powermode}/>
                    </Col>
                    <Col>
                        <ToggleSwitch checked={showmax} label="Maximums" onClick={MaxToggle} disabled={timescale==="1min"}/>
                    </Col>
                    <Col>
                        <ToggleSwitch checked={showmin} label="Minimums" onClick={MinToggle} disabled={timescale==="1min"}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Plot
                            data = {selection[timescale][0]}
                            style = {{height: '100%', width: '100%'}}
                            layout = {selection[timescale][1]}
                        />
                    </Col>
                </Row>

            </Accordion.Body>
        </Container>
    )
}

export default GraphChannel;