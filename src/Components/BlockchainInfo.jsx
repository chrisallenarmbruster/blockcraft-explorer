/*
  File: BlockchainInfo.jsx
  Description: This component fetches and displays information about the blockchain. It uses the Redux store to manage state and dispatch actions. The information displayed includes the blockchain's name, creation date, current height, difficulty, hash rate, and total supply only when applicable. If there's an error fetching the data, an error message is displayed with a button to retry the fetch operation.
*/

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockchainInfo } from "../store/blockchainInfoSlice";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { resetError } from "../store/blockchainInfoSlice";

const BlockchainInfo = () => {
  const dispatch = useDispatch();
  const {
    blockchainName,
    bornOn,
    currentHeight,
    difficulty,
    hashRate,
    totalSupply,
    isLoading,
    error,
  } = useSelector((state) => state.blockchainInfo);

  useEffect(() => {
    dispatch(fetchBlockchainInfo());
    return () => {
      if (error) {
        dispatch(resetError());
      }
    };
  }, [dispatch, error]);

  const handleRefresh = () => {
    dispatch(fetchBlockchainInfo());
  };

  if (isLoading) return <p>Loading blockchain info...</p>;
  if (error) {
    return (
      <Alert variant="danger" className="d-flex align-items-center">
        Error fetching blockchain info: {error}{" "}
        <Button variant="link" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise"></i>
        </Button>
      </Alert>
    );
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Container>
      {!error && (
        <Row className="align-items-center gy-2 gx-5">
          {" "}
          {/* g-2 for some gutter space between items */}
          {blockchainName && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={2}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Name:&nbsp;</strong>
                {blockchainName}
              </span>
            </Col>
          )}
          {bornOn && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={2}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Born On:&nbsp;</strong>
                {formatDate(bornOn)}
              </span>
            </Col>
          )}
          {currentHeight !== null && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={2}
              className="d-flex align-items-center"
            >
              <span className="d-flex align-items-center text-nowrap">
                <strong>Height:&nbsp;</strong>
                {currentHeight}
                <Button variant="link" onClick={handleRefresh}>
                  <i className="bi bi-arrow-clockwise"></i>
                </Button>
              </span>
            </Col>
          )}
          {difficulty && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={2}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Difficulty:&nbsp;</strong>
                {difficulty}
              </span>
            </Col>
          )}
          {hashRate && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={2}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Hash Rate:&nbsp;</strong>
                {parseInt(hashRate)}/s
              </span>
            </Col>
          )}
          {totalSupply !== null && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={2}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Total Supply:&nbsp;</strong>
                {totalSupply}
              </span>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default BlockchainInfo;
