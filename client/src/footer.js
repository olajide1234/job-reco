import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { gdprtext } from './gdprtext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function Footer() {
  const [showgdpr, setShowgdpr] = useState(false);

  return (
    <div style={{ fontFamily: 'monospace', wordSpacing: '-3px'}}>
      <Modal show={showgdpr} onHide={() => setShowgdpr(false)}>
        <Modal.Header closeButton>
          <Modal.Title>GDPR Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {gdprtext}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowgdpr(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ position: 'fixed', bottom: '0', zIndex: '10002', backgroundColor: '#232f3e', color: 'white', width: '100%', textAlign: 'center' }}>
        Made with love in Portugal | <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={(() => setShowgdpr(true))}>GDPR Compliant</span>
      </div>
    </div>
  );
}

export default Footer;
