import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEntries, resetError, resetEntries } from "../store/entriesSlice";
import { Button, Alert, Spinner, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Entries = () => {
  const { entries, meta, isLoading, error } = useSelector(
    (state) => state.entries
  );
  const dispatch = useDispatch();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);

  const getQueryParams = () => new URLSearchParams(location.search);

  useEffect(() => {
    const publicKey = getQueryParams().get("publicKey");

    dispatch(
      fetchEntries({
        scope: "all",
        sort: "desc",
        page: currentPage,
        pageLimit: 30,
        publicKey: publicKey || undefined,
      })
    );

    return () => {
      dispatch(resetEntries());
    };
  }, [dispatch, currentPage, location.search]);

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

  const formatAddress = (address) => {
    if (!address) {
      return "N/A";
    }

    return address.length >= 11
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;
  };

  return (
    <div className="mb-5">
      <h2 className="h3 mb-4">
        {meta.queriedPublicKey !== "N/A" ? (
          <>
            Entries Related to{" "}
            <span title={meta.queriedPublicKey} className="me-5">
              {formatAddress(meta.queriedPublicKey)}
            </span>
            <br></br>
            <span className="h4">Amount Balance: {meta.netAmount}</span>
          </>
        ) : (
          "Entries"
        )}
      </h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Block Index</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>
                {" "}
                <Link to={`/entries/${entry.entryId}`} className={`link-info`}>
                  {entry.entryId}
                </Link>
              </td>

              <td>
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
              </td>
              <td
                title={entry.from}
                className={
                  entry.from === meta.queriedPublicKey ? "fw-bold" : ""
                }
              >
                {entry.from !== meta.queriedPublicKey ? (
                  <Link
                    to={`/entries?publicKey=${entry.from}`}
                    className={`link-info`}
                  >
                    {formatAddress(entry.from)}
                  </Link>
                ) : (
                  formatAddress(entry.from)
                )}
              </td>
              <td
                title={entry.to}
                className={entry.to === meta.queriedPublicKey ? "fw-bold" : ""}
              >
                {entry.to !== meta.queriedPublicKey ? (
                  <Link
                    to={`/entries?publicKey=${entry.to}`}
                    className={`link-info`}
                  >
                    {formatAddress(entry.to)}
                  </Link>
                ) : (
                  formatAddress(entry.to)
                )}
              </td>
              <td
                className={`${
                  entry.from === meta.queriedPublicKey ? "" : ""
                } text-end`}
              >
                {entry.from === meta.queriedPublicKey
                  ? -entry.amount
                  : entry.amount}
              </td>
              <td>{entry.data}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex flex-column flex-md-row justify-content-between">
        <span className="me-3">
          Total Entries: {meta.total || 0}
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

export default Entries;
