import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockchainIntegrity } from "../store/blockchainIntegritySlice";
import { resetError } from "../store/blockchainIntegritySlice";
import { Container, Alert, Button } from "react-bootstrap";

const BlockchainIntegrity = () => {
  const dispatch = useDispatch();
  const {
    isValid,
    blockCount,
    areHashesValid,
    arePreviousHashesValid,
    areTimestampsValid,
    areIndexesValid,
    validationErrors,
    isLoading,
    error,
  } = useSelector((state) => state.blockchainIntegrity);

  useEffect(() => {
    dispatch(fetchBlockchainIntegrity());
    return () => {
      if (error) {
        dispatch(resetError());
      }
    };
  }, [dispatch, error]);

  const handleRefresh = () => {
    dispatch(fetchBlockchainIntegrity());
  };

  if (isLoading) return <div>Loading integrity data...</div>;

  if (error) {
    return (
      <Alert variant="danger" className="d-flex align-items-center">
        Error fetching integrity data: {error}{" "}
        <Button variant="link" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise"></i>
        </Button>
      </Alert>
    );
  }

  return (
    <Container>
      {isValid ? (
        <p>The blockchain is valid</p>
      ) : (
        <p>The blockchain is not valid</p>
      )}
    </Container>
  );
};

export default BlockchainIntegrity;
