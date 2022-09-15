import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddItem = ({ save }) => {
  const [gameTitle, setGameTitle] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);

  const isFormFilled = () => gameTitle && itemCategory && description && image && price;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i class="bi bi-plus"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New game Item</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="game title"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setGameTitle(e.target.value);
                }}
                placeholder="Enter title of the game"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputCategory"
              label="item category"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="item category"
                onChange={(e) => {
                 setItemCategory(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Item Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputImageURL"
              label="url"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="image"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </FloatingLabel>
            
            <FloatingLabel
              controlId="inputPrice"
              label="Price"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Price"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </FloatingLabel>

          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                gameTitle,
                itemCategory,
                description,
                image,
                price,
              });
              handleClose();
            }}
          >
            Save item
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddItem.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddItem;
