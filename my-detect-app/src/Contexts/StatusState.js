import React, { useContext, useState } from 'react'
import StatusContext from './statusContext'


const StatusState = (props) => {
    const [status, setStatus] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    // const status = "hello"

    const updateStatus = (newStatus) =>{
        setStatus(newStatus);
    }
    
    return (
    <StatusContext.Provider value={{status, updateStatus}}>
        {props.children}
    </StatusContext.Provider>
    );
}

export default StatusState;
