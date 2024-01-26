import React, { useContext, useEffect, useState} from 'react';
import  NewContext from '../Contexts/statusContext';

const available= "table-success"
const booked= "table-danger"



function Seating() {

  // useEffect(() => {
  //   console.log("Updated props.status in child:", props.status);
  // }, [props.status]);

    // useEffect(() => {
    //   console.log(props.status);
    //   props.setStatus(props.status);
    // }, [props.status]); 
    const context = useContext(NewContext)
    let props= context;

  return (
    <div className="text-center mt-5 container"> 
      <h1 className="display-4 mb-4">Seating Chart</h1>
      <div className="table-responsive"> 
        <table className="table table-bordered text-center table-dark">
          <thead>
            <tr>
              <th scope="col"></th>
              <th colSpan="6" scope="col"> 
                Seating Plan For Classroom
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Number</td>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
            </tr>
            <tr>
              <td>Availability:</td> 
              <td className={props.status[0]?booked:available}>{props.status[0]?"Booked":"Available"}</td>
              <td className={props.status[1]?booked:available}>{props.status[1]?"Booked":"Available"}</td>
              <td className={props.status[2]?booked:available}>{props.status[2]?"Booked":"Available"}</td>
              <td className={props.status[3]?booked:available}>{props.status[3]?"Booked":"Available"}</td>
              <td className={props.status[4]?booked:available}>{props.status[4]?"Booked":"Available"}</td>
              <td className={props.status[5]?booked:available}>{props.status[5]?"Booked":"Available"}</td>
            </tr>

            <tr>
              <td>Number</td>
              <td>7</td>
              <td>8</td>
              <td>9</td>
              <td>10</td>
              <td>11</td>
              <td>12</td>
            </tr>

            <tr>
              <td>Availability:</td>
              <td className={props.status[6]?booked:available}>{props.status[6]?"Booked":"Available"}</td>
              <td className={props.status[7]?booked:available}>{props.status[7]?"Booked":"Available"}</td>
              <td className={props.status[8]?booked:available}>{props.status[8]?"Booked":"Available"}</td>
              <td className={props.status[9]?booked:available}>{props.status[9]?"Booked":"Available"}</td>
              <td className={props.status[10]?booked:available}>{props.status[10]?"Booked":"Available"}</td>
              <td className={props.status[11]?booked:available}>{props.status[11]?"Booked":"Available"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> 
  );
}


export default Seating