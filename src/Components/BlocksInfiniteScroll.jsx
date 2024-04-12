import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlocks } from "../store/blocksSlice";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

const InfiniteScrollBlocks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blocks, isLoading, nextIndexReference, error } = useSelector(
    (state) => state.blocks
  );
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!blocks.length && !isLoading) dispatch(fetchBlocks({}));
  }, [blocks.length, isLoading, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      // You might need to adjust this condition to better fit your needs
      if (scrollHeight - scrollTop <= clientHeight * 1.5 && !fetching) {
        setFetching(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetching]);

  useEffect(() => {
    if (fetching && nextIndexReference) {
      dispatch(fetchBlocks({ startWithIndex: nextIndexReference }));
      setFetching(false);
    }
  }, [fetching, nextIndexReference, dispatch]);

  const handleRowClick = (blockIndex) => {
    navigate(`/blocks/${blockIndex}`);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <>
      <style>
        {`
          .block-row:hover {
            cursor: pointer;
            background-color: rgba(13, 202, 240, 0.25); 
          }
        `}
      </style>
      <div>
        {blocks.length > 0 && !isLoading && !error && (
          <>
            <Row className="fw-bold mt-3 d-none d-md-flex">
              <Col sm={12} md={2}>
                Index
              </Col>
              <Col sm={12} md={2}>
                Creator
              </Col>
              <Col sm={12} md={4} lg={3}>
                Timestamp
              </Col>
              <Col sm={12} md={4} lg={3}>
                Hash
              </Col>
            </Row>
            <hr className="d-none d-md-flex"></hr>
          </>
        )}
        {blocks.map((block, index) => (
          <Row
            key={index}
            className="my-2 block-row"
            onClick={() => handleRowClick(block.index)}
          >
            <Col sm={12} md={2} title="Block Index">
              Block {block.index}
            </Col>
            <Col sm={12} md={2} title="Block Creator">
              {block.blockCreator}
            </Col>
            <Col sm={12} md={4} lg={3} title="Timestamp">
              {formatDate(block.timestamp).split(",")[0]} -{" "}
              {formatDate(block.timestamp).split(",")[1]}
            </Col>
            <Col sm={12} md={4} lg={3} title={`Hash: ${block.hash}`}>
              {block.hash.slice(0, 5)}...{block.hash.slice(-5)}
            </Col>
          </Row>
        ))}
        {isLoading && <p>Loading more blocks...</p>}
        {error && <p>Error fetching blocks: {error}</p>}
      </div>
    </>
  );
};

export default InfiniteScrollBlocks;
