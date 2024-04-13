/*
  File: BlocksInfiniteScroll.jsx
  Description: 
  This component renders a list of blocks with infinite scrolling. It fetches blocks 
  from the Redux store and displays them in a list. When the user scrolls to the bottom 
  of the list, the component fetches more blocks and appends them to the list.

  The component uses the `useSelector` hook to access the blocks, loading state, next 
  index reference, and error message from the Redux store. It uses the `useDispatch` 
  hook to dispatch the `fetchBlocks` action.

  The component uses the `useEffect` hook to fetch blocks when the component mounts and 
  whenever the user scrolls to the bottom of the page. It also uses the `useEffect` hook 
  to remove the scroll event listener when the component unmounts.

  The component includes a `handleRowClick` function that navigates to the block's 
  detail page when a block row is clicked, and a `formatDate` function that formats 
  the block's timestamp into a human-readable format.

  The component renders a list of blocks, each block in a row. Each row includes the 
  block's index, creator, timestamp, and hash. The component also renders a loading 
  message when more blocks are being fetched, and an error message if there was an 
  error fetching blocks.
*/

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
