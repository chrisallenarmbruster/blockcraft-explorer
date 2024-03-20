# README.md

```markdown
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

```

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
      `# ${relativeFilePath}\n\n\`\`\`${language}\n${data}\n\`\`\`\n\n`
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
  "version": "0.1.0",
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
    "@vitejs/plugin-react": "^4.2.1",
    "bootstrap": "^5.3.3",
    "bootstrap-icons": "^1.11.3",
    "glob": "^10.3.10",
    "react": "^18.2.0",
    "react-bootstrap": "^2.10.1",
    "react-dom": "^18.2.0",
    "react-redux": "^9.1.0",
    "react-router-dom": "^6.22.3",
    "redux": "^5.0.1",
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
import BlocksInfiniteScroll from "./BlocksInfiniteScroll";
import Entries from "./Entries";
import Nodes from "./Nodes";
import { Container } from "react-bootstrap";

function App() {
  return (
    <>
      <NavBar />
      <Container className="mt-3">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/blocks" element={<BlocksInfiniteScroll />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/integrity" element={<ChainIntegrityChecker />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;

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
              lg={2}
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
              lg={2}
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
              lg={2}
              className="d-flex align-items-center"
            >
              <span className="d-flex align-items-center text-nowrap">
                <strong>Height:&nbsp;</strong>
                {currentHeight}
                <Button variant="link" onClick={handleRefresh}>
                  <i className="bi bi-arrow-clockwise"></i>
                </Button>
              </span>
            </Col>
          )}
          {difficulty && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={2}
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
              lg={2}
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
              lg={2}
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
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlocks, resetError } from "../store/blocksSlice"; // Adjust the import path as needed

const Blocks = () => {
  const dispatch = useDispatch();
  const {
    blocks,
    isLoading,
    sort,
    lastFetchedIndex,
    nextIndexReference,
    error,
  } = useSelector((state) => state.blocks);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!blocks.length && !isLoading) {
      dispatch(fetchBlocks({ sort: "asc" }));
    }
  }, [dispatch, blocks.length]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100;
      const nearTop = window.scrollY <= 100;
      if (
        (nearBottom && sort === "asc") ||
        (nearTop && nextIndexReference && sort === "asc")
      ) {
        if (!isFetching) {
          setIsFetching(true);
          fetchMoreBlocks();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, sort]);

  const fetchMoreBlocks = () => {
    dispatch(
      fetchBlocks({
        startWithIndex: lastFetchedIndex + 1,
        sort,
        limit: 10,
      })
    ).finally(() => setIsFetching(false));
  };

  const switchSortOrder = () => {
    const newSortOrder = sort === "asc" ? "desc" : "asc";
    dispatch(fetchBlocks({ sort: newSortOrder }));
  };

  return (
    <div>
      <button onClick={switchSortOrder}>
        Switch Sort Order (Current: {sort.toUpperCase()})
      </button>
      {error && <p>Error fetching blocks: {error} </p>}
      <ul>
        {blocks.map((block, index) => (
          <li key={index}>
            Block {block.index}: {block.hash}
          </li>
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default Blocks;

```

# src/Components/BlocksInfiniteScroll.jsx

```javascript
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlocks } from "../store/blocksSlice"; // Adjust the import path as needed

const BlocksInfiniteScroll = () => {
  const dispatch = useDispatch();
  const { blocks, isLoading, nextIndexReference, error } = useSelector(
    (state) => state.blocks
  );
  const [fetching, setFetching] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (!blocks.length && !isLoading) dispatch(fetchBlocks({}));
  }, [blocks.length, isLoading, dispatch]);

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        fetching
      )
        return;
      setFetching(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetching]);

  // Fetch more blocks on scroll
  useEffect(() => {
    if (fetching && nextIndexReference) {
      dispatch(fetchBlocks({ startWithIndex: nextIndexReference }));
      setFetching(false);
    }
  }, [fetching, nextIndexReference, dispatch]);

  return (
    <div>
      {blocks.map((block, index) => (
        <div key={index}>
          Block {block.index}: {block.hash}
        </div>
      ))}
      {isLoading && <p>Loading more blocks...</p>}
      {error && <p>Error fetching blocks: {error}</p>}
    </div>
  );
};

