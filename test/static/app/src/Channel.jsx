import './App.css';
import React from 'react';
import 'odin-react/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import ListGroup from 'react-bootstrap/ListGroup';

import { WithEndpoint, ToggleSwitch, TitleCard } from 'odin-react';

const EndpointToggleButton = WithEndpoint(ToggleSwitch);
const EndpointInput = WithEndpoint(Form.Control)

function Channel(props) {

    const {device_num, device, num, PsuEndPoint, channel} = props;

    return (
        <Container fluid>
            <TitleCard title={"Channel " + String(num)}>
                <Row>
                    <Col>
                        <EndpointToggleButton 
                            endpoint={PsuEndPoint} 
                            event_type="click" 
                            label="on/off" 
                            disabled={(device ? device.remote_enable : "false") ? false : true}
                            fullpath={"devices/" + String(device_num) + "/channels/" + String(num) + "/status"} 
                            checked={channel? channel.status : "false"} 
                            value={channel? channel.status : "false"} />
                    </Col>
                </Row> 

                <Row><p></p></Row>

                <Row>
                    <CardGroup>
                            <Card>
                                <Card.Header>Voltage</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            {channel.voltage.output}V
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                          <EndpointInput 
                                                endpoint={PsuEndPoint} 
                                                event_type="change" 
                                                type="number" 
                                                step={0.5} 
                                                disabled={(device ? device.remote_enable : "false") ? false : true} 
                                                fullpath={"devices/" + String(device_num) + "/channels/" + String(num) + "/voltage/setting"}/>
                                        </ListGroup.Item>
                                    </ListGroup>
                            </Card>

                            <Card>
                                <Card.Header>Current</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            {channel.current.output}A
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <EndpointInput 
                                                endpoint={PsuEndPoint} 
                                                event_type="change" 
                                                type="number" 
                                                step={0.1} 
                                                disabled={(device ? device.remote_enable : "false") ? false : true} 
                                                fullpath={"devices/" + String(device_num) + "/channels/" + String(num) + "/current/setting"}/>
                                        </ListGroup.Item>
                                    </ListGroup>
                            </Card>
                    </CardGroup>
                </Row>
            </TitleCard>
        </Container>
    )
}

export default Channel;
