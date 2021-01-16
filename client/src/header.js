import React, { useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const urldep = "https://goalbully.com/"


function Header() {
  const [showabout, setShowabout] = useState(false);
  return (
    <div style={{ fontFamily: 'monospace', wordSpacing: '-3px'}}>
      <Modal show={showabout} onHide={() => setShowabout(false)}>
        <Modal.Header closeButton>
          <Modal.Title>About us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5>Yustol LDA</h5>
            <p>We craft beautiful software for beautiful people</p>
            <hr></hr>

            <h5>Address</h5>
            <p>Largo do Barão de São Martinho 34, Braga - 4700-314, Portugal</p>
            <hr></hr>

            <h5>Email</h5>
            <p>yfwidget@gmail.com</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowabout(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href={urldep}>Goal Bully</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text >
            <a style={{cursor: 'pointer'}} onClick={() => setShowabout(true)} >About us </a>
          </Navbar.Text>|
          <Navbar.Text >
            <a href="mailto:yfwidget@gmail.com" >Contact us </a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
