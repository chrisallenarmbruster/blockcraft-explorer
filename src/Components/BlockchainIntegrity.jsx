import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockchainIntegrity } from "../store/blockchainIntegritySlice";
import { resetError } from "../store/blockchainIntegritySlice";
import { Container, Alert, Button, ListGroup } from "react-bootstrap";
import ValidationIcon from "./ValidationIcon";

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

  const uniqueFailingBlocksCount = validationErrors.reduce((acc, error) => {
    return acc.add(error.blockNumber);
  }, new Set()).size;

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
      <ListGroup variant="flush" className="border-0">
        <ValidationIcon
          isValid={isValid}
          label={`Overall Validation: ${blockCount} blocks analyzed,  ${
            blockCount - uniqueFailingBlocksCount
          } passed, ${uniqueFailingBlocksCount} failed.`}
        />
        <ValidationIcon
          isValid={areHashesValid}
          label="Block Hash Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "hash"
          )}
        />
        <ValidationIcon
          isValid={arePreviousHashesValid}
          label="Previous Hash Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "previousHash"
          )}
        />
        <ValidationIcon
          isValid={areTimestampsValid}
          label="Timestamp Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "timestamp"
          )}
        />
        <ValidationIcon
          isValid={areIndexesValid}
          label="Index Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "index"
          )}
        />
      </ListGroup>
    </Container>
  );
};

export default BlockchainIntegrity;
