import './App.css';
import React from 'react';
import { OdinApp } from 'odin-react';
import 'odin-react/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from './MainPage';

function App() {

  return (
    <OdinApp title="TTi PSU Adapter"
    navLinks={["Main Page"]}
    icon_src="odin.png"
    icon_hover_src="prodin.png">

      <MainPage />

    </OdinApp>
  );
}

export default App;

