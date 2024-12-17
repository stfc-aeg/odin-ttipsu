import './App.css';
import React from 'react';
import 'odin-react/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';

import GraphChannel from './GraphChannel'

function GraphDevice(props) {

    const {PsuEndPoint, GraphEndPoint, num, device, timescale} = props;

    const Channels = PsuEndPoint.data?.devices ? Object.entries(PsuEndPoint.data.devices[num].channels).map(
        ([key, value]) => (
            <Accordion.Item eventKey={key}>
                <Row>
                    <GraphChannel PsuEndPoint={PsuEndPoint} GraphEndPoint={GraphEndPoint} device_num={num} channel_num={key} channel={value} timescale={timescale}/>
                </Row>
            </Accordion.Item>
        )
    ) : <></>

    return (
        <Container fluid>
            <Accordion.Header>{(device.id || " ") + " - " + (device.host || " ")}</Accordion.Header>
            <Accordion.Body>
                <Accordion alwaysOpen>
                    {Channels}
                </Accordion>
            </Accordion.Body>
        </Container>
    )
}

export default GraphDevice;