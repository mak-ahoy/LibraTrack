import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          <span className="badge bg-light text-primary me-2">AI</span>
          LibraTrack - Library Occupancy System
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent" >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                <i className="bi bi-house-door"></i> Dashboard
              </a>
            </li> 
             <li className="nav-item">
              <a className="nav-link" href="/">
                <i className="bi bi-grid"></i> Cubicle Map
              </a>
            </li> 
            <li className="nav-item">
              <a className="nav-link" href="/">
                <i className="bi bi-clock-history"></i> History
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">
                <i className="bi bi-gear"></i> Settings
              </a>
            </li> */}
          </ul>
          <span className="navbar-text text-white">
            <small>Real-time Monitoring</small>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
