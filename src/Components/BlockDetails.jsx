/*
  File: BlockDetails.jsx
  Description: 
  This component is responsible for displaying the details of a specific block. 
  It fetches the block details from the Redux store using the block index obtained 
  from the URL parameters. 

  The component handles loading and error states, and formats the block's timestamp 
  into a human-readable format. It also filters out certain properties from the block 
  object to display them separately, and handles the case where the block's data is 
  an array.

  At the bottom of the page, it renders a BlocksSwiper component to display the 
  adjacent blocks in a swiper. The BlocksSwiper is centered on the current block.
*/

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchBlockDetails,
  resetSelectedBlock,
} from "../store/blockSelectedSlice";
import { Container, ListGroup, Table, Button } from "react-bootstrap";
import { BsCopy } from "react-icons/bs";
import BlocksSwiper from "./BlocksSwiper";

const BlockDetails = () => {
  const { blockIdentifier } = useParams();
  const [isSmallViewport, setIsSmallViewport] = useState(
    window.innerWidth < 992
  );
  const dispatch = useDispatch();
  const block = useSelector((state) => state.selectedBlock.selectedBlock);
  const isLoading = useSelector((state) => state.selectedBlock.isLoading);
  const error = useSelector((state) => state.selectedBlock.error);

  useEffect(() => {
    dispatch(fetchBlockDetails(blockIdentifier));

    return () => {
      dispatch(resetSelectedBlock());
    };
  }, [dispatch, blockIdentifier]);

  useEffect(() => {
    const handleResize = () => setIsSmallViewport(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("res</span>ize", handleResize);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    if (error === "Server responded with status: 404") {
      return (
        <p>
          No block with {blockIdentifier.length === 64 ? "hash" : "index"} of{" "}
          <span className="text-info">{blockIdentifier}</span> could be found in
          the chain.
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

  const formatAddress = (address) => {
    return address.length >= 11
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;
  };

  const formatData = (data) => {
    return data.length >= 20 ? `${data.slice(0, 19)}...` : data;
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
      <h2 className="h3">Block Details for #{block && block.index}</h2>

      {block && (
        <div className="mb-5">
          <Container className="font-monospace text-break">
            <p>Index: {block.index}</p>
            <p>
              Timestamp: {block.timestamp}: {formatDate(block.timestamp)}
            </p>
            <p>Block Creator: {block.blockCreator}</p>
            <p>
              Hash: {block.hash}
              <Button
                variant="link"
                className="link-info py-0"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(block.hash);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
            <p>
              Previous Hash:{" "}
              <Link
                to={`/blocks/${block.previousHash}`}
                className={`link-info`}
              >
                {block.previousHash}
              </Link>
              <Button
                variant="link"
                className="link-info py-0"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(block.previousHash);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
            <p>
              Creator Address:{" "}
              <Link
                to={`/entries?publicKey=${block.ownerAddress}`}
                className={`link-info`}
              >
                {" "}
                {block.ownerAddress}
              </Link>
              <Button
                variant="link"
                className="link-info py-0"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(block.ownerAddress);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
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
                    "ownerAddress",
                  ].includes(prop)
              )
              .map((key) => (
                <p key={key}>{`${key}: ${block[key]}`}</p>
              ))}
          </Container>
          {block.data && (
            <>
              <h2 className="h3 mt-5 mb-3">Block Data Entries</h2>

              {Array.isArray(block.data) ? (
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  size={isSmallViewport ? "sm" : undefined}
                  className="font-monospace lh-sm text-nowrap align-middle"
                >
                  <thead>
                    <tr>
                      <th>Entry ID</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Amount</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.data.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <Link
                            to={`/entries/${item.entryId}`}
                            className={`link-info`}
                          >
                            {formatAddress(item.entryId)}
                          </Link>{" "}
                          <Button
                            variant="link"
                            className="link-info py-0"
                            title="Copy to clipboard."
                            onClick={(event) => {
                              copyToClipboard(item.entryId);
                              event.currentTarget.blur();
                            }}
                          >
                            <BsCopy />
                          </Button>
                        </td>
                        <td title={item.from}>
                          <Link
                            to={`/entries?publicKey=${item.from}`}
                            className={`link-info`}
                          >
                            {formatAddress(item.from)}
                          </Link>{" "}
                          <Button
                            variant="link"
                            className="link-info py-0"
                            title="Copy to clipboard."
                            onClick={(event) => {
                              copyToClipboard(item.from);
                              event.currentTarget.blur();
                            }}
                          >
                            <BsCopy />
                          </Button>
                        </td>
                        <td title={item.from}>
                          <Link
                            to={`/entries?publicKey=${item.to}`}
                            className={`link-info`}
                          >
                            {formatAddress(item.to)}
                          </Link>
                          <Button
                            variant="link"
                            className="link-info py-0"
                            title="Copy to clipboard."
                            onClick={(event) => {
                              copyToClipboard(item.to);
                              event.currentTarget.blur();
                            }}
                          >
                            <BsCopy />
                          </Button>
                        </td>
                        <td className="text-end">{item.amount}</td>
                        <td>
                          {formatData(
                            typeof item.data === "object"
                              ? JSON.stringify(item.data)
                              : item.data
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>{JSON.stringify(block.data)}</p>
              )}
            </>
          )}
          <h2 className="h3 mt-5 mb-4">Adjacent Blocks</h2>
          <BlocksSwiper
            scope="range"
            sort="desc"
            recordLimit={31}
            pageLimit={31}
            startIndex={Math.max(parseInt(block.index, 10) - 15, 0)}
            centerOnIndex={parseInt(block.index, 10)}
          />
        </div>
      )}
    </div>
  );
};

export default BlockDetails;
