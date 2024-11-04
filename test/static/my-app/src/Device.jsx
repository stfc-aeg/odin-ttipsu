import './App.css';
import React from 'react';

import 'odin-react/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import { TitleCard, StatusBox } from 'odin-react';
import { WithEndpoint, ToggleSwitch } from 'odin-react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ListGroup, Card } from 'react-bootstrap';

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

            <TitleCard title={device.id || " "}>
 
                <Row>
                    {/* <Col xs={6}>
                        <StatusBox label="Remote enable" type={device.remote_enable ? "primary" : "dark"}>
                            {device.remote_enable || false}
                        </StatusBox>
                    </Col> */}
                    <Col xs={12}>
                        <EndpointToggleButton endpoint={PsuEndPoint} event_type="click" label="Enable remote commands"
                        fullpath={"devices/" + String(num) + "/remote_enable"} checked={device?.remote_enable || false} value={device?.remote_enable || false} />
                    </Col>
                </Row>

                <Row><p></p></Row>

                <Row md={device.num_of_channels}>
                        {ChannelList}
                </Row> 

            </TitleCard>

        </Container>
    )
}

export default Device;