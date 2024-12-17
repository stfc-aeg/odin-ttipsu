import './App.css';
import React from 'react';
import { OdinApp } from 'odin-react';
import 'odin-react/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAdapterEndpoint } from 'odin-react';

import MainPage from './MainPage';
import GraphPage from './GraphPage';

function App() {

  const PsuEndPoint = useAdapterEndpoint("ttipsu", "http://192.168.0.14:8888", 1000);

  const GraphEndPoint = useAdapterEndpoint("graph", "http://192.168.0.14:8888");

  return (
    <OdinApp title="TTi PSU Adapter"
    navLinks={["Controls", "Graphs"]}
    icon_src="odin.png"
    icon_hover_src="prodin.png">

      <MainPage PsuEndPoint={PsuEndPoint}/>

      <GraphPage PsuEndPoint={PsuEndPoint} GraphEndPoint={GraphEndPoint}/>

    </OdinApp>
  );
}

export default App;
 
