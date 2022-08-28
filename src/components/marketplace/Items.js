import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddItem from "./AddItem";
import Item from "./Item";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getItems as getItemList,
  buyItem,
  makeItem,
  exchangeItem,
  changeForsale,
  changeForexchange,
} from "../../utils/marketplace";


const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const account = window.walletConnection.account();

  const getItems = useCallback(async () => {
    try {
      setLoading(true);
      setItems(await getItemList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addItem = async (data) => {
    setLoading(true);

    try {
      await makeItem(data).then((resp) => {
        toast(<NotificationSuccess text="Item added successfully." />);
        getItems();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add a item." />);
    } finally {
      setLoading(false);
    }
  };

  const exchange = async (ownerId, callerId) => {
    setLoading(true);

    try {
      await exchangeItem(ownerId, callerId).then((resp) => {
        toast(<NotificationSuccess text="item exchanged successfully." />);
        getItems();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to exchange item." />);
    } finally {
      setLoading(false);
    }
  };

  const toggleForsale = async ( Id ) => {
    setLoading(true);

    try {
      await changeForsale(Id).then((resp) => {
        toast(<NotificationSuccess text="you successfully changed the forsale property" />);
        getItems();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to change for sale property." />);
    } finally {
      setLoading(false);
    }
  };


  const toggleForexchange = async (Id) => {
    setLoading(true);
    try {
      await changeForexchange(Id).then((resp) => {
        toast(<NotificationSuccess text="you successfully changed the forexchange property" />);
        getItems();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to change for exchange property." />);
    } finally {
      setLoading(false);
    }
  };



  const buy = async (id, price) => {
    try {
      await buyItem({
        id,
        price,
      }).then((resp) =>{
        toast(<NotificationSuccess text="item bought successfully" />);
        getItems()
      });
    } catch (error) {
      toast(<NotificationError text="Failed to purchase item." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Near Game Element Marketplace</h1>
            <AddItem save={addItem} />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {items.map((_item) => (
              <Item
                item={{
                  ..._item,
                }}
                buy={buy}
                exchange={exchange}
                toggleForexchange={toggleForexchange}
                toggleForsale={toggleForsale}
                isOwner = {account.accountId === _item.owner}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Items;