export default BlocksInfiniteScroll;

```

# src/Components/ChainIntegrityChecker.jsx

```javascript
import React, { useState, useEffect } from "react";

function ChainIntegrityChecker() {
  const [chainIntegrity, setChainIntegrity] = useState({
    isLoading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    async function fetchChainIntegrity() {
      try {
        const response = await fetch("/api/chain/integrity");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setChainIntegrity({ isLoading: false, data, error: null });
      } catch (error) {
        setChainIntegrity({
          isLoading: false,
          data: null,
          error: error.message,
        });
      }
    }

    fetchChainIntegrity();
  }, []);

  return (
    <div>
      <h1>Welcome to the Chain Integrity Check Page</h1>
      {chainIntegrity.isLoading ? (
        <p>Loading...</p>
      ) : chainIntegrity.error ? (
        <p>Error: {chainIntegrity.error}</p>
      ) : (
        <pre>{JSON.stringify(chainIntegrity.data, null, 2)}</pre>
      )}
    </div>
  );
}

export default ChainIntegrityChecker;

```

# src/Components/Entries.jsx

```javascript
import React from "react";

const Entries = () => {
  return (
    <div>
      <h1>Welcome to Entries Page</h1>
      <p>This is the Entries page of our application.</p>
    </div>
  );
};

export default Entries;

```

# src/Components/Home.jsx

```javascript
import React from "react";
import BlockchainInfo from "./BlockchainInfo";
import BlockchainIntegrity from "./BlockchainIntegrity";

