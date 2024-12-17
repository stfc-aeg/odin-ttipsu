import './App.css';
import React from 'react';
import Plot from 'react-plotly.js';
import 'odin-react/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Nav from 'react-bootstrap/Nav';

import {useState} from 'react';

import { ToggleSwitch } from 'odin-react';

import MonitorGraph from './MonitorGraph';


function GraphChannel(props) {

    const {PsuEndPoint, GraphEndPoint, device_num, channel_num, channel, timescale} = props;

    const [powermode, setPowermode] = useState(false);

    // const plots = PsuEndPoint.data?.plots ? PsuEndPoint.data.plots[device_num -1][channel_num -1] : [];

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
                visible: (powermode ? true : false)
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
                visible: (powermode ? true : false)
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
                visible: (powermode ? true : false)
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

    function Toggle() {
        setPowermode(!powermode)
    }; 

    const selection = {
        "1min": [data_1min, layout_1min],
        "5mins": [data_5mins, layout_5mins],
        "24hr": [data_24hr, layout_24hr]
    }

    return (
        <Container fluid>
            <Accordion.Header>{"Channel " + String(channel_num)}</Accordion.Header>
            <Accordion.Body>

                <Row>
                    <ToggleSwitch checked={powermode} label="Power view" onClick={Toggle}/>
                </Row>

                <Row><p></p></Row>

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