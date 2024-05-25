# README.md

# Blockcraft Explorer 🌐

Welcome to the Blockcraft Explorer, my official React/Redux frontend for the Blockcraft blockchain package! This tool is designed to help you navigate and interact with a Blockcraft blockchain, providing insights into blocks, transactions, and the overall network state. 🚀

## Features 🌟

- **Blockchain Overview** 📊: Get a detailed view of the blockchain's current state, including the latest blocks, transactions, and network stats.
- **Chain Integrity Check** ✅: Verify the integrity of the blockchain to ensure its validity and consistency.
- **Block and Transaction Details** 🔍: Explore individual blocks and transactions to understand the flow of data and information across the network.
- **Decentralized Node Visualization** 🌍: View and interact with the network nodes that make up the blockchain infrastructure.

## Getting Started 🚀

### Prerequisites 📋

- Node.js (v14.0.0 or later) 📦
- npm (v6.0.0 or later) 🛠

### Installation 💿

The Blockcraft Explorer is a key part of the Blockcraft ecosystem, designed to seamlessly integrate with your Blockcraft blockchain. It's automatically installed as a dependency when you install the main Blockcraft package, so there's no need for manual installation in most cases. You only need to do this if wanting to customize Blockcraft Explorer. If wanting to customize, run the following command in your project directory:

```bash
npm install git+https://github.com/chrisallenarmbruster/blockcraft-explorer.git
```

## Usage 🛠

### Serving Blockcraft Explorer 🌐

Upon installation of the Blockcraft package, the Blockcraft Explorer assets are automatically placed within your project's `node_modules/blockcraft-explorer/dist` directory. These are production-ready, compiled frontend assets that the Blockcraft blockchain node is configured to serve directly.

When you start your Blockcraft blockchain node, it automatically serves the Blockcraft Explorer on the root HTTP endpoint. This allows for direct interaction with your blockchain through a user-friendly web interface.

### Integrating with Your Blockchain Node 🛠️

Since the Blockcraft Explorer is automatically served by your blockchain node, integration is straightforward. However, here's a quick overview to ensure everything is set up correctly:

1. **Ensure Blockcraft Installation**: The Blockcraft Explorer comes as part of the Blockcraft package. If you haven't done so already, installing Blockcraft automatically adds the Explorer to your project under `node_modules/blockcraft-explorer`.

2. **Run Your Blockchain Node** 🚀: Start your Blockcraft blockchain node as you normally would. It's already configured to serve the Blockcraft Explorer's assets from the `node_modules/blockcraft-explorer/dist` directory.

3. **Access the Explorer** 🌍: Navigate to your blockchain node's HTTP server address in a web browser (such as `http://localhost:3000` if running locally). The Blockcraft Explorer interface should be readily accessible, allowing for intuitive interaction with your blockchain.

### Custom Installation

If you wish to augment or customize the Blockcraft Explorer beyond the default setup, you may consider installing it directly for easier access to its source code. This is particularly useful for developers looking to extend the Explorer's capabilities or integrate it more deeply with custom blockchain functionalities.

To install the Blockcraft Explorer directly:

```bash
npm install git+https://github.com/chrisallenarmbruster/blockcraft-explorer.git
```

### Customizing the Explorer 🔧

While the Blockcraft Explorer works out-of-the-box, you may wish to customize or extend its functionality:

- **Modify the Explorer Frontend** 🎨: Since the frontend assets are compiled and served directly, significant customization will require modifying the source code directly in your `node_modules`, which is not recommended for maintainability. For deeper customization, consider forking the Blockcraft Explorer repository, making your changes, building it, and then installing it from your forked repository.

- **Extend the Backend Integration** 🛠️: You can extend your blockchain node's backend to provide additional APIs or websocket endpoints that the Blockcraft Explorer could interact with. This might involve adding new routes or functionality to your blockchain node application.

For further guidance on customization or integration, please refer to the [official Blockcraft documentation](https://github.com/chrisallenarmbruster/blockcraft-explorer#readme) or reach out to the community for support. 🤝


# genSourceCode.js

```javascript
/*
  File: genSourceCode.js
  Description: This script generates a markdown file that includes all the source code of the application. It recursively finds all .js, .jsx, README.md, and package.json files in the project directory, excluding the node_modules, dist, and public directories. For each file found, it determines the language based on the file extension, reads the file content, and appends it to the markdown file with appropriate markdown formatting. The markdown file is saved in the same directory as this script.
*/

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, "explorerSourceCode.md");

async function findFiles(dir, filelist = []) {
  const excludeDirs = ["node_modules", "dist", "public"];

  if (
    excludeDirs.some((excludeDir) =>
      dir.includes(path.join(__dirname, excludeDir))
    )
  ) {
    return filelist;
  }

  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await findFiles(filePath, filelist);
    } else if (
      file.name.endsWith(".js") ||
      file.name.endsWith(".jsx") ||
      ["README.md", "package.json"].includes(file.name)
    ) {
      filelist.push(filePath);
    }
  }
  return filelist;
}

function determineLanguage(file) {
  if (file.endsWith(".md")) return "markdown";
  if (file.endsWith(".json")) return "json";
  if (file.endsWith(".js") || file.endsWith(".jsx")) return "javascript";
  return "plaintext";
}

async function appendFileContent(file, language) {
  try {
    const data = await fs.readFile(file, "utf8");
    const relativeFilePath = path.relative(__dirname, file);
    await fs.appendFile(
      outputFile,
      `# ${relativeFilePath}\n\n${
        language !== "markdown"
          ? `\`\`\`${language}\n${data}\n\`\`\`\n\n`
          : `${data}\n\n`
      }`
    );
    console.log(`Appended contents of ${relativeFilePath} to ${outputFile}`);
  } catch (err) {
    console.error(`Error processing file ${file}:`, err);
  }
}

async function processFiles() {
  try {
    await fs.writeFile(outputFile, "");

    const targetedDirs = [__dirname, path.join(__dirname, "src")];
    let files = [];
    for (const dir of targetedDirs) {
      const foundFiles = await findFiles(dir);
      files = files.concat(foundFiles);
    }

    for (const file of files) {
      const language = determineLanguage(file);
      await appendFileContent(file, language);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

processFiles();

```

# package.json

```json
{
  "name": "blockcraft-explorer",
  "version": "0.9.0",
  "description": "React frontend for my Blockcraft blockchain package",
  "main": "src/index.jsx",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/chrisallenarmbruster/blockcraft-explorer.git"
  },
  "keywords": [
    "blockchain",
    "blockcraft",
    "blockchain-explorer",
    "react",
    "redux",
    "vite",
    "frontend",
    "crypto",
    "cryptocurrency",
    "explorer",
    "dapp",
    "decentralized"
  ],
  "author": "Chris Armbruster <chris@armbrustermail.com> (https://github.com/chrisallenarmbruster)",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/chrisallenarmbruster/blockcraft-explorer/issues"
  },
  "homepage": "https://github.com/chrisallenarmbruster/blockcraft-explorer#readme",
  "dependencies": {
    "@reduxjs/toolkit": "^2.2.1",
    "@use-gesture/react": "^10.3.1",
    "axios": "^1.6.8",
    "bootstrap": "^5.3.3",
    "bootstrap-icons": "^1.11.3",
    "react": "^18.2.0",
    "react-bootstrap": "^2.10.1",
    "react-dom": "^18.2.0",
    "react-icons": "^5.1.0",
    "react-redux": "^9.1.0",
    "react-router-dom": "^6.22.3",
    "redux": "^5.0.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.6"
  }
}

```

# src/Components/App.jsx

