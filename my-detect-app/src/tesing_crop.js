import React, { useState, useEffect, useContext, useCallback} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "./utilities";
import StatusContext from './Contexts/statusContext';

export function FixedCropExample(props) {
  const [croppedImage, setCroppedImage] = useState(null);
  const [currentCubicleIndex, setCurrentCubicleIndex] = useState(0);
  const context= useContext(StatusContext);
  const [allCroppedImages, setAllCroppedImages] = useState([]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cocoModel, setCocoModel] = useState(null);
  const [isDetectionRunning, setIsDetectionRunning] = useState(false);
  const [showCroppedZones, setShowCroppedZones] = useState(true);

  // Load the COCO-SSD model once on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const net = await cocossd.load();
        setCocoModel(net);
        setModelLoaded(true);
        console.log('COCO-SSD model loaded successfully');
      } catch (error) {
        console.error('Error loading COCO-SSD model:', error);
      }
    };
    loadModel();
  }, []);

  // Generate cropped images when crop zones or camera feed change
  useEffect(() => {
    makeFixedCrop();
  }, [context.cropZones, context.cameraFeed]);

  // Start detection when button is clicked
  const handleStartDetection = () => {
    if (!modelLoaded) {
      alert('Please wait for the AI model to load first!');
      return;
    }
    if (allCroppedImages.length === 0) {
      alert('No crop zones configured. Please configure detection zones first.');
      return;
    }
    setIsDetectionRunning(true);
    setCurrentCubicleIndex(0);
    if (allCroppedImages[0]) {
      setCroppedImage(allCroppedImages[0]);
    }
    console.log('Detection started');
  };

  // Stop detection when button is clicked
  const handleStopDetection = () => {
    setIsDetectionRunning(false);
    setCroppedImage(null);
    // Reset all statuses to 0 (available)
    const resetStatus = new Array(context.status.length).fill(0);
    context.updateStatus(resetStatus);
    console.log('Detection stopped and statuses reset');
  };

  useEffect(() => {
    console.log("Updated status in child:",context.status);
  }, [context.status]);
