import React, { useRef, useState, useEffect } from 'react';
import imageSrc from './assets/seating.jpg';
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "./utilities";

export function FixedCropExample() {
  const [croppedImage, setCroppedImage] = useState(null);

  useEffect(() => {
    makeFixedCrop();
  }, []); // Run once on component mount

  const makeFixedCrop = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable cross-origin image access if needed
    img.src = imageSrc;

    img.onload = () => {
      const IMG_WIDTH = 100;
      const IMG_HEIGHT = 200;

      const canvas1 = document.createElement('canvas');
      const canvas2 = document.createElement('canvas');
      const canvas3 = document.createElement('canvas');
      const canvas4 = document.createElement('canvas');
      const canvas5 = document.createElement('canvas');
      const canvas6 = document.createElement('canvas');

      const ctx1 = canvas1.getContext('2d');
      const ctx2 = canvas2.getContext('2d');
      const ctx3 = canvas3.getContext('2d');
      const ctx4 = canvas4.getContext('2d');
      const ctx5 = canvas5.getContext('2d');
      const ctx6 = canvas6.getContext('2d');

      canvas1.width = IMG_WIDTH; // Set the desired width
      canvas1.height = IMG_HEIGHT; // Set the desired height

      canvas2.width = IMG_WIDTH; // Set the desired width
      canvas2.height = IMG_HEIGHT; // Set the desired height

      canvas3.width = IMG_WIDTH; // Set the desired width
      canvas3.height = IMG_HEIGHT; // Set the desired height

      canvas4.width = IMG_WIDTH; // Set the desired width
      canvas4.height = IMG_HEIGHT; // Set the desired height

      canvas5.width = IMG_WIDTH; // Set the desired width
      canvas5.height = IMG_HEIGHT; // Set the desired height

      canvas6.width = IMG_WIDTH; // Set the desired width
      canvas6.height = IMG_HEIGHT; // Set the desired height

      ctx1.drawImage(img, 50, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);
      ctx2.drawImage(img, 150, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);
      ctx3.drawImage(img, 240, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);
      ctx4.drawImage(img, 330, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);
      ctx5.drawImage(img, 415, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);
      ctx6.drawImage(img, 510, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);

      // Convert the canvas to a data URL
      const dataURL1 = canvas1.toDataURL('image/jpeg');
      const dataURL2 = canvas2.toDataURL('image/jpeg');
      const dataURL3 = canvas3.toDataURL('image/jpeg');
      const dataURL4 = canvas4.toDataURL('image/jpeg');
      const dataURL5 = canvas5.toDataURL('image/jpeg');
      const dataURL6 = canvas6.toDataURL('image/jpeg');

      const dataURLs = [dataURL1, dataURL2, dataURL3, dataURL4, dataURL5, dataURL6];

      let index = 0;

      const intervalId = setInterval(() => {
        setCroppedImage(dataURLs[index]);

        index++;
        if (index === dataURLs.length) {
          clearInterval(intervalId);
        }
      }, 5000);
    };
  };


  const runCoco = async (detectImage) => {
    await tf.setBackend('webgl');
    await tf.ready();

    const net = await cocossd.load();
    detect(net, detectImage);
  };


  const detect = async (net, detectImage) => {
  try{
    if (detectImage.complete && detectImage.naturalWidth > 0 && detectImage.naturalHeight > 0) {
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
    
    if (croppedImage) {
      detectImage = new Image();
      detectImage.src = croppedImage;
      detectImage.onload = () => runCoco(detectImage);
    }
  }, [croppedImage]);



  return (
    <div>
      <div className='d-flex justify-content-center'>
        {croppedImage && <img src={croppedImage} alt="Cropped" />}
      </div>
    </div>
  );
}
