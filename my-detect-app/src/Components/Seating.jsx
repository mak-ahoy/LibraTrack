import React, { useContext, useEffect} from 'react';
import  NewContext from '../Contexts/statusContext';

const available= "table-success"
const occupied= "table-danger"

function Seating() {
    const context = useContext(NewContext)
    let props= context;

    useEffect(() => {
    }, [props.status]);

    const lastUpdate = new Date();

    // Calculate occupancy statistics
    const totalCubicles = props.status.length;
    const occupiedCount = props.status.filter(status => status === 1).length;
    const availableCount = totalCubicles - occupiedCount;
    const occupancyRate = ((occupiedCount / totalCubicles) * 100).toFixed(1);

  return (
    <div className="text-center mt-4 container">
      <h1 className="display-4 mb-3">Library Cubicle Occupancy</h1>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Cubicles</h5>
              <p className="card-text display-6">{totalCubicles}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Available</h5>
              <p className="card-text display-6">{availableCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5 className="card-title">Occupied</h5>
              <p className="card-text display-6">{occupiedCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Occupancy Rate</h5>
              <p className="card-text display-6">{occupancyRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted">Last updated: {lastUpdate.toLocaleTimeString()}</p>

      {/* Cubicle Grid */}
      <div className="table-responsive">
        <table className="table table-bordered text-center table-dark">
          <thead>
            <tr>
              <th scope="col"></th>
              <th colSpan="5" scope="col">
                Library Cubicle Status
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows = [];
              const cubiclesPerRow = 5;
              const numRows = Math.ceil(totalCubicles / cubiclesPerRow);

              for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
                const startIdx = rowIndex * cubiclesPerRow;
                const rowLabel = String.fromCharCode(65 + rowIndex); // A, B, C, etc.

                rows.push(
                  <tr key={rowIndex}>
                    <td><strong>Row {rowLabel}</strong></td>
                    {Array.from({ length: cubiclesPerRow }).map((_, colIndex) => {
                      const cubicleIndex = startIdx + colIndex;
                      if (cubicleIndex < totalCubicles) {
                        return (
                          <td key={colIndex} className={props.status[cubicleIndex] ? occupied : available}>
                            <div>C{cubicleIndex + 1}</div>
                            <small>{props.status[cubicleIndex] ? "Occupied" : "Available"}</small>
                          </td>
                        );
                      } else {
                        return <td key={colIndex} className="table-secondary"></td>;
                      }
                    })}
                  </tr>
                );
              }

              return rows;
            })()}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-3">
        <span className="badge bg-success me-2">Available</span>
        <span className="badge bg-danger">Occupied</span>
      </div>
    </div>
  );
}

export default Seating