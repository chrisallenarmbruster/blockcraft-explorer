# README.md

```markdown
# blockcraft-explorer

React frontend for my Blockcraft blockchain package

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
          <Route path="/blocks" element={<Blocks />} />
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
import React from "react";

const Blocks = () => {
  return (
    <div>
      <h1>Welcome to Blocks Page</h1>
      <p>This is the Blocks page of our application.</p>
    </div>
  );
};

export default Blocks;

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

# src/store/index.js

```javascript
/*
  File: index.js
  Description: This file sets up the Redux store for the application. It imports the reducers from each of the redux slice files and combines them using the configureStore function from Redux Toolkit. The resulting store is then exported for use in the application.
*/

import { configureStore } from "@reduxjs/toolkit";
import blockchainInfoReducer from "./blockchainInfoSlice";
import blockchainIntegrityReducer from "./blockchainIntegritySlice";

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
    blockchainIntegrity: blockchainIntegrityReducer,
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
          <Route path="/blocks" element={<Blocks />} />
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
import React from "react";

const Blocks = () => {
  return (
    <div>
      <h1>Welcome to Blocks Page</h1>
      <p>This is the Blocks page of our application.</p>
    </div>
  );
};

export default Blocks;

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

# src/store/index.js

```javascript
/*
  File: index.js
  Description: This file sets up the Redux store for the application. It imports the reducers from each of the redux slice files and combines them using the configureStore function from Redux Toolkit. The resulting store is then exported for use in the application.
*/

import { configureStore } from "@reduxjs/toolkit";
import blockchainInfoReducer from "./blockchainInfoSlice";
import blockchainIntegrityReducer from "./blockchainIntegritySlice";

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
    blockchainIntegrity: blockchainIntegrityReducer,
  },
});

export default store;

```

