import React, { useRef, useState, useEffect, useContext } from "react";
import scanImg from './assets/seating.jpg';
import "./App.css";
import Navbar from "./Components/Navbar";
import Container from "./Components/Head";
import { Detector } from "./imageprocessor";
import { FixedCropExample } from "./tesing_crop";
import Seating from "./Components/Seating";
import StatusState from "./Contexts/StatusState";

function App() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [status, setStatus] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const updateStatus = (newStatus) => {
    // console.log("Before updateStatus:", status);
    setStatus(newStatus);
    // console.log("After updateStatus:", status);
  };
  

  return (
    <>
        <StatusState> 
        <Navbar />
            
      <div className="App">
        

          <Container title="Welcome" />
          <br />

          <Seating status={status} setStatus={updateStatus} />

          <Detector status={status} />

          <header className="App-header">
            <FixedCropExample status={status} updateStatus={updateStatus} />

            <img
              ref={imageRef}
              src={scanImg}
              alt="Help"
              className="w-50"
            />

            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: 8,
                width: "50%",
                height: "auto",
              }}
            />
          </header>

        
      </div>
      </StatusState>
    </>
  );
}

export default App;
