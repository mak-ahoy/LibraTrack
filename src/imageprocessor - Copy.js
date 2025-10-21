import React, { useRef, useState, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageSrc from './assets/seating.jpg';
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "./utilities";

export function CroppedImage({ src }) {
  return <img src={src} alt="Cropped" />;
}

export function Detector(props) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  let detectImage = imageSrc;
  const [crop, setCrop] = useState(null);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const fixedPositions = {
    0: {
        unit: '%',
        x: 10 , 
        y: 25 ,
        width: 15,
        height: 50
      },
    1: {
        unit: '%',
        x: 25 ,
        y: 25 ,
        width: 15,
        height: 50
      },
    2: {
        unit: '%',
        x: 40 ,
        y: 25 ,
        width: 15,
        height: 50
      },
    3: {
        unit: '%',
        x: 55 ,
        y: 25 , 
        width: 15,
        height: 50
      },
    4: {
        unit: '%',
        x: 70,
        y: 25 ,
        width: 15,
        height: 50
      },
    5: {
        unit: '%',
        x: 85 ,
        y: 25,
        width: 15,
        height: 50
      }
  }

  const [initialCrop, setInitialCrop] = useState(fixedPositions[0]);

  // const [initialCrop, setInitialCrop] = useState({
  //   unit: '%',
  //   x: 10,
  //   y: 25,
  //   width: 15,
  //   height: 50
  // });






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
    }
  };

  const runCoco = async (detectImage) => {
    await tf.setBackend('webgl');
    await tf.ready();

    const net = await cocossd.load();
    detect(net, detectImage);
  };

  const detect = async (net, detectImage) => {

    // console.log(detectImage.width+ detectImage.height)
    try{
    if (detectImage.complete && detectImage.naturalWidth > 0 && detectImage.naturalHeight > 0) {
      const imgWidth = detectImage.width;
      const imgHeight = detectImage.height;

      imageRef.current=detectImage

      const croppedCanvasNew = document.createElement('canvas');
      croppedCanvasNew.width = imgWidth;
      croppedCanvasNew.height = imgHeight;
      
  
      if (imageRef.current.height > 0 && imageRef.current.width > 0 && detectImage) {
        console.log("x: "+initialCrop.x+ " y: "+initialCrop.y)
        console.log("Detecting img...");
        const obj = await net.detect(detectImage);
  
        console.log(obj);
  
        let countPeople = 0;
        obj.forEach((element) => {
          if (element.class === 'person') {
            countPeople++;
          }
        });
  
        console.log("No. of people in the image " + countPeople);
  
        const ctx = croppedCanvasNew.getContext('2d');
        // Clear previous drawings
        ctx.clearRect(0, 0, imgWidth, imgHeight);

        // Draw the original image
        ctx.drawImage(detectImage, 0, 0, imgWidth, imgHeight);
  
        drawRect(obj, ctx);

       

        

        // Draw rectangles on the image
        drawRect(obj, ctx);

        // Set the new image as the new cropped image
        // setCroppedImage(imageRef.current.toDataURL('image/jpeg'));

      }
       
      else {
        console.log("Dimensions error!");
      }
    } 
    
    else {
      console.error("Image not fully loaded");
    }
  }

  catch (error) {
    console.error("Error accessing image properties:", error);
  }

  };

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setImage(img);
  }, []);

  useEffect(() => {
    // console.log(croppedImage)
    
    if (croppedImage) {
    // console.log(croppedImage)

      detectImage = new Image();
      detectImage.src = croppedImage;
      detectImage.onload = () => runCoco(detectImage);
    }
  }, [croppedImage]);

  return (
    <div>
      <ReactCrop
        crop={initialCrop}
        locked={true}
        onChange={(c) => setInitialCrop(c)}
        onComplete={(c) => onCropComplete(c)}
      >
        <img src={imageSrc} alt="Original" ref={imageRef} />
      </ReactCrop>

      <div className='d-flex justify-content-center'>
        {croppedImage && <CroppedImage src={croppedImage} />}
       
      </div>

      {/* <img
            ref={imageRef}
            src={croppedImage}
            alt="Help"
            className="w-50"
          /> */}
    </div>
  );
}