```javascript
/*
  File: App.jsx
  Description: This is the main application component. It integrates the navigation bar and routing for the application.
*/

import React from "react";
import { Routes, Route } from "react-router-dom";
import ChainIntegrityChecker from "./ChainIntegrityChecker";
import NavBar from "./NavBar";
import Home from "./Home";
import Blocks from "./Blocks";
import Entries from "./Entries";
import Nodes from "./Nodes";
import BlockDetails from "./BlockDetails";
import EntryDetails from "./EntryDetails";
import SearchResults from "./SearchResults";
import { Container } from "react-bootstrap";

function App() {
  return (
    <>
      <NavBar />
      <Container className="mt-3">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/blocks/:blockIdentifier" element={<BlockDetails />} />
          <Route path="/blocks" element={<Blocks />} />
          <Route path="/entries/:entryIdentifier" element={<EntryDetails />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/integrity" element={<ChainIntegrityChecker />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;

```

# src/Components/BlockDetails.jsx

```javascript
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

import React, { useEffect } from "react";
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
          <Container className="font-monospace">
            <p>Index: {block.index}</p>
            <p>
              Timestamp: {block.timestamp}: {formatDate(block.timestamp)}
            </p>
            <p>Block Creator: {block.blockCreator}</p>
            <p>
              Hash: {block.hash}
              <Button
                variant="link"
                className="link-info"
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
                className="link-info"
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
                className="link-info"
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
                <Table striped bordered hover className="font-monospace">
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
                            className="link-info"
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
                            className="link-info"
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
                            className="link-info"
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
                        <td>{JSON.stringify(item.data)}</td>
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

```

# src/Components/BlockchainInfo.jsx

```javascript
/*
  File: BlockchainInfo.jsx
  Description: This component fetches and displays information about the blockchain. It uses the Redux store to manage state and dispatch actions. The information displayed includes the blockchain's name, creation date, current height, difficulty, hash rate, and total supply only when applicable. If there's an error fetching the data, an error message is displayed with a button to retry the fetch operation.
*/

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockchainInfo } from "../store/blockchainInfoSlice";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { resetError } from "../store/blockchainInfoSlice";

const BlockchainInfo = () => {
  const dispatch = useDispatch();
  const {
    blockchainName,
    bornOn,
    currentHeight,
    difficulty,
    hashRate,
    totalSupply,
    isLoading,
    error,
  } = useSelector((state) => state.blockchainInfo);

  useEffect(() => {
    dispatch(fetchBlockchainInfo());
    return () => {
      if (error) {
        dispatch(resetError());
      }
    };
  }, [dispatch, error]);

  const handleRefresh = () => {
    dispatch(fetchBlockchainInfo());
  };

  if (isLoading) return <p>Loading blockchain info...</p>;
  if (error) {
    return (
      <Alert variant="danger" className="d-flex align-items-center">
        Error fetching blockchain info: {error}{" "}
        <Button variant="link" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise"></i>
        </Button>
      </Alert>
    );
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Container>
      {!error && (
        <Row className="align-items-center gy-2 gx-5">
          {" "}
          {/* g-2 for some gutter space between items */}
          {blockchainName && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Name:&nbsp;</strong>
                {blockchainName}
              </span>
            </Col>
          )}
          {bornOn && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Born On:&nbsp;</strong>
                {formatDate(bornOn)}
              </span>
            </Col>
          )}
          {currentHeight !== null && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="d-flex align-items-center text-nowrap">
                <strong>Height:&nbsp;</strong>
                {currentHeight}
                <Button variant="link" onClick={handleRefresh}>
                  <i className="bi bi-arrow-clockwise text-info"></i>
                </Button>
              </span>
            </Col>
          )}
          {difficulty && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Difficulty:&nbsp;</strong>
                {difficulty}
              </span>
            </Col>
          )}
          {hashRate && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Hash Rate:&nbsp;</strong>
                {parseInt(hashRate)}/s
              </span>
            </Col>
          )}
          {totalSupply !== null && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Total Supply:&nbsp;</strong>
                {totalSupply}
              </span>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default BlockchainInfo;

```

# src/Components/BlockchainIntegrity.jsx

```javascript
/*
  File: BlockchainIntegrity.jsx
  Description: This component fetches and displays the integrity of the blockchain. It uses the Redux store to manage state and dispatch actions. The component checks the overall validation, block hash validation, previous hash validation, timestamp validation, and index validation. If there's an error fetching the data, an error message is displayed with a button to retry the fetch operation.
*/

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockchainIntegrity } from "../store/blockchainIntegritySlice";
import { resetError } from "../store/blockchainIntegritySlice";
import { Container, Alert, Button, ListGroup } from "react-bootstrap";
import ValidationIcon from "./ValidationIcon";

const BlockchainIntegrity = () => {
  const dispatch = useDispatch();
  const {
    isValid,
    blockCount,
    areHashesValid,
    arePreviousHashesValid,
    areTimestampsValid,
    areIndexesValid,
    validationErrors,
    isLoading,
    error,
  } = useSelector((state) => state.blockchainIntegrity);

  const uniqueFailingBlocksCount = validationErrors.reduce((acc, error) => {
    return acc.add(error.blockNumber);
  }, new Set()).size;

  useEffect(() => {
    dispatch(fetchBlockchainIntegrity());
    return () => {
      if (error) {
        dispatch(resetError());
      }
    };
  }, [dispatch, error]);

  const handleRefresh = () => {
    dispatch(fetchBlockchainIntegrity());
  };

  if (isLoading) return <div>Loading integrity data...</div>;

  if (error) {
    return (
      <Alert variant="danger" className="d-flex align-items-center">
        Error fetching integrity data: {error}{" "}
        <Button variant="link" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise"></i>
        </Button>
      </Alert>
    );
  }

  return (
    <Container>
      <ListGroup variant="flush" className="border-0">
        <ValidationIcon
          isValid={isValid}
          label={`Overall Validation: ${blockCount} blocks analyzed,  ${
            blockCount - uniqueFailingBlocksCount
          } passed, ${uniqueFailingBlocksCount} failed.`}
        />
        <ValidationIcon
          isValid={areHashesValid}
          label="Block Hash Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "hash"
          )}
        />
        <ValidationIcon
          isValid={arePreviousHashesValid}
          label="Previous Hash Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "previousHash"
          )}
        />
        <ValidationIcon
          isValid={areTimestampsValid}
          label="Timestamp Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "timestamp"
          )}
        />
        <ValidationIcon
          isValid={areIndexesValid}
          label="Index Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "index"
          )}
        />
      </ListGroup>
    </Container>
  );
};

export default BlockchainIntegrity;

```

# src/Components/Blocks.jsx

```javascript
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlocks, resetBlocks } from "../store/blocksSlice";
import { Button, Alert, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsCopy } from "react-icons/bs";

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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log("Failed to copy: ", err);
    }
  };

  return (
    <div className="mb-5">
      <h2 className="h3 mb-4">Blocks</h2>
      <Table striped bordered hover className="font-monospace">
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
                <Button
                  variant="link"
                  className="link-info"
                  title="Copy to clipboard."
                  onClick={(event) => {
                    event.stopPropagation();
                    copyToClipboard(block.hash);
                    event.currentTarget.blur();
                  }}
                >
                  <BsCopy />
                </Button>
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

```

# src/Components/BlocksInfiniteScroll.jsx

```javascript
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

```

# src/Components/BlocksSwiper.jsx

