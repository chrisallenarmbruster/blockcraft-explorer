import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlocks, resetBlocks } from "../store/blocksSlice";
import { Button, Alert, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Blocks = () => {
  const { blocks, meta, isLoading, error } = useSelector(
    (state) => state.blocks
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchBlocks({
        scope: "all",
        sort: "desc",
        page: currentPage,
        pageLimit: 30,
      })
    );

    return () => {
      dispatch(resetBlocks());
    };
  }, [dispatch, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < meta.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading)
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );

  if (error)
    return (
      <Alert
        variant="danger"
        onClose={() => dispatch(resetError())}
        dismissible
      >
        {error}
      </Alert>
    );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleRowClick = (blockIndex) => {
    navigate(`/blocks/${blockIndex}`);
  };

  return (
    <div className="mb-5">
      <h2 className="h3 mb-4">Blocks</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Block Index</th>
            <th>Creator</th>
            <th>Timestamp</th>
            <th>Hash</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block, index) => (
            <tr key={index} onClick={() => handleRowClick(block.index)}>
              <td>
                <Link to={`/blocks/${block.index}`} className={`link-info`}>
                  {block.index}
                </Link>
              </td>
              <td>{block.blockCreator}</td>
              <td>
                {" "}
                {formatDate(block.timestamp).split(",")[0]} -{" "}
                {formatDate(block.timestamp).split(",")[1]}
              </td>
              <td title={`Hash: ${block.hash}`}>
                {block.hash.slice(0, 5)}...{block.hash.slice(-5)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex flex-column flex-md-row justify-content-between">
        <span className="me-3">
          Total Blocks: {meta.total || 0}
          {"  |  "}
          Page {currentPage} of {meta.pages || 1}
        </span>
        <span>
          <Button
            onClick={handlePrevPage}
            className="me-1"
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === meta.pages}
          >
            Next
          </Button>
        </span>
      </div>
    </div>
  );
};

export default Blocks;
