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
          <Route path="/blocks" element={<Blocks />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/entry-details" element={<EntryDetails />} />
          <Route path="/integrity" element={<ChainIntegrityChecker />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/blocks/:blockIdentifier" element={<BlockDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