```javascript
/*
  File: BlocksSwiper.jsx
  Description: 
  This component renders a swiper of blocks. It fetches a range of blocks from 
  the Redux store and displays them in a horizontal scrollable container. The 
  user can drag to scroll through the blocks. Each block is a link to the 
  block's detail page. 

  The swiper centers on a specified block index when it first renders and 
  whenever the specified index changes. The component also handles loading 
  and error states.
*/

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlocks, resetBlocks } from "../store/blocksSlice";
import { useDrag } from "@use-gesture/react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const BlocksSwiper = ({
  scope,
  sort,
  recordLimit,
  pageLimit,
  startIndex = 0,
  centerOnIndex,
}) => {
  const dispatch = useDispatch();
  const { blocks, isLoading, error } = useSelector((state) => state.blocks);
  const containerRef = useRef(null);
  const [initialScroll, setInitialScroll] = useState(0);

  useEffect(() => {
    dispatch(
      fetchBlocks({
        scope,
        sort,
        recordLimit,
        pageLimit,
        startIndex,
      })
    );

    return () => {
      dispatch(resetBlocks());
    };
  }, [dispatch, centerOnIndex]);

  useEffect(() => {
    if (
      containerRef.current &&
      blocks.length > 0 &&
      centerOnIndex !== undefined
    ) {
      const blockArrayIndex = blocks.findIndex(
        (block) => block.index === centerOnIndex
      );
      if (blockArrayIndex !== -1) {
        const containerWidth = containerRef.current.offsetWidth;
        const blockWidth = 100;
        const lineWidth = 33;
        const initialScrollPosition =
          (blockWidth + lineWidth) * blockArrayIndex -
          containerWidth / 2 +
          blockWidth / 2;
        containerRef.current.scrollLeft = initialScrollPosition;
      }
    }
  }, [blocks, centerOnIndex]);

  const bind = useDrag(
    ({ movement: [mx], memo = containerRef.current.scrollLeft }) => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = memo - mx;
      }
      return memo;
    },
    { axis: "x", filterTaps: true, pointer: { capture: true } }
  );

  const blockArrayIndex = blocks.findIndex(
    (block) => block.index === centerOnIndex
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <style>
        {`
          .latest-blocks-swiper {
            cursor: grab;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none;  /* IE 10+ */
          }

          .latest-blocks-swiper::-webkit-scrollbar {
            display: none; /* WebKit */
          }

          .miniCard {
            min-width: 100px;
            max-width: 100px;
            height: 100px; 
          }

          .horizontal-line {
            height: 2px;
            width: 33px; 
          }

          .no-select {
            user-select: none; /* Standard syntax */
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
          }
        `}
      </style>
      <div
        ref={containerRef}
        {...bind()}
        className="latest-blocks-swiper overflow-x-auto d-flex flex-row flex-nowrap overflow-auto align-items-center"
      >
        {blocks.map((block, index) => (
          <React.Fragment key={block.index}>
            {index !== 0 && (
              <div className="bg-info-solid">
                <hr className="horizontal-line my-0"></hr>
              </div>
            )}
            <Card
              className={`miniCard border-2 rounded-3 ${
                index === blockArrayIndex
                  ? "bg-info-highlight border-info-highlight"
                  : "bg-info-muted border-info"
              } `}
            >
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Link
                  to={`/blocks/${block.index}`}
                  className={` ${
                    index === blockArrayIndex ? "link-light" : "link-info"
                  }`}
                >
                  <div className="fs-6 no-select ">#{block.index}</div>
                </Link>
              </Card.Body>
            </Card>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default BlocksSwiper;

```

# src/Components/ChainIntegrityChecker.jsx

```javascript
import React, { useState, useEffect } from "react";
import BlockchainIntegrity from "./BlockchainIntegrity";

function ChainIntegrityChecker() {
  return (
    <div>
      <h2 className="h3">Chain Integrity Checker</h2>
      <BlockchainIntegrity />
    </div>
  );
}

export default ChainIntegrityChecker;

```

# src/Components/Entries.jsx

```javascript
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEntries, resetError, resetEntries } from "../store/entriesSlice";
import { Button, Alert, Spinner, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { BsCopy } from "react-icons/bs";

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

  if (error) {
    const publicKey = getQueryParams().get("publicKey");
    if (publicKey && error === "Server responded with status: 404") {
      return (
        <p>
          No entries related to <span className="text-info">{publicKey}</span>{" "}
          could be found in the chain.
        </p>
      );
    } else {
      return <p>Error: {error}</p>;
    }
  }

  const formatAddress = (address) => {
    if (!address) {
      return "N/A";
    }

    return address.length >= 11
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log("Failed to copy: ", err);
    }
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
            <p className="h6 mt-3">
              Full Key:{" "}
              <span className="font-monospace">{meta.queriedPublicKey}</span>
              <Button
                variant="link"
                className="link-info"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(meta.queriedPublicKey);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
          </>
        ) : (
          "Entries"
        )}
      </h2>
      <Table striped bordered hover className="font-monospace">
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
                <Link
                  to={`/entries/${entry.entryId}`}
                  className={`link-info`}
                  title={entry.entryId}
                >
                  {formatAddress(entry.entryId)}
                </Link>
                <Button
                  variant="link"
                  className="link-info"
                  title="Copy to clipboard."
                  onClick={(event) => {
                    copyToClipboard(entry.entryId);
                    event.currentTarget.blur();
                  }}
                >
                  <BsCopy />
                </Button>
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
                <Button
                  variant="link"
                  className="link-info"
                  title="Copy to clipboard."
                  onClick={(event) => {
                    copyToClipboard(entry.from);
                    event.currentTarget.blur();
                  }}
                >
                  <BsCopy />
                </Button>
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
                <Button
                  variant="link"
                  className="link-info"
                  title="Copy to clipboard."
                  onClick={(event) => {
                    copyToClipboard(entry.to);
                    event.currentTarget.blur();
                  }}
                >
                  <BsCopy />
                </Button>
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

```

# src/Components/EntryDetails.jsx

```javascript
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
                className="link-info"
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
                className={`link-info`}
              >
                {entry.from}
              </Link>
              <Button
                variant="link"
                className="link-info"
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
                className={`link-info`}
              >
                {entry.to}
              </Link>
              <Button
                variant="link"
                className="link-info"
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
                className="link-info"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(entry.hash);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
            <p className="text-wrap">
              Signature:{" "}
              <div className="text-wrap text-break">
                {entry.signature}
                <Button
                  variant="link"
                  className="link-info"
                  title="Copy to clipboard."
                  onClick={(event) => {
                    copyToClipboard(entry.signature);
                    event.currentTarget.blur();
                  }}
                >
                  <BsCopy />
                </Button>
              </div>
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

```

# src/Components/Home.jsx

```javascript
import React from "react";
import BlockchainInfo from "./BlockchainInfo";
import BlockchainIntegrity from "./BlockchainIntegrity";
import BlocksSwiper from "./BlocksSwiper";

const Home = () => {
  return (
    <div>
      <h2 className="h3">Blockchain Info</h2>
      <BlockchainInfo />
      <h2 className="h3 mt-3">Blockchain Integrity</h2>
      <BlockchainIntegrity />
      <h2 className="h3 mt-3 mb-4">Latest Blocks</h2>
      <BlocksSwiper
        scope="latest"
        sort="desc"
        recordLimit={30}
        pageLimit={30}
      />
    </div>
  );
};

export default Home;

```

# src/Components/NavBar.jsx

