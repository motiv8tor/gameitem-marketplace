import React from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import { Card, Button, Col, Badge, Stack, Form } from "react-bootstrap";
import { useState } from "react";

const Item = ({ item, buy, exchange, toggleForexchange, toggleForsale, isOwner}) => {
  const { id, gameTitle, itemCategory, description, image, price, owner, forSale, forExchange } = item;

    const [callerId, setCallerId] = useState('');
  

  const triggerBuy = () => {
    buy(id, price);
  };

  const triggerexchange = () => {
    exchange(id, callerId);
  };


  const triggertoggleForsale = () => {
    toggleForsale(id);
  };
  const triggertoggleForexchange = () => {
    toggleForexchange(id);
  };

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={3}>
            <span className="font-monospace text-secondary">{owner}</span>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={image} alt={author} style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>Game title: {gameTitle}</Card.Title>
          <Card.Title> Category: {itemCategory}</Card.Title>
          <Card.Text className="flex-grow-1 ">{description}</Card.Text>
          <Card.Text className="flex-grow-1 ">{forSale ? "This item is for sale": "This item is not for sale"}</Card.Text>
          <Card.Text className="flex-grow-1 ">{forExchange ? "This item is available for exchange": "This item is not available for exchange"}</Card.Text>

{isOwner === true  && (
    <> 

<Button
  variant="primary"
  className={"mb-4"}
  onClick={() =>triggertoggleForsale()}
>
{forSale ? "Set for sale" : "Set not for sale"}
</Button>
</>
)}

{isOwner === true  && (
    <> 

<Button
  variant="primary"
  className={"mb-4"}
  onClick={() =>triggertoggleForexchange()}
>
  {forExchange ? "Set for exchange" : "Set not for exchange"}
</Button>
</>
)}


{isOwner !== true  && forExchange == true &&(
    <> 
    <Form.Control
     className={"pt-2 mb-1"}
      type="number"
       placeholder="Enter your element Id"
       onChange={(e) => {
         setCallerId(e.target.value);
        }}
    />

<Button
  variant="primary"
  className={"mb-4"}
  onClick={() =>triggerexchange()}
>
  
</Button>
</>
)}



         {isOwner!== true && forSale == true &&(
          <Button
            variant="outline-dark"
            onClick={triggerBuy}
            className="w-100 py-3"
          >
            Buy for {utils.format.formatNearAmount(price)} NEAR
          </Button>
          
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

Item.propTypes = {
  item: PropTypes.instanceOf(Object).isRequired,
  buy: PropTypes.func.isRequired,
};

export default Item;