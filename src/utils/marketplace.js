import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export function makeItem(item) {
  item.id = uuid4();
  item.price = parseNearAmount(item.price + "");
  return window.contract.setItem({ item });
}

export async function buyItem({ Id, price }) {
  await window.contract.buyGameItem({ itemId: Id }, GAS, price);
}

export function exchangeItem( ownerId, callerId ) {
  return window.contract.exchangeGameItem( { owneritemId: ownerId, calleritemId: callerId }, GAS );
}

export function changeForsale( Id ) {
  return window.contract.toggleForsale( { itemId: Id }, GAS );
}

export function changeForexchange( Id ) {
  return window.contract.toggleForexchange( { itemId: Id }, GAS );
}

export function getItems() {
  return window.contract.getItems();
}