```javascript
/*
  File: NavBar.jsx
  Description: This component renders the navigation bar for the application. It includes navigation links as well as a search form.
*/

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap"
import { BiSearchAlt2 } from "react-icons/bi"

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // const parsedTerm = parseInt(searchTerm);
    if (/^\d+$/.test(searchTerm) && parseInt(searchTerm) < 1000000000) {
      navigate(`/blocks/${searchTerm}`)
    } else if (/^[a-fA-F0-9]{64}$/.test(searchTerm)) {
      console.log("searchTerm", searchTerm)
      navigate(`/blocks/${encodeURIComponent(searchTerm)}`)
    } else if (
      /^(02|03)[a-fA-F0-9]{64}$/.test(searchTerm) ||
      searchTerm === "ICO" ||
      searchTerm === "INCENTIVE"
    ) {
      navigate(`/entries?publicKey=${encodeURIComponent(searchTerm)}`)
    } else if (/^[0-9A-Za-z_-]{21}$/.test(searchTerm)) {
      navigate(`/entries/${encodeURIComponent(searchTerm)}`)
    } else {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Blockcraft Explorer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/integrity">
              Integrity
            </Nav.Link>
            <Nav.Link as={Link} to="/blocks">
              Blocks
            </Nav.Link>
            <Nav.Link as={Link} to="/entries">
              Entries
            </Nav.Link>
            <Nav.Link as={Link} to="/nodes">
              Nodes
            </Nav.Link>
          </Nav>
          <Form className="d-flex" onSubmit={handleSubmit}>
            <FormControl
              type="search"
              placeholder="Search Blockchain"
              className="me-2"
              aria-label="Search"
              title="Enter a block index, block hash or entry ID"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSubmit(event)
              }}
            />
            <Button variant="outline-info" type="submit">
              <BiSearchAlt2 className="text-info" size={24} />
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar

```

# src/Components/Nodes.jsx

```javascript
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
                  <Card.Text>IP: {node.ip}</Card.Text>
                  <Card.Text>URL: {node.url}</Card.Text>
                  <Card.Text>P2P Port: {node.p2pPort}</Card.Text>
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

```

# src/Components/SearchResults.jsx

```javascript
import React from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");

  return (
    <Container>
      <h2 className="h3">Search Results</h2>
      <p>
        No results found for <span className="text-info">"{query}"</span>.{" "}
        <br></br>Try entering a valid block index, block hash or entry ID.
      </p>
    </Container>
  );
};

export default SearchResults;

```

# src/Components/ValidationIcon.jsx

```javascript
/*
  File: ValidationIcon.jsx
  Description: This component displays a validation icon along with a label. If the validation fails, it also displays an alert with the details of the related errors. The icon, label, and errors are passed as props to the component. The icon changes based on the 'isValid' prop, and the alert is only displayed if there are errors.  This component is consumed by the BlockchainIntegrity component. 
*/

import React from "react";
import { Alert, ListGroup } from "react-bootstrap";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";

const ValidationIcon = ({ isValid, label, errors = [] }) => {
  return (
    <ListGroup.Item className="border-0 d-flex align-items-start">
      <div className="me-3">
        {isValid ? (
          <BiCheckCircle className="text-success" size={32} />
        ) : (
          <BiXCircle className="text-danger" size={32} />
        )}
      </div>
      <div>
        <span className="fw-bold">{label}</span>
        {errors.length > 0 && (
          <Alert variant="danger" className="ms-4 mt-3">
            {errors.map((error, index) => (
              <p key={index} className="my-0">
                Block {error.blockNumber} failed {error.errorType} validation
                test
              </p>
            ))}
          </Alert>
        )}
      </div>
    </ListGroup.Item>
  );
};

export default ValidationIcon;

```

# src/index.jsx

```javascript
/*
  File: index.jsx
  Description: Starting point for React application (gets injected into index.html). 
  Redux store, client router, component entry point and style imports can be found in this file.
*/

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./Components/App";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./override.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

```

# src/store/blockSelectedSlice.js

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBlockDetails = createAsyncThunk(
  "blockSelected/fetchDetails",
  async (blockIdentifier, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/blocks/${blockIdentifier}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const initialState = {
  selectedBlock: null,
  isLoading: false,
  error: null,
};

const blockSelectedSlice = createSlice({
  name: "blockSelected",
  initialState,
  reducers: {
    resetSelectedBlock: (state) => {
      state.selectedBlock = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlockDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBlock = action.payload;
        state.error = null;
      })
      .addCase(fetchBlockDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSelectedBlock } = blockSelectedSlice.actions;
export default blockSelectedSlice.reducer;

```

# src/store/blockchainInfoSlice.js

```javascript
/*
  File: blockchainInfoSlice.js
  Description: This Redux slice manages the state and actions related to the blockchain information. It includes an async thunk to fetch the blockchain information from the blockchain node, and reducers to handle the different states of the fetch operation (pending, fulfilled, rejected). The slice also includes a reducer to reset any error that occurred during the fetch operation. The state includes the blockchain's name, creation date, current height, hash rate, difficulty, total supply, loading status, and any error message when such data is applicable.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBlockchainIntegrity } from "./blockchainIntegritySlice";
import axios from "axios";

export const fetchBlockchainInfo = createAsyncThunk(
  "blockchainInfo/fetch",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get("/api/chain/info");
      dispatch(fetchBlockchainIntegrity());
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const initialState = {
  blockchainName: "",
  bornOn: null,
  currentHeight: 0,
  hashRate: null,
  difficulty: null,
  totalSupply: null,
  isLoading: false,
  error: null,
};

const blockchainInfoSlice = createSlice({
  name: "blockchainInfo",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockchainInfo.pending, (state) => {
        if (!state.currentHeight) {
          state.isLoading = true;
        }
      })
      .addCase(fetchBlockchainInfo.fulfilled, (state, action) => {
        state.blockchainName = action.payload.blockchainName;
        state.bornOn = action.payload.bornOn;
        state.currentHeight = action.payload.currentHeight;
        if ("hashRate" in action.payload) {
          state.hashRate = action.payload.hashRate;
        }
        if ("difficulty" in action.payload) {
          state.difficulty = action.payload.difficulty;
        }
        if ("totalSupply" in action.payload) {
          state.totalSupply = action.payload.totalSupply;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchBlockchainInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blockchainInfoSlice.actions;

export default blockchainInfoSlice.reducer;

```

# src/store/blockchainIntegritySlice.js

```javascript
/*
  File: blockchainIntegritySlice.js
  Description: This Redux slice manages the state and actions related to the blockchain integrity. It includes an async thunk to fetch the blockchain integrity from the node, and reducers to handle the different states of the fetch operation (pending, fulfilled, rejected). The slice also includes a reducer to reset any error that occurred during the fetch operation. The state includes the blockchain's validity, block count, hash validity, previous hash validity, timestamp validity, index validity, validation errors, loading status, and any error message when such data is applicable.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBlockchainIntegrity = createAsyncThunk(
  "blockchainIntegrity/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/chain/integrity");
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const blockchainIntegritySlice = createSlice({
  name: "blockchainIntegrity",
  initialState: {
    isValid: true,
    blockCount: 0,
    areHashesValid: true,
    arePreviousHashesValid: true,
    areTimestampsValid: true,
    areIndexesValid: true,
    validationErrors: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockchainIntegrity.pending, (state) => {
        if (!state.blockCount) {
          state.isLoading = true;
        }
      })
      .addCase(fetchBlockchainIntegrity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isValid = action.payload.isValid;
        state.blockCount = action.payload.blockCount;
        state.areHashesValid = action.payload.areHashesValid;
        state.arePreviousHashesValid = action.payload.arePreviousHashesValid;
        state.areTimestampsValid = action.payload.areTimestampsValid;
        state.areIndexesValid = action.payload.areIndexesValid;
        state.validationErrors = action.payload.errors || [];
        state.error = null;
      })
      .addCase(fetchBlockchainIntegrity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blockchainIntegritySlice.actions;

export default blockchainIntegritySlice.reducer;

```

# src/store/blocksSlice.js

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blocks: [],
  meta: {},
  isLoading: false,
  error: null,
};

export const fetchBlocks = createAsyncThunk(
  "blocksRange/fetchBlocks",
  async (
    { scope, sort, recordLimit, pageLimit, startIndex, page = 1 } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/blocks", {
        params: { scope, sort, page, pageLimit, recordLimit, startIndex },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data?.message ||
          `Server responded with status: ${error.response.status}`;
        return rejectWithValue(message);
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetBlocks: (state) => {
      state.blocks = [];
      state.meta = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlocks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlocks.fulfilled, (state, action) => {
        state.blocks = action.payload.blocks;
        state.meta = action.payload.meta;
        state.isLoading = false;
      })
      .addCase(fetchBlocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetBlocks } = blocksSlice.actions;
export default blocksSlice.reducer;

```

# src/store/entriesSlice.js

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  entries: [],
  meta: {},
  isLoading: false,
  error: null,
};

export const fetchEntries = createAsyncThunk(
  "entries/fetchEntries",
  async (
    { scope, sort, page, pageLimit, publicKey } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/entries", {
        params: { scope, sort, page, pageLimit, publicKey },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetEntries: (state) => {
      state.entries = [];
      state.meta = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.entries = action.payload.entries;
        state.meta = action.payload.meta;
        state.isLoading = false;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetEntries } = entriesSlice.actions;

export default entriesSlice.reducer;

```

# src/store/entrySelectedSlice.js

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEntryDetails = createAsyncThunk(
  "entrySelected/fetchDetails",
  async (entryIdentifier, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/entries/${entryIdentifier}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const initialState = {
  selectedEntry: null,
  isLoading: false,
  error: null,
};

const entrySelectedSlice = createSlice({
  name: "entrySelected",
  initialState,
  reducers: {
    resetSelectedEntry: (state) => {
      state.selectedEntry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntryDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEntryDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEntry = action.payload;
        state.error = null;
      })
      .addCase(fetchEntryDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSelectedEntry } = entrySelectedSlice.actions;
export default entrySelectedSlice.reducer;

```

# src/store/index.js

```javascript
/*
  File: index.js
  Description: This file sets up the Redux store for the application. It imports the reducers from each of the redux slice files and combines them using the configureStore function from Redux Toolkit. The resulting store is then exported for use in the application.
*/

import { configureStore } from "@reduxjs/toolkit";
import blockchainInfoReducer from "./blockchainInfoSlice";
import blockchainIntegrityReducer from "./blockchainIntegritySlice";
import blocksReducer from "./blocksSlice";
import selectedBlockReducer from "./blockSelectedSlice";
import nodesReducer from "./nodesSlice";
import entriesReducer from "./entriesSlice";
import selectedEntryReducer from "./entrySelectedSlice";

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
    blockchainIntegrity: blockchainIntegrityReducer,
    blocks: blocksReducer,
    selectedBlock: selectedBlockReducer,
    entries: entriesReducer,
    selectedEntry: selectedEntryReducer,
    nodes: nodesReducer,
  },
});

export default store;

```

# src/store/nodesSlice.js

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  nodes: [],
  isLoading: false,
  error: null,
};

export const fetchNodes = createAsyncThunk(
  "nodes/fetchNodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/nodes");
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetNodes: (state) => {
      state.nodes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNodes.fulfilled, (state, action) => {
        state.nodes = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchNodes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetNodes } = nodesSlice.actions;

export default nodesSlice.reducer;

```

# vite.config.js

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});

