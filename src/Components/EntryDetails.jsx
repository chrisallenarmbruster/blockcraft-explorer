import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchEntryDetails,
  resetSelectedEntry,
} from "../store/entrySelectedSlice";
import { Container, Button } from "react-bootstrap";
import { BsCopy } from "react-icons/bs";

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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log("Failed to copy: ", err);
    }
  };

  return (
    <div>
      <h2 className="h3 mb-3">Entry Details</h2>

      {entry && (
        <div>
          <Container className="font-monospace text-break">
            <p>
              Entry ID: {entry.entryId}
              <Button
                variant="link"
                className="link-info py-0"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(entry.entryId);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
            <p>
              Block Index:{" "}
              {entry.blockIndex === "pending" ? (
                "pending"
              ) : (
                <Link
                  to={`/blocks/${entry.blockIndex}`}
                  className={`link-info`}
                >
                  {entry.blockIndex}
                </Link>
              )}
            </p>
            <p>
              From:{" "}
              <Link
                to={`/entries?publicKey=${entry.from}`}
                className={`link-info text-break text-wrap lh-sm`}
              >
                {entry.from}
              </Link>
              <Button
                variant="link"
                className="link-info py-0"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(entry.from);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
            <p>
              To:{" "}
              <Link
                to={`/entries?publicKey=${entry.to}`}
                className={`link-info text-break text-wrap lh-sm`}
              >
                {entry.to}
              </Link>
              <Button
                variant="link"
                className="link-info py-0"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(entry.to);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
            <p>Type: {entry.type}</p>
            <p>Amount: {entry.amount}</p>
            <p>
              Initiation Timestamp: {entry.initiationTimestamp}:{" "}
              {formatDate(entry.initiationTimestamp)}
            </p>
            <p>
              Data:<br></br>
              {entry.data}
            </p>
            <p>
              Hash: {entry.hash}
              <Button
                variant="link"
                className="link-info py-0"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(entry.hash);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
            <p>
              Signature: {entry.signature}
              <Button
                variant="link"
                className="link-info py-0"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(entry.signature);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
            <p>
              Integrity:{" "}
              <span className={entry.isValid ? "text-success" : "text-danger"}>
                {entry.isValid
                  ? "Hash and Signature pass integrity checks"
                  : "Hash and/or Signature fail integrity checks"}
              </span>
            </p>
          </Container>
        </div>
      )}
    </div>
  );
};

export default EntryDetails;
