// src/components/LogoutConfirmationModal.tsx

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface LogoutConfirmationModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: () => void;
  handleDontSave: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ show, handleClose, handleSave, handleDontSave }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Save Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>Would you like to save your information for a faster login next time?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDontSave}>
          No
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutConfirmationModal;
