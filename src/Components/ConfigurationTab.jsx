import React, { useState, useEffect, useContext } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import StatusContext from '../Contexts/statusContext';

function ConfigurationTab({ onSaveCropZones }) {
  const [selectedCubicle, setSelectedCubicle] = useState(0);
  const [image, setImage] = useState(null);
  const context = useContext(StatusContext);
  const [cropZones, setCropZones] = useState(context.cropZones);
  const [currentCrop, setCurrentCrop] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = context.cameraFeed;
    img.onload = () => setImage(img);
  }, [context.cameraFeed]);

  useEffect(() => {
    setCropZones(context.cropZones);
    setCurrentCrop(context.cropZones[selectedCubicle]);
    console.log('Crop zones loaded from context:', context.cropZones);
  }, [context.cropZones, selectedCubicle]);

  const handleCropChange = (crop) => {
    console.log('Crop changed:', crop);
    setCurrentCrop(crop); // DO NOT set unit to '%'
  };

  const handleCropComplete = (crop, percentCrop) => {
    console.log('Crop complete for cubicle', selectedCubicle, ':', percentCrop);

    // use percentCrop provided by react-image-crop
    const newZones = [...cropZones];
    newZones[selectedCubicle] = percentCrop;
    setCropZones(newZones);
    console.log('Updated zones:', newZones);
  };

  const handleSaveConfiguration = () => {
    // Ensure all crop zones have the required fields and unit is '%'
    const normalizedZones = cropZones.map(zone => ({
      ...zone,
      unit: '%',
      x: zone.x || 0,
      y: zone.y || 0,
      width: zone.width || 0,
      height: zone.height || 0
    }));

    // Update context directly
    context.updateCropZones(normalizedZones);
    console.log('Saving crop zones:', normalizedZones);
    alert('Cubicle detection zones saved successfully!');
  };

  const handleResetZone = () => {
    const defaultZones = [
      // Row 1 (Cubicles 1-5)
      { unit: '%', x: 41.7, y: 7.3, width: 10.8, height: 20.0 },
      { unit: '%', x: 52.1, y: 6.1, width: 10.1, height: 21.7 },
      { unit: '%', x: 62.4, y: 7.0, width: 8.2, height: 20.5 },
      { unit: '%', x: 70.7, y: 7.3, width: 9.6, height: 23.9 },
      { unit: '%', x: 82.9, y: 10.0, width: 9.1, height: 19.2 },
      // Row 2 (Cubicles 6-10)
      { unit: '%', x: 27.0, y: 27.2, width: 15.0, height: 25.0 },
      { unit: '%', x: 40.7, y: 28.8, width: 15.0, height: 25.0 },
      { unit: '%', x: 54.4, y: 31.3, width: 15.0, height: 25.0 },
      { unit: '%', x: 69.7, y: 30.0, width: 11.5, height: 27.3 },
      { unit: '%', x: 81.9, y: 33.8, width: 15.0, height: 29.6 },
      // Row 3 (Cubicles 11-15)
      { unit: '%', x: 9.3, y: 53.0, width: 17.4, height: 43.6 },
      { unit: '%', x: 28.1, y: 58.7, width: 15.0, height: 38.1 },
      { unit: '%', x: 44.6, y: 59.0, width: 15.0, height: 38.6 },
      { unit: '%', x: 62.7, y: 64.3, width: 13.4, height: 32.5 },
      { unit: '%', x: 78.7, y: 65.1, width: 15.0, height: 34.8 }
    ];
    setCropZones(defaultZones);
    alert('All zones reset to default positions (3 rows × 5 seats)!');
  };

  const handleAddCubicle = () => {
    context.addCubicle();
    alert('New cubicle added successfully!');
  };

  const handleRemoveCubicle = (index) => {
    if (window.confirm(`Are you sure you want to remove Cubicle ${index + 1}?`)) {
      context.removeCubicle(index);
      // If we removed the currently selected cubicle, select the last one
      if (selectedCubicle >= cropZones.length - 1) {
        setSelectedCubicle(Math.max(0, cropZones.length - 2));
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (warn if > 5MB for mobile)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const maxSize = isMobile ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB mobile, 10MB desktop

      if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
        alert(`Warning: Image is ${sizeMB}MB. For best performance on ${isMobile ? 'mobile' : 'desktop'}, use images under ${maxSizeMB}MB.`);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        context.updateCameraFeed(e.target.result);
        alert('Camera feed image updated successfully!');
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Failed to load image. Please try a different image or smaller file size.');
      };
      reader.readAsDataURL(file);
    }
  };

  const cubicleNames = cropZones.map((_, index) => `C${index + 1}`);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h4 className="mb-0">
                <i className="bi bi-gear"></i> Configure Detection Zones
              </h4>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <strong>Instructions:</strong> Upload a camera feed image, select a cubicle from the list below,
                then drag and resize the crop box on the image to define the detection area for that cubicle.
                Click "Save Configuration" when you're done.
              </div>

              {/* Camera Feed Upload Section */}
              <div className="mb-4">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-camera"></i> Camera Feed Image
                    </h5>
                  </div>
                  <div className="card-body">
                    <p className="text-muted mb-2">Upload your library camera feed image for detection</p>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageUpload}
                        id="imageUpload"
                      />
                      <label className="input-group-text" htmlFor="imageUpload">
                        <i className="bi bi-upload"></i> Choose Image
                      </label>
                    </div>
                    <small className="text-muted">Mobile users: You can take a photo directly with your camera</small>
                  </div>
                </div>
              </div>

              {/* Cubicle Selector */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">Select Cubicle to Configure:</h5>
                  <div className="btn-group">
                    <button className="btn btn-success btn-sm" onClick={handleAddCubicle}>
                      <i className="bi bi-plus-circle"></i> Add Cubicle
                    </button>
                  </div>
                </div>
                <div className="btn-group flex-wrap" role="group">
                  {cubicleNames.map((name, index) => (
                    <div key={index} className="position-relative">
                      <button
                        type="button"
                        className={`btn ${selectedCubicle === index ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setSelectedCubicle(index)}
                      >
                        {name}
                      </button>
                      {cropZones.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle badge rounded-pill"
                          onClick={() => handleRemoveCubicle(index)}
                          style={{ fontSize: '0.6rem', padding: '0.15rem 0.3rem', zIndex: 10 }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Configuration Info */}
              <div className="alert alert-secondary">
                <strong>Currently Configuring:</strong> Cubicle {cubicleNames[selectedCubicle]} <br />
                <small>
                  Position: X={cropZones[selectedCubicle]?.x?.toFixed(1) || 0}%, Y={cropZones[selectedCubicle]?.y?.toFixed(1) || 0}% |
                  Size: {cropZones[selectedCubicle]?.width?.toFixed(1) || 0}% × {cropZones[selectedCubicle]?.height?.toFixed(1) || 0}%
                </small>
              </div>

              {/* Image Crop Editor */}
              <div className="mb-4">
                <h5 className="text-center">Define Detection Area:</h5>
                {/* Debug info */}
                {cropZones[selectedCubicle] && (
                  <div className="text-center mb-2">
                    <small className="text-muted">
                      Debug: x={cropZones[selectedCubicle].x || 0}, y={cropZones[selectedCubicle].y || 0},
                      w={cropZones[selectedCubicle].width || 0}, h={cropZones[selectedCubicle].height || 0},
                      unit={cropZones[selectedCubicle].unit || '%'}
                    </small>
                  </div>
                )}
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {image ? (
                    currentCrop ? (
                      <ReactCrop
                        crop={currentCrop}
                        onChange={handleCropChange}
                        onComplete={handleCropComplete}
                      >
                        <img
                          src={context.cameraFeed}
                          alt="Library feed"
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                          }}
                        />
                      </ReactCrop>
                    ) : (
                      <p className="text-danger">No crop zone defined for this cubicle</p>
                    )
                  ) : (
                    <p className="text-muted">Loading image...</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-success btn-lg" onClick={handleSaveConfiguration}>
                  <i className="bi bi-check-circle"></i> Save Configuration
                </button>
                <button className="btn btn-warning btn-lg" onClick={handleResetZone}>
                  <i className="bi bi-arrow-counterclockwise"></i> Reset All Zones
                </button>
              </div>

              {/* Zone Preview */}
              <div className="mt-4">
                <h5>All Configured Zones:</h5>
                <div className="table-responsive">
                  <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th>Cubicle</th>
                        <th>X Position</th>
                        <th>Y Position</th>
                        <th>Width</th>
                        <th>Height</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cropZones.map((zone, index) => (
                        <tr key={index} className={selectedCubicle === index ? 'table-primary' : ''}>
                          <td><strong>{cubicleNames[index]}</strong></td>
                          <td>{zone?.x?.toFixed(1) || 0}%</td>
                          <td>{zone?.y?.toFixed(1) || 0}%</td>
                          <td>{zone?.width?.toFixed(1) || 0}%</td>
                          <td>{zone?.height?.toFixed(1) || 0}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigurationTab;
