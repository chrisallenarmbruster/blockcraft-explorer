import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchEntryDetails,
  resetSelectedEntry,
} from "../store/entrySelectedSlice";
import { Container, ListGroup, Table } from "react-bootstrap";

const EntryDetails = () => {
  const { entryIdentifier } = useParams();

  const dispatch = useDispatch();
  const entry = useSelector((state) => state.selectedEntry.selectedEntry);
  const isLoading = useSelector((state) => state.selectedEntry.isLoading);
  const error = useSelector((state) => state.selectedEntry.error);

  useEffect(() => {
    dispatch(fetchEntryDetails(entryIdentifier));

    return () => {
      dispatch(resetSelectedEntry());
    };
  }, [dispatch, entryIdentifier]);

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    if (error === "Server responded with status: 404") {
      return (
        <p>
          No entry with ID of{" "}
          <span className="text-danger">{entryIdentifier}</span> could be found
          in the chain.
        </p>
      );
    } else {
      return <p>Error: {error}</p>;
    }
  }

  return (
    <div>
      <h2 className="h3 mb-3">Entry Details</h2>

      {entry && (
        <div>
          <Container>
            <p>Entry ID: {entry.entryId}</p>
            <p>
              Block Index:{" "}
              {entry.blockIndex === "pending" ? (
                "pending"
              ) : (
                <Link to={`/blocks/${entry.blockIndex}`}>
                  {entry.blockIndex}
                </Link>
              )}
            </p>
            <p>
              Data:<br></br>
              {entry.data}
            </p>
          </Container>
        </div>
      )}
    </div>
  );
};

export default EntryDetails;