```

# src/Components/App.jsx

```javascript
/*
  File: App.jsx
  Description: This is the main application component. It integrates the navigation bar and routing for the application.
*/

import React from "react";
import { Routes, Route } from "react-router-dom";
import ChainIntegrityChecker from "./ChainIntegrityChecker";
import NavBar from "./NavBar";
import Home from "./Home";
import Blocks from "./Blocks";
import Entries from "./Entries";
import Nodes from "./Nodes";
import BlockDetails from "./BlockDetails";
import EntryDetails from "./EntryDetails";
import SearchResults from "./SearchResults";
import { Container } from "react-bootstrap";

function App() {
  return (
    <>
      <NavBar />
      <Container className="mt-3">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/blocks/:blockIdentifier" element={<BlockDetails />} />
          <Route path="/blocks" element={<Blocks />} />
          <Route path="/entries/:entryIdentifier" element={<EntryDetails />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/integrity" element={<ChainIntegrityChecker />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;

```

# src/Components/BlockDetails.jsx

```javascript
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

import React, { useEffect } from "react";
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
          <Container className="font-monospace">
            <p>Index: {block.index}</p>
            <p>
              Timestamp: {block.timestamp}: {formatDate(block.timestamp)}
            </p>
            <p>Block Creator: {block.blockCreator}</p>
            <p>
              Hash: {block.hash}
              <Button
                variant="link"
                className="link-info"
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
                className="link-info"
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
                className="link-info"
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
                <Table striped bordered hover className="font-monospace">
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
                            className="link-info"
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
                            className="link-info"
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
                            className="link-info"
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
                        <td>{JSON.stringify(item.data)}</td>
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

```

# src/Components/BlockchainInfo.jsx

```javascript
/*
  File: BlockchainInfo.jsx
  Description: This component fetches and displays information about the blockchain. It uses the Redux store to manage state and dispatch actions. The information displayed includes the blockchain's name, creation date, current height, difficulty, hash rate, and total supply only when applicable. If there's an error fetching the data, an error message is displayed with a button to retry the fetch operation.
*/

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockchainInfo } from "../store/blockchainInfoSlice";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { resetError } from "../store/blockchainInfoSlice";

const BlockchainInfo = () => {
  const dispatch = useDispatch();
  const {
    blockchainName,
    bornOn,
    currentHeight,
    difficulty,
    hashRate,
    totalSupply,
    isLoading,
    error,
  } = useSelector((state) => state.blockchainInfo);

  useEffect(() => {
    dispatch(fetchBlockchainInfo());
    return () => {
      if (error) {
        dispatch(resetError());
      }
    };
  }, [dispatch, error]);

  const handleRefresh = () => {
    dispatch(fetchBlockchainInfo());
  };

  if (isLoading) return <p>Loading blockchain info...</p>;
  if (error) {
    return (
      <Alert variant="danger" className="d-flex align-items-center">
        Error fetching blockchain info: {error}{" "}
        <Button variant="link" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise"></i>
        </Button>
      </Alert>
    );
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Container>
      {!error && (
        <Row className="align-items-center gy-2 gx-5">
          {" "}
          {/* g-2 for some gutter space between items */}
          {blockchainName && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Name:&nbsp;</strong>
                {blockchainName}
              </span>
            </Col>
          )}
          {bornOn && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Born On:&nbsp;</strong>
                {formatDate(bornOn)}
              </span>
            </Col>
          )}
          {currentHeight !== null && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="d-flex align-items-center text-nowrap">
                <strong>Height:&nbsp;</strong>
                {currentHeight}
                <Button variant="link" onClick={handleRefresh}>
                  <i className="bi bi-arrow-clockwise text-info"></i>
                </Button>
              </span>
            </Col>
          )}
          {difficulty && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Difficulty:&nbsp;</strong>
                {difficulty}
              </span>
            </Col>
          )}
          {hashRate && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Hash Rate:&nbsp;</strong>
                {parseInt(hashRate)}/s
              </span>
            </Col>
          )}
          {totalSupply !== null && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center"
            >
              <span className="text-nowrap">
                <strong>Total Supply:&nbsp;</strong>
                {totalSupply}
              </span>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default BlockchainInfo;

```

# src/Components/BlockchainIntegrity.jsx

```javascript
/*
  File: BlockchainIntegrity.jsx
  Description: This component fetches and displays the integrity of the blockchain. It uses the Redux store to manage state and dispatch actions. The component checks the overall validation, block hash validation, previous hash validation, timestamp validation, and index validation. If there's an error fetching the data, an error message is displayed with a button to retry the fetch operation.
*/

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockchainIntegrity } from "../store/blockchainIntegritySlice";
import { resetError } from "../store/blockchainIntegritySlice";
import { Container, Alert, Button, ListGroup } from "react-bootstrap";
import ValidationIcon from "./ValidationIcon";

const BlockchainIntegrity = () => {
  const dispatch = useDispatch();
  const {
    isValid,
    blockCount,
    areHashesValid,
    arePreviousHashesValid,
    areTimestampsValid,
    areIndexesValid,
    validationErrors,
    isLoading,
    error,
  } = useSelector((state) => state.blockchainIntegrity);

  const uniqueFailingBlocksCount = validationErrors.reduce((acc, error) => {
    return acc.add(error.blockNumber);
  }, new Set()).size;

  useEffect(() => {
    dispatch(fetchBlockchainIntegrity());
    return () => {
      if (error) {
        dispatch(resetError());
      }
    };
  }, [dispatch, error]);

  const handleRefresh = () => {
    dispatch(fetchBlockchainIntegrity());
  };

  if (isLoading) return <div>Loading integrity data...</div>;

  if (error) {
    return (
      <Alert variant="danger" className="d-flex align-items-center">
        Error fetching integrity data: {error}{" "}
        <Button variant="link" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise"></i>
        </Button>
      </Alert>
    );
  }

  return (
    <Container>
      <ListGroup variant="flush" className="border-0">
        <ValidationIcon
          isValid={isValid}
          label={`Overall Validation: ${blockCount} blocks analyzed,  ${
            blockCount - uniqueFailingBlocksCount
          } passed, ${uniqueFailingBlocksCount} failed.`}
        />
        <ValidationIcon
          isValid={areHashesValid}
          label="Block Hash Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "hash"
          )}
        />
        <ValidationIcon
          isValid={arePreviousHashesValid}
          label="Previous Hash Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "previousHash"
          )}
        />
        <ValidationIcon
          isValid={areTimestampsValid}
          label="Timestamp Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "timestamp"
          )}
        />
        <ValidationIcon
          isValid={areIndexesValid}
          label="Index Validation"
          errors={validationErrors.filter(
            (error) => error.errorType === "index"
          )}
        />
      </ListGroup>
    </Container>
  );
};

