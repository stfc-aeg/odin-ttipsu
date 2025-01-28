import './App.css';
import React from 'react';
import 'odin-react/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import { useState } from 'react';

import GraphDevice from './GraphDevice';

function GraphPage(props) {

    const {PsuEndPoint, GraphEndPoint} = props;

    const [timescale, setTimeScale] = useState("1min");

    const Devices = PsuEndPoint.data?.devices ? Object.entries(PsuEndPoint.data.devices).map(
        ([key, value]) => (
            <Accordion.Item eventKey={key}>
                <Row>
                    <GraphDevice PsuEndPoint={PsuEndPoint} GraphEndPoint={GraphEndPoint} num={key} device={value} timescale={timescale}/>
                </Row>
            </Accordion.Item>
        )
    ) : <></>

    var interval = 1000
    React.useEffect(function() {
        if (timescale) {
            var timer_id = setInterval(function() {
                GraphEndPoint.get(timescale + "/").then(function (result)
                {
                    GraphEndPoint.mergeData(result[timescale], (timescale + "/"));
                }
            )
            }, interval);
        };
        return () => {
            clearInterval(timer_id);
        };
    }, [interval, timescale]);

    function changeTimeScale(timescale) {
        setTimeScale(timescale)
    };

    return (
        <Container fluid>

            <Row><p></p></Row>

            <div className="d-grid gap-2" >
                <ToggleButtonGroup type="radio" name="options">
                    <ToggleButton id="1min" value={1} variant="outline-secondary" onChange={() => changeTimeScale("1min")}>1 minute (/1 second)</ToggleButton>
                    <ToggleButton id="5mins" value={2} variant="outline-secondary" onChange={() => changeTimeScale("5mins")}>5 minutes avg (/5 seconds)</ToggleButton>
                    <ToggleButton id="24hr" value={3} variant="outline-secondary" onChange={() => changeTimeScale("24hr")}>24 hours avg (/1 minute)</ToggleButton>
                </ToggleButtonGroup>
            </div>

            <Row><p></p></Row>

            <Accordion alwaysOpen>
                {Devices}
            </Accordion>

        </Container>
    )
}

export default GraphPage;