//
// const data = useContext(statusContext);
// console.log('data children: ', data.status);

  const makeFixedCrop = useCallback(() => {
    const img = new Image();
    // Don't set crossOrigin for local images or data URLs
    if (typeof context.cameraFeed === 'string' && context.cameraFeed.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    img.src = context.cameraFeed;

    console.log('Loading image from:', typeof context.cameraFeed === 'string' ? context.cameraFeed.substring(0, 100) + `... (length: ${context.cameraFeed.length})` : context.cameraFeed);

    img.onerror = (error) => {
      console.error('Error loading image:', error, 'Image src:', img.src);
    };

    img.onload = () => {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      console.log('Image loaded successfully:', { imgWidth, imgHeight, complete: img.complete, src: img.src.substring(0, 50) });
      console.log('Current crop zones from context:', context.cropZones);

      // Verify image is actually loaded
      if (imgWidth === 0 || imgHeight === 0) {
        console.error('Image loaded but dimensions are 0!');
        return;
      }

      // Use crop zones from context
      const zones = context.cropZones || [];
      const dataURLs = [];

      // Generate cropped images for all cubicles based on configured zones
      for (let i = 0; i < zones.length; i++) {
        const zone = zones[i];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Convert percentage to pixels
        let cropX = Math.floor((zone.x / 100) * imgWidth);
        let cropY = Math.floor((zone.y / 100) * imgHeight);
        let cropWidth = Math.floor((zone.width / 100) * imgWidth);
        let cropHeight = Math.floor((zone.height / 100) * imgHeight);

        // Ensure crop doesn't exceed image bounds
        if (cropX + cropWidth > imgWidth) {
          cropWidth = imgWidth - cropX;
        }
        if (cropY + cropHeight > imgHeight) {
          cropHeight = imgHeight - cropY;
        }

        console.log(`Cubicle ${i + 1} crop parameters:`, {
          zone,
          imgWidth,
          imgHeight,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          isValid: cropX >= 0 && cropY >= 0 && cropWidth > 0 && cropHeight > 0 &&
                   cropX + cropWidth <= imgWidth && cropY + cropHeight <= imgHeight
        });

        // Validate crop parameters
        if (cropWidth <= 0 || cropHeight <= 0) {
          console.error(`Invalid crop dimensions for Cubicle ${i + 1}: width=${cropWidth}, height=${cropHeight}`);
          continue;
        }

        if (cropX < 0 || cropY < 0 || cropX + cropWidth > imgWidth || cropY + cropHeight > imgHeight) {
          console.error(`Crop area out of bounds for Cubicle ${i + 1}`);
          console.error(`Image bounds: ${imgWidth}x${imgHeight}, Crop: (${cropX}, ${cropY}, ${cropWidth}, ${cropHeight})`);
        }

        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // Draw the cropped portion of the image
        try {
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
          );
        } catch (error) {
          console.error(`Error drawing image for Cubicle ${i + 1}:`, error);
        }

        const dataURL = canvas.toDataURL('image/jpeg');
        console.log(`Cubicle ${i + 1} image data URL length:`, dataURL.length);
        dataURLs.push(dataURL);
      }

      // Store all cropped images for display
      setAllCroppedImages(dataURLs);
      console.log(`Generated ${dataURLs.length} cropped images for detection`);

      // If detection is running, restart from first cubicle
      if (isDetectionRunning) {
        setCurrentCubicleIndex(0);
        if (dataURLs.length > 0) {
          setCroppedImage(dataURLs[0]);
        }
      }
    };
  }, [context.cameraFeed, context.cropZones, isDetectionRunning]);

  const detect = useCallback(async (net, detectImage, cubicleIndex) => {
    try {
      const imgWidth = detectImage.width;
      const imgHeight = detectImage.height;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imgWidth;
      canvas.height = imgHeight;

      ctx.drawImage(detectImage, 0, 0, imgWidth, imgHeight);

      // Log the cropped image being analyzed
      console.log(`Analyzing Cubicle ${cubicleIndex + 1}:`, {
        imageWidth: imgWidth,
        imageHeight: imgHeight,
        imageSrc: croppedImage ? croppedImage.substring(0, 50) + '...' : 'N/A'
      });

      const obj = await net.detect(canvas);

      console.log(`Detection results for Cubicle ${cubicleIndex + 1}:`, obj);

      let countPeople = 0;
      obj.forEach((element) => {
        if (element.class === 'person') {
          countPeople++;
        }
      });

      console.log(`No. of people in Cubicle ${cubicleIndex + 1}: ${countPeople}`);

      // Update status in context directly
      const currentStatus = [...context.status];
      const newStatus = countPeople >= 1 ? 1 : 0;

      if (currentStatus[cubicleIndex] !== newStatus) {
        currentStatus[cubicleIndex] = newStatus;
        context.updateStatus(currentStatus);
        console.log(`Updated Cubicle ${cubicleIndex + 1} status to ${newStatus}`, currentStatus);
      }

      // Display the result on the webpage
      const resultContainer = document.getElementById('result-container');
      const cubicleNum = cubicleIndex + 1;
      const statusText = countPeople >= 1 ? 'OCCUPIED' : 'AVAILABLE';
      const statusClass = countPeople >= 1 ? 'text-danger' : 'text-success';

      resultContainer.innerHTML = `
        <div class="alert ${countPeople >= 1 ? 'alert-danger' : 'alert-success'} mt-3">
          <h5>Cubicle ${cubicleNum} Status: <span class="${statusClass}">${statusText}</span></h5>
          <p class="mb-0">People detected: ${countPeople}</p>
        </div>
      `;

      drawRect(obj, ctx);

      // Display the cropped image being analyzed
      const cropDisplayDiv = document.createElement('div');
      cropDisplayDiv.className = 'mt-3 text-center';
      cropDisplayDiv.innerHTML = '<h6 class="text-muted">Cropped Area Being Analyzed:</h6>';

      const imgElement = new Image();
      imgElement.src = croppedImage;
      imgElement.width = Math.min(imgWidth, 300);
      imgElement.height = imgHeight * (Math.min(imgWidth, 300) / imgWidth);
      imgElement.className = 'img-thumbnail mt-2 border border-primary';
      imgElement.style.maxWidth = '100%';

      cropDisplayDiv.appendChild(imgElement);
      resultContainer.appendChild(cropDisplayDiv);

      // Move to next cubicle after detection completes (only if detection is still running)
      const nextIndex = (cubicleIndex + 1) % allCroppedImages.length;
      setTimeout(() => {
        if (isDetectionRunning) {
          setCurrentCubicleIndex(nextIndex);
          if (allCroppedImages[nextIndex]) {
            setCroppedImage(allCroppedImages[nextIndex]);
          }
        }
      }, 5000); // Wait 5 seconds before moving to next cubicle
    } catch (error) {
      console.error(`Error during detection for Cubicle ${cubicleIndex + 1}:`, error);
      // Even on error, move to next cubicle (only if detection is still running)
      const nextIndex = (cubicleIndex + 1) % allCroppedImages.length;
      setTimeout(() => {
        if (isDetectionRunning) {
          setCurrentCubicleIndex(nextIndex);
          if (allCroppedImages[nextIndex]) {
            setCroppedImage(allCroppedImages[nextIndex]);
          }
        }
      }, 5000);
    }
  }, [allCroppedImages, context, croppedImage, isDetectionRunning]);

  const runCoco = useCallback(async (detectImage, cubicleIndex) => {
    if (!modelLoaded || !cocoModel) {
      console.warn('Model not loaded yet, skipping detection');
      return;
    }
    detect(cocoModel, detectImage, cubicleIndex);
  }, [modelLoaded, cocoModel, detect]);

  useEffect(() => {
    if (croppedImage && allCroppedImages.length > 0 && modelLoaded && isDetectionRunning) {
      const detectImage = new Image();
      detectImage.src = croppedImage;
      detectImage.onload = () => runCoco(detectImage, currentCubicleIndex);
      detectImage.onerror = (error) => {
        console.error(`Error loading cropped image for Cubicle ${currentCubicleIndex + 1}:`, error);
      };
    }
  }, [croppedImage, currentCubicleIndex, modelLoaded, isDetectionRunning, allCroppedImages.length, runCoco]);




  return (
    <div>
      {/* Model Loading Indicator */}
      {!modelLoaded && (
        <div className="alert alert-info text-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading AI detection model...
        </div>
      )}

      {/* Detection Control Buttons */}
      <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        <button
          className="btn btn-success btn-lg"
          onClick={handleStartDetection}
          disabled={!modelLoaded || isDetectionRunning}
        >
          <i className="bi bi-play-circle-fill me-2"></i>
          Start Detection
        </button>
        <button
          className="btn btn-danger btn-lg"
          onClick={handleStopDetection}
          disabled={!isDetectionRunning}
        >
          <i className="bi bi-stop-circle-fill me-2"></i>
          Stop Detection
        </button>
        <button
          className={`btn btn-lg ${showCroppedZones ? 'btn-warning' : 'btn-outline-warning'}`}
          onClick={() => setShowCroppedZones(!showCroppedZones)}
        >
          <i className={`bi ${showCroppedZones ? 'bi-eye-slash-fill' : 'bi-eye-fill'} me-2`}></i>
          {showCroppedZones ? 'Hide' : 'Show'} Cropped Zones
        </button>
      </div>

      {/* Detection Status Indicator */}
      {isDetectionRunning && (
        <div className="alert alert-success text-center">
          <i className="bi bi-activity me-2"></i>
          <strong>Detection Active</strong> - Scanning cubicles every 5 seconds...
        </div>
      )}

      {!isDetectionRunning && modelLoaded && (
        <div className="alert alert-secondary text-center">
          <i className="bi bi-pause-circle me-2"></i>
          Detection is stopped. Click "Start Detection" to begin scanning.
        </div>
      )}

      <div id="result-container" className='d-flex justify-content-center'></div>

      {/* Display all cropped zones for debugging */}
      {showCroppedZones && allCroppedImages.length > 0 && (
        <div className="mt-4">
          <h5 className="text-center mb-3">
            All Cropped Detection Zones
            <span className="badge bg-info ms-2">{allCroppedImages.length} zones</span>
          </h5>
          <div className="row">
            {allCroppedImages.map((imgSrc, idx) => (
              <div key={idx} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                <div className="card">
                  <div className="card-header bg-secondary text-white text-center">
                    <strong>Cubicle {idx + 1}</strong>
                    {currentCubicleIndex === idx && modelLoaded && isDetectionRunning && (
                      <span className="badge bg-success ms-2">Analyzing...</span>
                    )}
                  </div>
                  <div className="card-body p-2">
                    <img
                      src={imgSrc}
                      alt={`Cubicle ${idx + 1} crop`}
                      className={`img-fluid border ${currentCubicleIndex === idx && isDetectionRunning ? 'border-success border-3' : 'border-primary'}`}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}




