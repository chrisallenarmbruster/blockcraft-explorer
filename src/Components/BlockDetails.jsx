import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchBlockDetails } from "../store/blockSelectedSlice"; // Adjust the path as necessary
import { Container, ListGroup } from "react-bootstrap";

const BlockDetails = () => {
  const { blockIndex } = useParams();
  const dispatch = useDispatch();
  const block = useSelector((state) => state.selectedBlock.selectedBlock);
  const isLoading = useSelector((state) => state.selectedBlock.isLoading);
  const error = useSelector((state) => state.selectedBlock.error);

  useEffect(() => {
    console.log(blockIndex);
    dispatch(fetchBlockDetails(blockIndex));
  }, [dispatch, blockIndex]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div>
      <h2 className="h3">Block Details for</h2>

      {block && (
        <div>
          <Container>
            <p>Index: {block.index}</p>
            <p>
              Timestamp: {block.timestamp}: {formatDate(block.timestamp)}
            </p>
            <p>Block Creator: {block.blockCreator}</p>
            <p>Hash: {block.hash}</p>
            <p>Previous Hash: {block.previousHash}</p>
            {Object.keys(block)
              .filter(
                (prop) =>
                  ![
                    "index",
                    "previousHash",
                    "timestamp",
                    "blockCreator",
                    "hash",
                    "data",
                  ].includes(prop)
              )
              .map((key) => (
                <p key={key}>{`${key}: ${block[key]}`}</p>
              ))}
          </Container>
          {block.data && (
            <>
              <h2 className="h3 mt-5">Block Data Entries</h2>
              <Container>
                {Array.isArray(block.data) ? (
                  <ListGroup>
                    {block.data.map((item, index) => (
                      <ListGroup.Item key={index}>
                        {JSON.stringify(item)}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p>{JSON.stringify(block.data)}</p>
                )}
              </Container>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BlockDetails;
