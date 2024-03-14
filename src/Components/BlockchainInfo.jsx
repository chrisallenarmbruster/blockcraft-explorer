import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockchainInfo } from "../store/blockchainInfoSlice";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const BlockchainInfo = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    blockchainName,
    bornOn,
    currentHeight,
    difficulty,
    totalSupply,
    isLoading,
    error,
  } = useSelector((state) => state.blockchainInfo);

  useEffect(() => {
    dispatch(fetchBlockchainInfo());
  }, [dispatch, location.pathname]);

  if (isLoading) return <p>Loading blockchain info...</p>;
  if (error) {
    return (
      <Alert variant="danger">Error fetching blockchain info: {error}</Alert>
    );
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Container>
      {!error && (
        <>
          <Row className="mb-3">
            <Col xs={12} md={6} lg={3}>
              <strong>Name:</strong> {blockchainName}
            </Col>
            <Col xs={12} md={6} lg={3}>
              <strong>Born On:</strong> {formatDate(bornOn)}
            </Col>
            <Col xs={12} md={6} lg={3}>
              <strong>Height:</strong> {currentHeight}
            </Col>
            {difficulty && (
              <Col xs={12} md={6} lg={3}>
                <strong>Difficulty:</strong> {difficulty}
              </Col>
            )}
            {!difficulty && <Col lg={3}></Col>}
          </Row>
          {totalSupply !== null && (
            <Row>
              <Col xs={12} lg={{ span: 6, offset: 3 }}>
                <strong>Total Supply:</strong> {totalSupply}
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default BlockchainInfo;
