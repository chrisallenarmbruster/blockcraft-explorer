# README.md

```markdown
# blockcraft-explorer

React frontend for my Blockcraft blockchain package

```

# genSourceCode.js

```javascript
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
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockchainInfo } from "../store/blockchainInfoSlice";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const BlockchainInfo = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    blockchainName,
    bornOn,
    currentHeight,
    difficulty,
    totalSupply,
    isLoading,
    error,
  } = useSelector((state) => state.blockchainInfo);

  useEffect(() => {
    dispatch(fetchBlockchainInfo());
  }, [dispatch, location.pathname]);

  if (isLoading) return <p>Loading blockchain info...</p>;
  if (error) {
    return (
      <Alert variant="danger">Error fetching blockchain info: {error}</Alert>
    );
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Container>
      {!error && (
        <>
          <Row className="mb-3">
            <Col xs={12} md={6} lg={3}>
              <strong>Name:</strong> {blockchainName}
            </Col>
            <Col xs={12} md={6} lg={3}>
              <strong>Born On:</strong> {formatDate(bornOn)}
            </Col>
            <Col xs={12} md={6} lg={3}>
              <strong>Height:</strong> {currentHeight}
            </Col>
            {difficulty && (
              <Col xs={12} md={6} lg={3}>
                <strong>Difficulty:</strong> {difficulty}
              </Col>
            )}
            {!difficulty && <Col lg={3}></Col>}
          </Row>
          {totalSupply !== null && (
            <Row>
              <Col xs={12} lg={{ span: 6, offset: 3 }}>
                <strong>Total Supply:</strong> {totalSupply}
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default BlockchainInfo;

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
        console.log("response", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data", data);
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

const Home = () => {
  return (
    <div>
      <h1 className="h3">Blockchain Info</h1>
      <BlockchainInfo />
    </div>
  );
};

export default Home;

```

# src/Components/NavBar.jsx

```javascript
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

# src/index.jsx

```javascript
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
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchBlockchainInfo = createAsyncThunk(
  "blockchainInfo/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("/api/chain/info");
      if (!response.ok) {
        throw new Error(`server responded with status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message.toString());
    }
  }
);

const initialState = {
  blockchainName: "",
  bornOn: null,
  currentHeight: 0,
  difficulty: null,
  totalSupply: null,
  isLoading: false,
  error: null,
};

const blockchainInfoSlice = createSlice({
  name: "blockchainInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockchainInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlockchainInfo.fulfilled, (state, action) => {
        state.blockchainName = action.payload.blockchainName;
        state.bornOn = action.payload.bornOn;
        state.currentHeight = action.payload.currentHeight;
        if ("difficulty" in action.payload) {
          state.difficulty = action.payload.difficulty;
        }
        if ("totalSupply" in action.payload) {
          state.totalSupply = action.payload.totalSupply;
        }
        state.isLoading = false;
      })
      .addCase(fetchBlockchainInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default blockchainInfoSlice.reducer;

```

# src/store/index.js

```javascript
import { configureStore } from "@reduxjs/toolkit";
import blockchainInfoReducer from "./blockchainInfoSlice";

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
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
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockchainInfo } from "../store/blockchainInfoSlice";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const BlockchainInfo = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    blockchainName,
    bornOn,
    currentHeight,
    difficulty,
    totalSupply,
    isLoading,
    error,
  } = useSelector((state) => state.blockchainInfo);

  useEffect(() => {
    dispatch(fetchBlockchainInfo());
  }, [dispatch, location.pathname]);

  if (isLoading) return <p>Loading blockchain info...</p>;
  if (error) {
    return (
      <Alert variant="danger">Error fetching blockchain info: {error}</Alert>
    );
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Container>
      {!error && (
        <>
          <Row className="mb-3">
            <Col xs={12} md={6} lg={3}>
              <strong>Name:</strong> {blockchainName}
            </Col>
            <Col xs={12} md={6} lg={3}>
              <strong>Born On:</strong> {formatDate(bornOn)}
            </Col>
            <Col xs={12} md={6} lg={3}>
              <strong>Height:</strong> {currentHeight}
            </Col>
            {difficulty && (
              <Col xs={12} md={6} lg={3}>
                <strong>Difficulty:</strong> {difficulty}
              </Col>
            )}
            {!difficulty && <Col lg={3}></Col>}
          </Row>
          {totalSupply !== null && (
            <Row>
              <Col xs={12} lg={{ span: 6, offset: 3 }}>
                <strong>Total Supply:</strong> {totalSupply}
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default BlockchainInfo;

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
        console.log("response", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data", data);
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

const Home = () => {
  return (
    <div>
      <h1 className="h3">Blockchain Info</h1>
      <BlockchainInfo />
    </div>
  );
};

export default Home;

```

# src/Components/NavBar.jsx

```javascript
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

# src/index.jsx

```javascript
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
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchBlockchainInfo = createAsyncThunk(
  "blockchainInfo/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("/api/chain/info");
      if (!response.ok) {
        throw new Error(`server responded with status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message.toString());
    }
  }
);

const initialState = {
  blockchainName: "",
  bornOn: null,
  currentHeight: 0,
  difficulty: null,
  totalSupply: null,
  isLoading: false,
  error: null,
};

const blockchainInfoSlice = createSlice({
  name: "blockchainInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockchainInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlockchainInfo.fulfilled, (state, action) => {
        state.blockchainName = action.payload.blockchainName;
        state.bornOn = action.payload.bornOn;
        state.currentHeight = action.payload.currentHeight;
        if ("difficulty" in action.payload) {
          state.difficulty = action.payload.difficulty;
        }
        if ("totalSupply" in action.payload) {
          state.totalSupply = action.payload.totalSupply;
        }
        state.isLoading = false;
      })
      .addCase(fetchBlockchainInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default blockchainInfoSlice.reducer;

```

# src/store/index.js

```javascript
import { configureStore } from "@reduxjs/toolkit";
import blockchainInfoReducer from "./blockchainInfoSlice";

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
  },
});

export default store;

```

