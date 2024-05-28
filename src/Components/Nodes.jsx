import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNodes, resetNodes } from "../store/nodesSlice";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Nodes = () => {
  const dispatch = useDispatch();
  const { nodes, isLoading, error } = useSelector((state) => state.nodes);

  useEffect(() => {
    dispatch(fetchNodes());

    return () => {
      dispatch(resetNodes());
    };
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <h2 className="h3 mb-4">Active Network Nodes</h2>
      <Row>
        {nodes.map((node, index) => (
          <Col key={node.id} sm={12} md={6} lg={4} className="mb-4">
            <a
              href={`http${node.url.includes("localhost") ? "" : "s"}://${
                node.url
              }:${node.webServicePort}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <Card>
                <Card.Header
                  className={`${
                    index === 0 ? "bg-info-highlight" : "bg-info-muted "
                  } border-info`}
                >
                  <Card.Title>
                    {node.label} {index === 0 && "(This Node)"}
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>URL: {node.url}</Card.Text>
                  <Card.Text>Web Service Port: {node.webServicePort}</Card.Text>
                </Card.Body>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Nodes;
