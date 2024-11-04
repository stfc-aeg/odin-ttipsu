import './App.css';
import React from 'react';

import 'odin-react/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import { useAdapterEndpoint } from 'odin-react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Device from './Device';


function MainPage() {

    const PsuEndPoint = useAdapterEndpoint("ttipsu", "http://localhost:8888", 1000);

    const DeviceList = PsuEndPoint.data?.devices ? Object.entries(PsuEndPoint.data?.devices).map(
                            ([key, value]) => (
                                <Row>
                                    <Device num={key} PsuEndPoint={PsuEndPoint} device={value} />
                                </Row>
                            )
                        ) : <></>

    return (

        <Container fluid>

            <Row><p></p></Row>

            {DeviceList}
            
        </Container>
    )
}

export default MainPage;
