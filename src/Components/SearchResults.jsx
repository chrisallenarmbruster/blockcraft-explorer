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
        No results found for "{query}". <br></br>Try entering a valid block
        index, block hash or entry ID.
      </p>
    </Container>
  );
};

export default SearchResults;
