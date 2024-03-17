import React from "react";
import { Alert, ListGroup } from "react-bootstrap";

const ValidationIcon = ({ isValid, label, errors = [] }) => {
  return (
    <ListGroup.Item className="border-0">
      <span className="me-3">
        {isValid ? (
          <i className="bi bi-check-lg text-success"></i>
        ) : (
          <i className="bi bi-x-lg text-danger"></i>
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
