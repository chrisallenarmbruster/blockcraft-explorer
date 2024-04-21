/*
  File: ValidationIcon.jsx
  Description: This component displays a validation icon along with a label. If the validation fails, it also displays an alert with the details of the related errors. The icon, label, and errors are passed as props to the component. The icon changes based on the 'isValid' prop, and the alert is only displayed if there are errors.  This component is consumed by the BlockchainIntegrity component. 
*/

import React from "react";
import { Alert, ListGroup } from "react-bootstrap";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";

const ValidationIcon = ({ isValid, label, errors = [] }) => {
  return (
    <ListGroup.Item className="border-0">
      <span className="me-3">
        {isValid ? (
          <BiCheckCircle className="text-success" size={32} />
        ) : (
          <BiXCircle className="text-danger" size={32} />
        )}
      </span>
      <span className="fw-bold">{label}</span>
      {errors.length > 0 && (
        <Alert variant="danger" className="ms-4 mt-3">
          {errors.map((error, index) => (
            <p key={index} className="my-0">
              Block {error.blockNumber} failed {error.errorType} validation test
            </p>
          ))}
        </Alert>
      )}
    </ListGroup.Item>
  );
};

export default ValidationIcon;