export default BlockchainIntegrity;

```

# src/Components/Blocks.jsx

```javascript
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlocks, resetBlocks } from "../store/blocksSlice";
import { Button, Alert, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsCopy } from "react-icons/bs";

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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log("Failed to copy: ", err);
    }
  };

  return (
    <div className="mb-5">
      <h2 className="h3 mb-4">Blocks</h2>
      <Table striped bordered hover className="font-monospace">
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
                <Button
                  variant="link"
                  className="link-info"
                  title="Copy to clipboard."
                  onClick={(event) => {
                    event.stopPropagation();
                    copyToClipboard(block.hash);
                    event.currentTarget.blur();
                  }}
                >
                  <BsCopy />
                </Button>
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

```

# src/Components/BlocksInfiniteScroll.jsx

```javascript
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

```

# src/Components/BlocksSwiper.jsx

```javascript
/*
  File: BlocksSwiper.jsx
  Description: 
  This component renders a swiper of blocks. It fetches a range of blocks from 
  the Redux store and displays them in a horizontal scrollable container. The 
  user can drag to scroll through the blocks. Each block is a link to the 
  block's detail page. 

  The swiper centers on a specified block index when it first renders and 
  whenever the specified index changes. The component also handles loading 
  and error states.
*/

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlocks, resetBlocks } from "../store/blocksSlice";
import { useDrag } from "@use-gesture/react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const BlocksSwiper = ({
  scope,
  sort,
  recordLimit,
  pageLimit,
  startIndex = 0,
  centerOnIndex,
}) => {
  const dispatch = useDispatch();
  const { blocks, isLoading, error } = useSelector((state) => state.blocks);
  const containerRef = useRef(null);
  const [initialScroll, setInitialScroll] = useState(0);

  useEffect(() => {
    dispatch(
      fetchBlocks({
        scope,
        sort,
        recordLimit,
        pageLimit,
        startIndex,
      })
    );

    return () => {
      dispatch(resetBlocks());
    };
  }, [dispatch, centerOnIndex]);

  useEffect(() => {
    if (
      containerRef.current &&
      blocks.length > 0 &&
      centerOnIndex !== undefined
    ) {
      const blockArrayIndex = blocks.findIndex(
        (block) => block.index === centerOnIndex
      );
      if (blockArrayIndex !== -1) {
        const containerWidth = containerRef.current.offsetWidth;
        const blockWidth = 100;
        const lineWidth = 33;
        const initialScrollPosition =
          (blockWidth + lineWidth) * blockArrayIndex -
          containerWidth / 2 +
          blockWidth / 2;
        containerRef.current.scrollLeft = initialScrollPosition;
      }
    }
  }, [blocks, centerOnIndex]);

  const bind = useDrag(
    ({ movement: [mx], memo = containerRef.current.scrollLeft }) => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = memo - mx;
      }
      return memo;
    },
    { axis: "x", filterTaps: true, pointer: { capture: true } }
  );

  const blockArrayIndex = blocks.findIndex(
    (block) => block.index === centerOnIndex
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <style>
        {`
          .latest-blocks-swiper {
            cursor: grab;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none;  /* IE 10+ */
          }

          .latest-blocks-swiper::-webkit-scrollbar {
            display: none; /* WebKit */
          }

          .miniCard {
            min-width: 100px;
            max-width: 100px;
            height: 100px; 
          }

          .horizontal-line {
            height: 2px;
            width: 33px; 
          }

          .no-select {
            user-select: none; /* Standard syntax */
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
          }
        `}
      </style>
      <div
        ref={containerRef}
        {...bind()}
        className="latest-blocks-swiper overflow-x-auto d-flex flex-row flex-nowrap overflow-auto align-items-center"
      >
        {blocks.map((block, index) => (
          <React.Fragment key={block.index}>
            {index !== 0 && (
              <div className="bg-info-solid">
                <hr className="horizontal-line my-0"></hr>
              </div>
            )}
            <Card
              className={`miniCard border-2 rounded-3 ${
                index === blockArrayIndex
                  ? "bg-info-highlight border-info-highlight"
                  : "bg-info-muted border-info"
              } `}
            >
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Link
                  to={`/blocks/${block.index}`}
                  className={` ${
                    index === blockArrayIndex ? "link-light" : "link-info"
                  }`}
                >
                  <div className="fs-6 no-select ">#{block.index}</div>
                </Link>
              </Card.Body>
            </Card>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default BlocksSwiper;

```

# src/Components/ChainIntegrityChecker.jsx

```javascript
import React, { useState, useEffect } from "react";
import BlockchainIntegrity from "./BlockchainIntegrity";

function ChainIntegrityChecker() {
  return (
    <div>
      <h2 className="h3">Chain Integrity Checker</h2>
      <BlockchainIntegrity />
    </div>
  );
}

export default ChainIntegrityChecker;

```

# src/Components/Entries.jsx

```javascript
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEntries, resetError, resetEntries } from "../store/entriesSlice";
import { Button, Alert, Spinner, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { BsCopy } from "react-icons/bs";

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

  if (error) {
    const publicKey = getQueryParams().get("publicKey");
    if (publicKey && error === "Server responded with status: 404") {
      return (
        <p>
          No entries related to <span className="text-info">{publicKey}</span>{" "}
          could be found in the chain.
        </p>
      );
    } else {
      return <p>Error: {error}</p>;
    }
  }

  const formatAddress = (address) => {
    if (!address) {
      return "N/A";
    }

    return address.length >= 11
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log("Failed to copy: ", err);
    }
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
            <p className="h6 mt-3">
              Full Key:{" "}
              <span className="font-monospace">{meta.queriedPublicKey}</span>
              <Button
                variant="link"
                className="link-info"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(meta.queriedPublicKey);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
          </>
        ) : (
          "Entries"
        )}
      </h2>
      <Table striped bordered hover className="font-monospace">
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
                <Link
                  to={`/entries/${entry.entryId}`}
                  className={`link-info`}
                  title={entry.entryId}
                >
                  {formatAddress(entry.entryId)}
                </Link>
                <Button
                  variant="link"
                  className="link-info"
                  title="Copy to clipboard."
                  onClick={(event) => {
                    copyToClipboard(entry.entryId);
                    event.currentTarget.blur();
                  }}
                >
                  <BsCopy />
                </Button>
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
                <Button
                  variant="link"
                  className="link-info"
                  title="Copy to clipboard."
                  onClick={(event) => {
                    copyToClipboard(entry.from);
                    event.currentTarget.blur();
                  }}
                >
                  <BsCopy />
                </Button>
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
                <Button
                  variant="link"
                  className="link-info"
                  title="Copy to clipboard."
                  onClick={(event) => {
                    copyToClipboard(entry.to);
                    event.currentTarget.blur();
                  }}
                >
                  <BsCopy />
                </Button>
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

```

# src/Components/EntryDetails.jsx

```javascript
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
                className="link-info"
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
                className={`link-info`}
              >
                {entry.from}
              </Link>
              <Button
                variant="link"
                className="link-info"
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
                className={`link-info`}
              >
                {entry.to}
              </Link>
              <Button
                variant="link"
                className="link-info"
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
                className="link-info"
                title="Copy to clipboard."
                onClick={(event) => {
                  copyToClipboard(entry.hash);
                  event.currentTarget.blur();
                }}
              >
                <BsCopy />
              </Button>
            </p>
            <p className="text-wrap">
              Signature:{" "}
              <div className="text-wrap text-break">
                {entry.signature}
                <Button
                  variant="link"
                  className="link-info"
                  title="Copy to clipboard."
                  onClick={(event) => {
                    copyToClipboard(entry.signature);
                    event.currentTarget.blur();
                  }}
                >
                  <BsCopy />
                </Button>
              </div>
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

```

# src/Components/Home.jsx

```javascript
import React from "react";
import BlockchainInfo from "./BlockchainInfo";
import BlockchainIntegrity from "./BlockchainIntegrity";
import BlocksSwiper from "./BlocksSwiper";

const Home = () => {
  return (
    <div>
      <h2 className="h3">Blockchain Info</h2>
      <BlockchainInfo />
      <h2 className="h3 mt-3">Blockchain Integrity</h2>
      <BlockchainIntegrity />
      <h2 className="h3 mt-3 mb-4">Latest Blocks</h2>
      <BlocksSwiper
        scope="latest"
        sort="desc"
        recordLimit={30}
        pageLimit={30}
      />
    </div>
  );
};

export default Home;

```

# src/Components/NavBar.jsx

```javascript
/*
  File: NavBar.jsx
  Description: This component renders the navigation bar for the application. It includes navigation links as well as a search form.
*/

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap"
import { BiSearchAlt2 } from "react-icons/bi"

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // const parsedTerm = parseInt(searchTerm);
    if (/^\d+$/.test(searchTerm) && parseInt(searchTerm) < 1000000000) {
      navigate(`/blocks/${searchTerm}`)
    } else if (/^[a-fA-F0-9]{64}$/.test(searchTerm)) {
      console.log("searchTerm", searchTerm)
      navigate(`/blocks/${encodeURIComponent(searchTerm)}`)
    } else if (
      /^(02|03)[a-fA-F0-9]{64}$/.test(searchTerm) ||
      searchTerm === "ICO" ||
      searchTerm === "INCENTIVE"
    ) {
      navigate(`/entries?publicKey=${encodeURIComponent(searchTerm)}`)
    } else if (/^[0-9A-Za-z_-]{21}$/.test(searchTerm)) {
      navigate(`/entries/${encodeURIComponent(searchTerm)}`)
    } else {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Blockcraft Explorer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/integrity">
              Integrity
            </Nav.Link>
            <Nav.Link as={Link} to="/blocks">
              Blocks
            </Nav.Link>
            <Nav.Link as={Link} to="/entries">
              Entries
            </Nav.Link>
            <Nav.Link as={Link} to="/nodes">
              Nodes
            </Nav.Link>
          </Nav>
          <Form className="d-flex" onSubmit={handleSubmit}>
            <FormControl
              type="search"
              placeholder="Search Blockchain"
              className="me-2"
              aria-label="Search"
              title="Enter a block index, block hash or entry ID"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSubmit(event)
              }}
            />
            <Button variant="outline-info" type="submit">
              <BiSearchAlt2 className="text-info" size={24} />
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar

```

# src/Components/Nodes.jsx

```javascript
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
                  <Card.Text>IP: {node.ip}</Card.Text>
                  <Card.Text>URL: {node.url}</Card.Text>
                  <Card.Text>P2P Port: {node.p2pPort}</Card.Text>
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

```

# src/Components/SearchResults.jsx

```javascript
import React from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");

  return (
    <Container>
      <h2 className="h3">Search Results</h2>
      <p>
        No results found for <span className="text-info">"{query}"</span>.{" "}
        <br></br>Try entering a valid block index, block hash or entry ID.
      </p>
    </Container>
  );
};

