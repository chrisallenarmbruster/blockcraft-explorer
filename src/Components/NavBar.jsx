/*
  File: NavBar.jsx
  Description: This component renders the navigation bar for the application. It includes navigation links as well as a search form.
*/

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { BiSearchAlt2 } from "react-icons/bi";

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsedTerm = parseInt(searchTerm);
    if (!isNaN(parsedTerm) && parsedTerm < 1000000000) {
      navigate(`/blocks/${parsedTerm}`);
    } else {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

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
                if (event.key === "Enter") handleSubmit(event);
              }}
            />
            <Button variant="outline-success" type="submit">
              <BiSearchAlt2 />
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
