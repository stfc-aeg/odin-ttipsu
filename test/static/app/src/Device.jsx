import './App.css';
import React from 'react';
import 'odin-react/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';

import { WithEndpoint, ToggleSwitch, TitleCard } from 'odin-react';

import Channel from './Channel';

const EndpointToggleButton = WithEndpoint(ToggleSwitch);

function Device(props) {

    const {num, PsuEndPoint, device} = props;

    const ChannelList = PsuEndPoint.data?.devices[num].channels ? Object.entries(PsuEndPoint.data.devices[num].channels).map(
                            ([key, value]) => (
                                <Channel device_num={num} device={device} num={key} PsuEndPoint={PsuEndPoint} channel={value} />
                            )
                        ) : <></>
    // Call Channel function for each subtree in the channels tree 

    return (
        <Container fluid>
            <Accordion.Header> {(device.id || " ") + " - " + (device.host || " ")}</Accordion.Header>
            <Accordion.Body>
                <Row>
                    <Col>
                        <EndpointToggleButton 
                            endpoint={PsuEndPoint} 
                            event_type="click" 
                            label="Enable remote commands"
                            fullpath={"devices/" + String(num) + "/remote_enable"} 
                            checked={device?.remote_enable || false} 
                            value={device?.remote_enable || false} />
                    </Col>
                </Row>

                <Row><p></p></Row>

                <Row md={device.num_of_channels}>
                    {ChannelList}
                </Row> 
            </Accordion.Body>
        </Container>
    )
}

export default Device;