export default SearchResults;

```

# src/Components/ValidationIcon.jsx

```javascript
/*
  File: ValidationIcon.jsx
  Description: This component displays a validation icon along with a label. If the validation fails, it also displays an alert with the details of the related errors. The icon, label, and errors are passed as props to the component. The icon changes based on the 'isValid' prop, and the alert is only displayed if there are errors.  This component is consumed by the BlockchainIntegrity component. 
*/

import React from "react";
import { Alert, ListGroup } from "react-bootstrap";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";

const ValidationIcon = ({ isValid, label, errors = [] }) => {
  return (
    <ListGroup.Item className="border-0 d-flex align-items-start">
      <div className="me-3">
        {isValid ? (
          <BiCheckCircle className="text-success" size={32} />
        ) : (
          <BiXCircle className="text-danger" size={32} />
        )}
      </div>
      <div>
        <span className="fw-bold">{label}</span>
        {errors.length > 0 && (
          <Alert variant="danger" className="ms-4 mt-3">
            {errors.map((error, index) => (
              <p key={index} className="my-0">
                Block {error.blockNumber} failed {error.errorType} validation
                test
              </p>
            ))}
          </Alert>
        )}
      </div>
    </ListGroup.Item>
  );
};

export default ValidationIcon;

```

# src/index.jsx

```javascript
/*
  File: index.jsx
  Description: Starting point for React application (gets injected into index.html). 
  Redux store, client router, component entry point and style imports can be found in this file.
*/

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./Components/App";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./override.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