const Home = () => {
  return (
    <div>
      <h2 className="h3">Blockchain Info</h2>
      <BlockchainInfo />
      <h2 className="h3 mt-3">Blockchain Integrity</h2>
      <BlockchainIntegrity />
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

import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

const NavBar = () => {
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
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

```

# src/Components/Nodes.jsx

```javascript
import React from "react";

const Nodes = () => {
  return (
    <div>
      <h1>Welcome to Nodes Page</h1>
      <p>This is the Nodes page of our application.</p>
    </div>
  );
};

export default Nodes;

```

# src/Components/ValidationIcon.jsx

```javascript
/*
  File: ValidationIcon.jsx
  Description: This component displays a validation icon along with a label. If the validation fails, it also displays an alert with the details of the related errors. The icon, label, and errors are passed as props to the component. The icon changes based on the 'isValid' prop, and the alert is only displayed if there are errors.  This component is consumed by the BlockchainIntegrity component. 
*/

import React from "react";
import { Alert, ListGroup } from "react-bootstrap";

const ValidationIcon = ({ isValid, label, errors = [] }) => {
  return (
    <ListGroup.Item className="border-0">
      <span className="me-3">
        {isValid ? (
          <i className="bi bi-check-lg text-success"></i>
        ) : (
          <i className="bi bi-x-lg text-danger"></i>
        )}
      </span>
      <span className="fw-bold">{label}</span>
      {errors.length > 0 && (
        <Alert variant="danger" className="ms-4 mt-3">
          {errors.map((error, index) => (
            <p key={index} className="my-0">
              Block {error.blockNumber} failed {error.errorType} validation test
            </p>
          ))}
        </Alert>
      )}
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

# src/store/blockchainInfoSlice.js

```javascript
/*
  File: blockchainInfoSlice.js
  Description: This Redux slice manages the state and actions related to the blockchain information. It includes an async thunk to fetch the blockchain information from the blockchain node, and reducers to handle the different states of the fetch operation (pending, fulfilled, rejected). The slice also includes a reducer to reset any error that occurred during the fetch operation. The state includes the blockchain's name, creation date, current height, hash rate, difficulty, total supply, loading status, and any error message when such data is applicable.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBlockchainIntegrity } from "./blockchainIntegritySlice";

export const fetchBlockchainInfo = createAsyncThunk(
  "blockchainInfo/fetch",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch("/api/chain/info");
      if (!response.ok) {
        dispatch(fetchBlockchainIntegrity());
        throw new Error(`server responded with status: ${response.status}`);
      }
      const data = await response.json();
      dispatch(fetchBlockchainIntegrity());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
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

export const fetchBlockchainIntegrity = createAsyncThunk(
  "blockchainIntegrity/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/chain/integrity");
      if (!response.ok) {
        throw new Error(`server responded with status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
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

const initialState = {
  blocks: [],
  blockIds: {},
  isLoading: false,
  sort: "desc",
  lastFetchedIndex: null,
  nextIndexReference: null,
  error: null,
};

export const fetchBlocks = createAsyncThunk(
  "blocks/fetchBlocks",
  async (
    { startWithIndex = 0, limit = 10, sort = "asc" },
    { rejectWithValue }
  ) => {
    console.log(startWithIndex, limit, sort);
    try {
      const response = await fetch(
        `/api/blocks?limit=${limit}&sort=${sort}&startWithIndex=${startWithIndex}`
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlocks.pending, (state, action) => {
        if (!state.blocks.length) {
          state.isLoading = true;
        }
      })
      .addCase(fetchBlocks.fulfilled, (state, action) => {
        const { blocks, meta } = action.payload;

        const newBlocks = blocks.filter(
          (block) => !state.blockIds[block.index]
        );
        newBlocks.forEach((block) => (state.blockIds[block.index] = true));

        state.isLoading = false;
        state.blocks =
          state.sort === "asc"
            ? [...state.blocks, ...newBlocks]
            : [...newBlocks, ...state.blocks];

        state.lastFetchedIndex = meta.lastIndexInResponse;
        state.nextIndexReference = meta.nextIndexReference;
        state.sort = meta.sort;
        state.error = null;
      })
      .addCase(fetchBlocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blocksSlice.actions;
export default blocksSlice.reducer;

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

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
    blockchainIntegrity: blockchainIntegrityReducer,
    blocks: blocksReducer,
  },
});

export default store;

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
import BlocksInfiniteScroll from "./BlocksInfiniteScroll";
import Entries from "./Entries";
import Nodes from "./Nodes";
import { Container } from "react-bootstrap";

function App() {
  return (
    <>
      <NavBar />
      <Container className="mt-3">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/blocks" element={<BlocksInfiniteScroll />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/integrity" element={<ChainIntegrityChecker />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;

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
              lg={2}
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
              lg={2}
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
              lg={2}
              className="d-flex align-items-center"
            >
              <span className="d-flex align-items-center text-nowrap">
                <strong>Height:&nbsp;</strong>
                {currentHeight}
                <Button variant="link" onClick={handleRefresh}>
                  <i className="bi bi-arrow-clockwise"></i>
                </Button>
              </span>
            </Col>
          )}
          {difficulty && (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={2}
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
              lg={2}
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
              lg={2}
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
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlocks, resetError } from "../store/blocksSlice"; // Adjust the import path as needed

const Blocks = () => {
  const dispatch = useDispatch();
  const {
    blocks,
    isLoading,
    sort,
    lastFetchedIndex,
    nextIndexReference,
    error,
  } = useSelector((state) => state.blocks);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!blocks.length && !isLoading) {
      dispatch(fetchBlocks({ sort: "asc" }));
    }
  }, [dispatch, blocks.length]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100;
      const nearTop = window.scrollY <= 100;
      if (
        (nearBottom && sort === "asc") ||
        (nearTop && nextIndexReference && sort === "asc")
      ) {
        if (!isFetching) {
          setIsFetching(true);
          fetchMoreBlocks();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, sort]);

  const fetchMoreBlocks = () => {
    dispatch(
      fetchBlocks({
        startWithIndex: lastFetchedIndex + 1,
        sort,
        limit: 10,
      })
    ).finally(() => setIsFetching(false));
  };

  const switchSortOrder = () => {
    const newSortOrder = sort === "asc" ? "desc" : "asc";
    dispatch(fetchBlocks({ sort: newSortOrder }));
  };

  return (
    <div>
      <button onClick={switchSortOrder}>
        Switch Sort Order (Current: {sort.toUpperCase()})
      </button>
      {error && <p>Error fetching blocks: {error} </p>}
      <ul>
        {blocks.map((block, index) => (
          <li key={index}>
            Block {block.index}: {block.hash}
          </li>
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default Blocks;

```

# src/Components/BlocksInfiniteScroll.jsx

```javascript
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlocks } from "../store/blocksSlice"; // Adjust the import path as needed

const BlocksInfiniteScroll = () => {
  const dispatch = useDispatch();
  const { blocks, isLoading, nextIndexReference, error } = useSelector(
    (state) => state.blocks
  );
  const [fetching, setFetching] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (!blocks.length && !isLoading) dispatch(fetchBlocks({}));
  }, [blocks.length, isLoading, dispatch]);

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        fetching
      )
        return;
      setFetching(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetching]);

  // Fetch more blocks on scroll
  useEffect(() => {
    if (fetching && nextIndexReference) {
      dispatch(fetchBlocks({ startWithIndex: nextIndexReference }));
      setFetching(false);
    }
  }, [fetching, nextIndexReference, dispatch]);

  return (
    <div>
      {blocks.map((block, index) => (
        <div key={index}>
          Block {block.index}: {block.hash}
        </div>
      ))}
      {isLoading && <p>Loading more blocks...</p>}
      {error && <p>Error fetching blocks: {error}</p>}
    </div>
  );
};

export default BlocksInfiniteScroll;

```

# src/Components/ChainIntegrityChecker.jsx

```javascript
import React, { useState, useEffect } from "react";

function ChainIntegrityChecker() {
  const [chainIntegrity, setChainIntegrity] = useState({
    isLoading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    async function fetchChainIntegrity() {
      try {
        const response = await fetch("/api/chain/integrity");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setChainIntegrity({ isLoading: false, data, error: null });
      } catch (error) {
        setChainIntegrity({
          isLoading: false,
          data: null,
          error: error.message,
        });
      }
    }

    fetchChainIntegrity();
  }, []);

  return (
    <div>
      <h1>Welcome to the Chain Integrity Check Page</h1>
      {chainIntegrity.isLoading ? (
        <p>Loading...</p>
      ) : chainIntegrity.error ? (
        <p>Error: {chainIntegrity.error}</p>
      ) : (
        <pre>{JSON.stringify(chainIntegrity.data, null, 2)}</pre>
      )}
    </div>
  );
}

export default ChainIntegrityChecker;

```

# src/Components/Entries.jsx

```javascript
import React from "react";

const Entries = () => {
  return (
    <div>
      <h1>Welcome to Entries Page</h1>
      <p>This is the Entries page of our application.</p>
    </div>
  );
};

export default Entries;

```

# src/Components/Home.jsx

```javascript
import React from "react";
import BlockchainInfo from "./BlockchainInfo";
import BlockchainIntegrity from "./BlockchainIntegrity";

const Home = () => {
  return (
    <div>
      <h2 className="h3">Blockchain Info</h2>
      <BlockchainInfo />
      <h2 className="h3 mt-3">Blockchain Integrity</h2>
      <BlockchainIntegrity />
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

import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

const NavBar = () => {
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
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

```

# src/Components/Nodes.jsx

```javascript
import React from "react";

const Nodes = () => {
  return (
    <div>
      <h1>Welcome to Nodes Page</h1>
      <p>This is the Nodes page of our application.</p>
    </div>
  );
};

export default Nodes;

```

# src/Components/ValidationIcon.jsx

```javascript
/*
  File: ValidationIcon.jsx
  Description: This component displays a validation icon along with a label. If the validation fails, it also displays an alert with the details of the related errors. The icon, label, and errors are passed as props to the component. The icon changes based on the 'isValid' prop, and the alert is only displayed if there are errors.  This component is consumed by the BlockchainIntegrity component. 
*/

import React from "react";
import { Alert, ListGroup } from "react-bootstrap";

const ValidationIcon = ({ isValid, label, errors = [] }) => {
  return (
    <ListGroup.Item className="border-0">
      <span className="me-3">
        {isValid ? (
          <i className="bi bi-check-lg text-success"></i>
        ) : (
          <i className="bi bi-x-lg text-danger"></i>
        )}
      </span>
      <span className="fw-bold">{label}</span>
      {errors.length > 0 && (
        <Alert variant="danger" className="ms-4 mt-3">
          {errors.map((error, index) => (
            <p key={index} className="my-0">
              Block {error.blockNumber} failed {error.errorType} validation test
            </p>
          ))}
        </Alert>
      )}
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

# src/store/blockchainInfoSlice.js

```javascript
/*
  File: blockchainInfoSlice.js
  Description: This Redux slice manages the state and actions related to the blockchain information. It includes an async thunk to fetch the blockchain information from the blockchain node, and reducers to handle the different states of the fetch operation (pending, fulfilled, rejected). The slice also includes a reducer to reset any error that occurred during the fetch operation. The state includes the blockchain's name, creation date, current height, hash rate, difficulty, total supply, loading status, and any error message when such data is applicable.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBlockchainIntegrity } from "./blockchainIntegritySlice";

export const fetchBlockchainInfo = createAsyncThunk(
  "blockchainInfo/fetch",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch("/api/chain/info");
      if (!response.ok) {
        dispatch(fetchBlockchainIntegrity());
        throw new Error(`server responded with status: ${response.status}`);
      }
      const data = await response.json();
      dispatch(fetchBlockchainIntegrity());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
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

export const fetchBlockchainIntegrity = createAsyncThunk(
  "blockchainIntegrity/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/chain/integrity");
      if (!response.ok) {
        throw new Error(`server responded with status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
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

const initialState = {
  blocks: [],
  blockIds: {},
  isLoading: false,
  sort: "desc",
  lastFetchedIndex: null,
  nextIndexReference: null,
  error: null,
};

export const fetchBlocks = createAsyncThunk(
  "blocks/fetchBlocks",
  async (
    { startWithIndex = 0, limit = 10, sort = "asc" },
    { rejectWithValue }
  ) => {
    console.log(startWithIndex, limit, sort);
    try {
      const response = await fetch(
        `/api/blocks?limit=${limit}&sort=${sort}&startWithIndex=${startWithIndex}`
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlocks.pending, (state, action) => {
        if (!state.blocks.length) {
          state.isLoading = true;
        }
      })
      .addCase(fetchBlocks.fulfilled, (state, action) => {
        const { blocks, meta } = action.payload;

        const newBlocks = blocks.filter(
          (block) => !state.blockIds[block.index]
        );
        newBlocks.forEach((block) => (state.blockIds[block.index] = true));

        state.isLoading = false;
        state.blocks =
          state.sort === "asc"
            ? [...state.blocks, ...newBlocks]
            : [...newBlocks, ...state.blocks];

        state.lastFetchedIndex = meta.lastIndexInResponse;
        state.nextIndexReference = meta.nextIndexReference;
        state.sort = meta.sort;
        state.error = null;
      })
      .addCase(fetchBlocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blocksSlice.actions;
export default blocksSlice.reducer;

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

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
    blockchainIntegrity: blockchainIntegrityReducer,
    blocks: blocksReducer,
  },
});

export default store;

```

