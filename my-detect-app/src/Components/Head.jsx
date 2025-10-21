import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useContext } from 'react';
import  NewContext from '../Contexts/statusContext';


function Head(props) {
  const context = useContext(NewContext);

  useEffect(()=>{
     console.log("Head changed!");
    console.log(context.status);
  }, [context.status])


  return (
    <div className='container mt-4'>
        <div className="jumbotron bg-light p-4 rounded">
          <h1 className="display-5">{props.title}</h1>
          <hr className="my-4" />
          <p className="lead">
            LibraTrack is an advanced AI-powered occupancy detection system that uses cutting-edge computer vision
            and machine learning to provide real-time library cubicle availability. Monitor space utilization
            and find available study spots instantly!
          </p>
          <div className="alert alert-info mt-3">
            <strong>How it works:</strong> Our system uses TensorFlow.js and COCO-SSD object detection to automatically
            detect occupancy in library cubicles through camera feeds, providing you with accurate, real-time availability status.
          </div>
        </div>
    </div>
  )
}

Head.propTypes = {
  title: PropTypes.string,
  };



export default Head