```

# src/store/blockSelectedSlice.js

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBlockDetails = createAsyncThunk(
  "blockSelected/fetchDetails",
  async (blockIdentifier, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/blocks/${blockIdentifier}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const initialState = {
  selectedBlock: null,
  isLoading: false,
  error: null,
};

const blockSelectedSlice = createSlice({
  name: "blockSelected",
  initialState,
  reducers: {
    resetSelectedBlock: (state) => {
      state.selectedBlock = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlockDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBlock = action.payload;
        state.error = null;
      })
      .addCase(fetchBlockDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSelectedBlock } = blockSelectedSlice.actions;
export default blockSelectedSlice.reducer;

```

# src/store/blockchainInfoSlice.js

```javascript
/*
  File: blockchainInfoSlice.js
  Description: This Redux slice manages the state and actions related to the blockchain information. It includes an async thunk to fetch the blockchain information from the blockchain node, and reducers to handle the different states of the fetch operation (pending, fulfilled, rejected). The slice also includes a reducer to reset any error that occurred during the fetch operation. The state includes the blockchain's name, creation date, current height, hash rate, difficulty, total supply, loading status, and any error message when such data is applicable.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBlockchainIntegrity } from "./blockchainIntegritySlice";
import axios from "axios";

export const fetchBlockchainInfo = createAsyncThunk(
  "blockchainInfo/fetch",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get("/api/chain/info");
      dispatch(fetchBlockchainIntegrity());
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const initialState = {
  blockchainName: "",
  bornOn: null,
  currentHeight: 0,
  hashRate: null,
  difficulty: null,
  totalSupply: null,
  isLoading: false,
  error: null,
};

const blockchainInfoSlice = createSlice({
  name: "blockchainInfo",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockchainInfo.pending, (state) => {
        if (!state.currentHeight) {
          state.isLoading = true;
        }
      })
      .addCase(fetchBlockchainInfo.fulfilled, (state, action) => {
        state.blockchainName = action.payload.blockchainName;
        state.bornOn = action.payload.bornOn;
        state.currentHeight = action.payload.currentHeight;
        if ("hashRate" in action.payload) {
          state.hashRate = action.payload.hashRate;
        }
        if ("difficulty" in action.payload) {
          state.difficulty = action.payload.difficulty;
        }
        if ("totalSupply" in action.payload) {
          state.totalSupply = action.payload.totalSupply;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchBlockchainInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blockchainInfoSlice.actions;

export default blockchainInfoSlice.reducer;

```

# src/store/blockchainIntegritySlice.js

```javascript
/*
  File: blockchainIntegritySlice.js
  Description: This Redux slice manages the state and actions related to the blockchain integrity. It includes an async thunk to fetch the blockchain integrity from the node, and reducers to handle the different states of the fetch operation (pending, fulfilled, rejected). The slice also includes a reducer to reset any error that occurred during the fetch operation. The state includes the blockchain's validity, block count, hash validity, previous hash validity, timestamp validity, index validity, validation errors, loading status, and any error message when such data is applicable.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBlockchainIntegrity = createAsyncThunk(
  "blockchainIntegrity/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/chain/integrity");
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const blockchainIntegritySlice = createSlice({
  name: "blockchainIntegrity",
  initialState: {
    isValid: true,
    blockCount: 0,
    areHashesValid: true,
    arePreviousHashesValid: true,
    areTimestampsValid: true,
    areIndexesValid: true,
    validationErrors: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockchainIntegrity.pending, (state) => {
        if (!state.blockCount) {
          state.isLoading = true;
        }
      })
      .addCase(fetchBlockchainIntegrity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isValid = action.payload.isValid;
        state.blockCount = action.payload.blockCount;
        state.areHashesValid = action.payload.areHashesValid;
        state.arePreviousHashesValid = action.payload.arePreviousHashesValid;
        state.areTimestampsValid = action.payload.areTimestampsValid;
        state.areIndexesValid = action.payload.areIndexesValid;
        state.validationErrors = action.payload.errors || [];
        state.error = null;
      })
      .addCase(fetchBlockchainIntegrity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blockchainIntegritySlice.actions;

export default blockchainIntegritySlice.reducer;

```

# src/store/blocksSlice.js

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blocks: [],
  meta: {},
  isLoading: false,
  error: null,
};

export const fetchBlocks = createAsyncThunk(
  "blocksRange/fetchBlocks",
  async (
    { scope, sort, recordLimit, pageLimit, startIndex, page = 1 } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/blocks", {
        params: { scope, sort, page, pageLimit, recordLimit, startIndex },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data?.message ||
          `Server responded with status: ${error.response.status}`;
        return rejectWithValue(message);
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetBlocks: (state) => {
      state.blocks = [];
      state.meta = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlocks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlocks.fulfilled, (state, action) => {
        state.blocks = action.payload.blocks;
        state.meta = action.payload.meta;
        state.isLoading = false;
      })
      .addCase(fetchBlocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetBlocks } = blocksSlice.actions;
export default blocksSlice.reducer;

```

# src/store/entriesSlice.js

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  entries: [],
  meta: {},
  isLoading: false,
  error: null,
};

export const fetchEntries = createAsyncThunk(
  "entries/fetchEntries",
  async (
    { scope, sort, page, pageLimit, publicKey } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/entries", {
        params: { scope, sort, page, pageLimit, publicKey },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetEntries: (state) => {
      state.entries = [];
      state.meta = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.entries = action.payload.entries;
        state.meta = action.payload.meta;
        state.isLoading = false;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetEntries } = entriesSlice.actions;

export default entriesSlice.reducer;

```

# src/store/entrySelectedSlice.js

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEntryDetails = createAsyncThunk(
  "entrySelected/fetchDetails",
  async (entryIdentifier, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/entries/${entryIdentifier}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const initialState = {
  selectedEntry: null,
  isLoading: false,
  error: null,
};

const entrySelectedSlice = createSlice({
  name: "entrySelected",
  initialState,
  reducers: {
    resetSelectedEntry: (state) => {
      state.selectedEntry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntryDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEntryDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEntry = action.payload;
        state.error = null;
      })
      .addCase(fetchEntryDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSelectedEntry } = entrySelectedSlice.actions;
export default entrySelectedSlice.reducer;

```

# src/store/index.js

```javascript
/*
  File: index.js
  Description: This file sets up the Redux store for the application. It imports the reducers from each of the redux slice files and combines them using the configureStore function from Redux Toolkit. The resulting store is then exported for use in the application.
*/

import { configureStore } from "@reduxjs/toolkit";
import blockchainInfoReducer from "./blockchainInfoSlice";
import blockchainIntegrityReducer from "./blockchainIntegritySlice";
import blocksReducer from "./blocksSlice";
import selectedBlockReducer from "./blockSelectedSlice";
import nodesReducer from "./nodesSlice";
import entriesReducer from "./entriesSlice";
import selectedEntryReducer from "./entrySelectedSlice";

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
    blockchainIntegrity: blockchainIntegrityReducer,
    blocks: blocksReducer,
    selectedBlock: selectedBlockReducer,
    entries: entriesReducer,
    selectedEntry: selectedEntryReducer,
    nodes: nodesReducer,
  },
});

export default store;

```

# src/store/nodesSlice.js

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  nodes: [],
  isLoading: false,
  error: null,
};

export const fetchNodes = createAsyncThunk(
  "nodes/fetchNodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/nodes");
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetNodes: (state) => {
      state.nodes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNodes.fulfilled, (state, action) => {
        state.nodes = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchNodes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetNodes } = nodesSlice.actions;

export default nodesSlice.reducer;

```

