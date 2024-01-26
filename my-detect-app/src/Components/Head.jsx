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
    <div className='container'>
        
        <h1>{props.title}</h1>
        <h3>{context.status}</h3>


        
        
    <p>
    DreTect is an advanced AI classification and detection application that leverages cutting-edge artificial intelligence and machine learning models to provide real-time attendance information for any location. Explore the app and share your valuable feedback! 
</p>
    {/* <p />DreTect is the state of the art AI classification/detection app that use ai and machine learning models to get information about the real time attendace for a place. Enjoy the app and feel free to give any feed back. <br /> Looking forward to connect!  */}
      
    </div>
  )
}

Head.propTypes = {
  title: PropTypes.string,
  };



export default Head
