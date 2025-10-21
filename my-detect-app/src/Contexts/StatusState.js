import { useState } from 'react'
import StatusContext from './statusContext'
import defaultImage from '../assets/library_cubicles.png'


const StatusState = (props) => {
    const [status, setStatus] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 15 cubicles
    const [cropZones, setCropZones] = useState([
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
    ]);
    const [cameraFeed, setCameraFeed] = useState(defaultImage);

    const updateStatus = (newStatus) =>{
        setStatus(newStatus);
    }

    const updateCropZones = (newCropZones) => {
        setCropZones(newCropZones);
        console.log('Crop zones updated:', newCropZones);
    }

    const addCubicle = () => {
        // Add a new cubicle with default crop zone
        const newCropZone = { unit: '%', x: 5, y: 10, width: 15, height: 25 };
        setCropZones([...cropZones, newCropZone]);
        setStatus([...status, 0]);
        console.log('Added new cubicle. Total cubicles:', cropZones.length + 1);
    }

    const removeCubicle = (index) => {
        if (cropZones.length <= 1) {
            alert('Cannot remove the last cubicle. At least one cubicle must remain.');
            return;
        }
        const newCropZones = cropZones.filter((_, i) => i !== index);
        const newStatus = status.filter((_, i) => i !== index);
        setCropZones(newCropZones);
        setStatus(newStatus);
        console.log('Removed cubicle at index:', index, 'Remaining cubicles:', newCropZones.length);
    }

    const updateCameraFeed = (imageSource) => {
        setCameraFeed(imageSource);
        console.log('Camera feed updated');
    }

    return (
    <StatusContext.Provider value={{status, updateStatus, cropZones, updateCropZones, addCubicle, removeCubicle, cameraFeed, updateCameraFeed}}>
        {props.children}
    </StatusContext.Provider>
    );
}

export default StatusState;
