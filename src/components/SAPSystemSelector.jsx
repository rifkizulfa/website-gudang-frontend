import React, { useState } from 'react';
import SAPLoginForm from './SAPLoginForm';
import '../styles/sap-style.css';

const SAPSystemSelector = ({ onLogin }) => {
  const [selectedSystem, setSelectedSystem] = useState(null);

  const handleSelectSystem = (system) => {
    setSelectedSystem(system);
  };

  const handleExit = () => {
    setSelectedSystem(null);
  };

  return (
    <div className="sap-wrapper">
      <div className="sap-container">
        {!selectedSystem ? (
          <>
            <h2 className="sap-title">Select SAP System</h2>
            <div className="sap-button-group">
              <button className="sap-button" onClick={() => handleSelectSystem('PRD-1')}>
                PRD-1
              </button>
              <button className="sap-button" onClick={() => handleSelectSystem('PRD-2')}>
                PRD-2
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="sap-title">Selected System: {selectedSystem}</h2>
            <SAPLoginForm onLogin={onLogin} selectedSystem={selectedSystem} />
            <button className="sap-exit-button" onClick={handleExit}>Exit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default SAPSystemSelector;