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
  Offcanvas,
} from "react-bootstrap";
import { BiSearchAlt2 } from "react-icons/bi";

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowOffcanvas(false);
    if (/^\d+$/.test(searchTerm) && parseInt(searchTerm) < 1000000000) {
      navigate(`/blocks/${searchTerm}`);
    } else if (/^[a-fA-F0-9]{64}$/.test(searchTerm)) {
      console.log("searchTerm", searchTerm);
      navigate(`/blocks/${encodeURIComponent(searchTerm)}`);
    } else if (
      /^(02|03)[a-fA-F0-9]{64}$/.test(searchTerm) ||
      searchTerm === "ICO" ||
      searchTerm === "INCENTIVE"
    ) {
      navigate(`/entries?publicKey=${encodeURIComponent(searchTerm)}`);
    } else if (/^[0-9A-Za-z_-]{21}$/.test(searchTerm)) {
      navigate(`/entries/${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleNavClick = () => {
    setShowOffcanvas(false);
  };

  const expand = "lg";

  return (
    <Navbar bg="dark" variant="dark" expand={expand} collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/">
          Blockcraft Explorer
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls={`offcanvasNavbar-expand-${expand}`}
          onClick={() => setShowOffcanvas(true)}
        />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          className="bg-dark text-light"
        >
          <Offcanvas.Header closeButton className="custom-off-canvas-header">
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Blockcraft Explorer
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="pt-0">
            <Nav className="justify-content-start flex-grow-1 pe-3 text-light">
              <Nav.Link as={Link} to="/" onClick={handleNavClick}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/integrity" onClick={handleNavClick}>
                Integrity
              </Nav.Link>
              <Nav.Link as={Link} to="/blocks" onClick={handleNavClick}>
                Blocks
              </Nav.Link>
              <Nav.Link as={Link} to="/entries" onClick={handleNavClick}>
                Entries
              </Nav.Link>
              <Nav.Link as={Link} to="/nodes" onClick={handleNavClick}>
                Nodes
              </Nav.Link>
            </Nav>
            <Form
              className={`${showOffcanvas ? "mt-3" : ""} d-flex`}
              onSubmit={handleSubmit}
            >
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
              <Button variant="outline-info" type="submit">
                <BiSearchAlt2 className="text-info" size={24} />
              </Button>
            </Form>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavBar;
