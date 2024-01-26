import React, { useState, useEffect , useContext} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "./utilities";
import imageSrc from './assets/seating.jpg';
import StatusContext from './Contexts/statusContext';

export function FixedCropExample(props) {
  const [croppedImage, setCroppedImage] = useState(null);
  const [index, setIndex] = useState(0); 
  const context= useContext(StatusContext);
  const [newArray, setNewArray] = useState(context.status);


  useEffect(() => {
    makeFixedCrop();
  }, []); // Run once on component mount

  useEffect(() => {
    console.log("Updated status in child:",context.status);

  }, [context.status]);
//   
// const data = useContext(statusContext);
// console.log('data children: ', data.status);

  const makeFixedCrop = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable cross-origin image access if needed
    img.src = imageSrc;

    img.onload = () => {
      const IMG_WIDTH = 100;
      const IMG_HEIGHT = 200;

      const canvas1 = document.createElement('canvas');
      const ctx1 = canvas1.getContext('2d');
      canvas1.width = IMG_WIDTH;
      canvas1.height = IMG_HEIGHT;
      ctx1.drawImage(img, 50, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);

      const canvas2 = document.createElement('canvas');
      const ctx2 = canvas2.getContext('2d');
      canvas2.width = IMG_WIDTH;
      canvas2.height = IMG_HEIGHT;
      ctx2.drawImage(img, 150, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);

      const canvas3 = document.createElement('canvas');
      const ctx3 = canvas3.getContext('2d');
      canvas3.width = IMG_WIDTH;
      canvas3.height = IMG_HEIGHT;
      ctx3.drawImage(img, 240, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);

      const canvas4 = document.createElement('canvas');
      const ctx4 = canvas4.getContext('2d');
      canvas4.width = IMG_WIDTH;
      canvas4.height = IMG_HEIGHT;
      ctx4.drawImage(img, 330, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);
      
      const canvas5 = document.createElement('canvas');
      const ctx5 = canvas5.getContext('2d');
      canvas5.width = IMG_WIDTH;
      canvas5.height = IMG_HEIGHT;
      ctx5.drawImage(img, 415, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);
      
      const canvas6 = document.createElement('canvas');
      const ctx6 = canvas6.getContext('2d');
      canvas6.width = IMG_WIDTH;
      canvas6.height = IMG_HEIGHT;
      ctx6.drawImage(img, 510, 110, 100, 200, 0, 0, IMG_WIDTH, IMG_HEIGHT);
      
      // Repeat the above process for canvas3 to canvas6...
      
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
    try {
      const imgWidth = detectImage.width;
      const imgHeight = detectImage.height;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imgWidth;
      canvas.height = imgHeight;

      ctx.drawImage(detectImage, 0, 0, imgWidth, imgHeight);

      const obj = await net.detect(canvas);

      console.log(obj);

      let countPeople = 0;
      obj.forEach((element) => {
        if (element.class === 'person') {
          countPeople++;
        }
      });

      console.log("No. of people in the image " + countPeople);

    //   const newArray= props.status;

      if (countPeople>=1 && newArray[index]!==1){
        setNewArray(prevArray => {
            const updatedArray = [...prevArray];
            updatedArray[index] = 1;
            context.updateStatus(updatedArray);
            console.log("NEWARR: " + updatedArray);
            console.log("Context: " + context.status);
            return updatedArray;
          });

      }


       

      // Display the result on the webpage
      const resultContainer = document.getElementById('result-container');
      resultContainer.innerHTML = `No. of people in the image ${index+1}: ${countPeople}`;

      index>5?setIndex(0):setIndex(index+1);
      drawRect(obj, ctx);

      // Display the cropped image
      const imgElement = new Image();
      imgElement.src = croppedImage;
      imgElement.width = imgWidth;
      imgElement.height = imgHeight;

      resultContainer.appendChild(imgElement);
    } catch (error) {
      console.error("Error during detection:", error);
    }
  };

  useEffect(() => {
    if (croppedImage) {
      const detectImage = new Image();
      detectImage.src = croppedImage;
      detectImage.onload = () => runCoco(detectImage);
    }
  }, [croppedImage]);


  

  return (
    <div>
      <div id="result-container" className='d-flex justify-content-center'></div>
    </div>
  );
}




