# LibraTrack

A real-time library occupancy tracking system using AI-powered object detection to monitor cubicle availability.

## Overview

LibraTrack uses TensorFlow.js and the COCO-SSD model to detect people in library cubicles, providing real-time occupancy status. The system processes camera feeds every 5 seconds to determine which seats are available or occupied.

## Features

- **Real-time Object Detection** - Uses TensorFlow.js COCO-SSD model for person detection
- **Configurable Detection Zones** - Define custom crop zones for each cubicle
- **Visual Status Dashboard** - Color-coded indicators (green = available, red = occupied)
- **Live Camera Feed** - Monitor library spaces in real-time
- **Session Management** - Track occupancy patterns over time

## Tech Stack

- **React** - Frontend framework
- **TensorFlow.js** - Machine learning library
- **COCO-SSD** - Pre-trained object detection model
- **React Webcam** - Camera integration
- **React Image Crop** - Zone configuration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## How It Works

1. **Configure Zones** - Define detection areas for each cubicle using the Configuration tab
2. **Camera Feed** - The system captures frames from the camera feed
3. **Object Detection** - TensorFlow.js analyzes each zone for person detection
4. **Status Update** - Occupancy status updates every 5 seconds
5. **Visual Display** - Dashboard shows real-time availability

## Project Structure

```
src/
├── Components/        # React components (Navbar, Seating, etc.)
├── Contexts/         # React context for state management
├── assets/           # Images and static files
├── imageprocessor.js # Image processing utilities
├── utilities.js      # Helper functions
└── App.js           # Main application component
```

## Usage

1. Navigate to the **Configure Detection Zones** tab
2. Upload or select your camera feed
3. Draw crop zones around each cubicle
4. Save the configuration
5. Switch to the **Dashboard** tab to view real-time occupancy

## License

This project is licensed under the MIT License.
