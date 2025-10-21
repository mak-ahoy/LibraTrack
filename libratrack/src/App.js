import React, { useRef, useState, useContext } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Container from "./Components/Head";
import { FixedCropExample } from "./tesing_crop";
import Seating from "./Components/Seating";
import StatusState from "./Contexts/StatusState";
import ConfigurationTab from "./Components/ConfigurationTab";
import StatusContext from "./Contexts/statusContext";

function AppContent() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [status, setStatus] = useState([0, 0, 0, 0, 0, 0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const context = useContext(StatusContext);

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
  };

  const handleSaveCropZones = (zones) => {
    context.updateCropZones(zones);
  };

  return (
    <>
      <Navbar />

      <div className="App">
        <Container title="Welcome to LibraTrack" />

        {/* Tab Navigation */}
        <div className="container mt-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <i className="bi bi-speedometer2"></i> Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'configuration' ? 'active' : ''}`}
                onClick={() => setActiveTab('configuration')}
              >
                <i className="bi bi-sliders"></i> Configure Detection Zones
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            <Seating status={status} setStatus={updateStatus} />

            {/* Detection Section */}
            <div className="container mt-5">
              <div className="card">
                <div className="card-header bg-info text-white">
                  <h4 className="mb-0">AI Detection Monitor</h4>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    The system scans each cubicle every 5 seconds to detect occupancy using computer vision.
                    Green indicates available, red indicates occupied.
                  </p>

                  {/* Library Camera Feed */}
                  <div className="text-center mb-4">
                    <h5 className="mb-3">Library Camera Feed</h5>
                    <img
                      ref={imageRef}
                      src={context.cameraFeed}
                      alt="Library cubicles"
                      className="img-fluid rounded shadow"
                      style={{maxWidth: "80%"}}
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
                  </div>

                  {/* Individual Detection Results */}
                  <FixedCropExample status={status} updateStatus={updateStatus} />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'configuration' && (
          <ConfigurationTab onSaveCropZones={handleSaveCropZones} />
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <StatusState>
      <AppContent />
    </StatusState>
  );
}

export default App;
