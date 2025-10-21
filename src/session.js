import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import scanImg from './assets/seating.jpg';
import * as cocossd from "@tensorflow-models/coco-ssd";
import "./App.css";
import { drawRect } from "./utilities";
import Navbar from "./Components/Navbar";
import Container from "./Components/Head";
import Seating from "./Components/Seating";
import { ImageProcessor } from "./imageprocessor";

function App() {
  const canvasRef = useRef(null);
  const imageRef  = useRef(null);
  const [croppedImage, setCroppedImage] = useState(scanImg);
  const [ImgSrc, setImgSrc] = useState(scanImg);
  const status = [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0];
  let Img=new Image();
  Img.src= scanImg; 
  // const [image, setImage] = useState(null);

  const runCoco = async () => {
    await tf.setBackend("webgl");
    await tf.ready(); // Wait for TensorFlow.js to be ready

    const net = await cocossd.load();
    setInterval(() => {
      detect(net);
    }, 3000);
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const detect = async (net) => {
    
    // console.log("Hello duck1 "+Img);
    if (Img) {
    console.log("Hello duck2");

      const imgWidth = Img.width;
      const imgHeight = Img.height;

      canvasRef.current.width = imgWidth;
      canvasRef.current.height = imgHeight;

      // let imageDetect = imageRef.current;
      console.log("magic in the air")
      console.log(croppedImage);
      if (croppedImage) {
      
        Img = new Image();
        Img.src = croppedImage;
        // imageDetect = img;
        console.log(croppedImage.width)
        imageRef.current=Img;
        canvasRef.current.width = Img.width;
        canvasRef.current.height = Img.height;
        console.log("New img" + Img + " "+ Img.src);
        setImgSrc(Img.src)


        console.log(imageRef.current.height+" "+imageRef.current.width+" "+Img)
        if (imageRef.current.height>0 && imageRef.current.width>0 && Img){
        console.log("Detecting img...")
        const obj = await net.detect(Img);
  
        console.log(obj);
  
        let countPeople = 0;
        obj.forEach((element) => {
          if (element.class === 'person') {
            countPeople++;
          }
        });
  
        console.log("No. of people in the image " + countPeople);
  
        const ctx = canvasRef.current.getContext("2d");
  
        
        drawRect(obj, ctx);
        }
        
      }

    

      else{
        console.log("Dimentions error")
      }
      
    }
  };

  useEffect(() => {
    runCoco();
  }, [croppedImage]);

  return (
    <>
      <Navbar />

      <div className="App">
        <Container title="Welcome" />
        <br />
        <Seating status={status} />

        <ImageProcessor croppedImage={croppedImage} setCroppedImage={setCroppedImage} />

        <header className="App-header">
          {/* <img
            ref={imageRef}
            src={ImgSrc}
            alt="display"
            className="w-50"
          /> */}

<img
            ref={imageRef}
            src={croppedImage}
            alt="Help"
            className="w-50"
          />
          {console.log(typeof(Img))}


          
          

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
    </>
  );
}

export default App;


//image processor 

import React, { useState, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageSrc from './assets/seating.jpg';
import * as tf from "@tensorflow/tfjs";
import { drawRect } from "./utilities";

export function CroppedImage({ src }) {
  return <img src={src} alt="Cropped" />;
}

export function ImageProcessor(props) {
  
//   console.log(imageSrc);
  const [crop, setCrop] = useState(null);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);


  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setImage(img);
  }, []);

  const [initialCrop, setInitialCrop] = useState({
    unit: '%',
    x: 10,
    y: 25,
    width: 15,
    height: 50
  });

  const onCropComplete = (crop) => {
    makeClientCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (image && crop.width && crop.height) {
      const croppedCanvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      croppedCanvas.width = crop.width;
      croppedCanvas.height = crop.height;
      const ctx = croppedCanvas.getContext('2d');

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      // Get the cropped image as a data URL
      const croppedImageDataUrl = croppedCanvas.toDataURL('image/jpeg');
      setCroppedImage(croppedImageDataUrl);

    //   console.log("Hello!: "+croppedImage)
    //   console.log("Bye: "+ croppedCanvas)q
    //   const context= croppedCanvas.getContext('2d')
      
      // console.log(croppedCanvas);
      props.setCroppedImage(croppedImage);
      
      // console.log(croppedImage)
    
      // return "Cropped Canvas "+ croppedCanvas;

      
    //   croppedImageToReturn.src= croppedImage;
      
    }
  };

//   console.log(croppedImage);

   return     (
    <div>
      {/* {image && (
        <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
          <img src={image.src} alt="Original" />
        </ReactCrop>
      )} */}

      <ReactCrop
        crop={initialCrop}
        locked={true}
        onChange={(c) => setInitialCrop(c)}
        onComplete={(c) => onCropComplete(c)}
      >
        {console.log(initialCrop.x)}
      <img src={imageSrc} alt="Original" />
      </ReactCrop>
      <div className='d-flex justify-content-center'> 
      {croppedImage && <CroppedImage src={croppedImage} />}

      </div>
    
    {/* return <img src={croppedImage} alt="Cropped" />; */}
      


    </div>
    
 );
}
