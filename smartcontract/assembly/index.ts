import { Item, itemsStorage} from "./model";
import { context, ContractPromiseBatch, u128 } from "near-sdk-as";

// buying a game item from the marketplace
export function buyGameItem(itemId: string): void {
	const item = getItem(itemId);
	if (item == null) {
		throw new Error("game item not found");
	}
	assert(
		item.price.toString() == context.attachedDeposit.toString(),
		"attached deposit should be greater than the item price"
	);
	assert(item.forSale == true, "Item is not for sale");
	assert(
		item.owner.toString() != context.sender.toString(),
		"You can't buy your own item"
	);
	ContractPromiseBatch.create(item.owner).transfer(context.attachedDeposit);
	item.buyItem();
	itemsStorage.set(item.id, item);
}

/**
 * @dev request a game item exchange
 * @param requestItemId id of the item caller wishes to trade his item with
 * @param forItemId id of the item set for exchange by caller
 */
export function requestExchange(
	requestItemId: string,
	forItemId: string
): void {

	const forItem = getItem(forItemId);
	const requestItem = getItem(requestItemId);
	
  if (forItem == null || requestItem == null) {
		throw new Error("one of the game items not found");
	}
  assert(forItem.owner.toString() == context.sender.toString(),"You don't have permission to exchange this item");
  assert(requestItem.forExchange == true && forItem.forExchange == true,"one of the items is not available for exchange");
  assert(requestItem.canBeExchanged() == true, "Requested item already has a request for trade");
  assert(forItem.canBeExchanged() == true, "For item already has a request for trade");
  
  forItem.lockForExchange(requestItem.id);
  requestItem.requestExchange(forItem.id);
	itemsStorage.set(requestItem.id, requestItem);
	itemsStorage.set(forItem.id, forItem);
}


/**
 * @dev reject a request for exchange
 * @param requestItemId id of the item caller wishes to trade his item with
 * @param forItemId id of the item set for exchange by caller
 */
 export function rejectExchange(
	itemId: string
): void {

	const item= getItem(itemId);
	
  if (item == null) {
		throw new Error("game item not found");
	}
  assert(item.owner.toString() == context.sender.toString(),"You don't have permission to exchange this item");
  assert(item.canBeExchanged() == false, "Requested item doesn't have a request for trade");

  const forItem = getItem(item.requestExchangeId);
  if(forItem == null){
    throw new Error("game item not found");
  }
  item.rejectExchange();
  forItem.rejectExchange();
	itemsStorage.set(item.id, item);
	itemsStorage.set(forItem.id, forItem);
}

/**
 * @dev allow items' owners to accept a trading offer and initiate the trade
 * @param itemId of item to initiate exchange offer
 */
export function exchangeGameItem(
	itemId: string
): void {

	const item= getItem(itemId);
	
  if (item == null) {
		throw new Error("game item not found");
	}
  assert(item.owner.toString() == context.sender.toString(),"You don't have permission to exchange this item");
  assert(item.canBeExchanged() == false, "Requested item doesn't have a request for trade");
  
  const forItem = getItem(item.requestExchangeId);
  if(forItem == null){
    throw new Error("game item not found");
  }
  item.exchange(forItem.owner);
  forItem.exchange(context.predecessor);
	itemsStorage.set(item.id, item);
	itemsStorage.set(forItem.id, forItem);
}

// changing the forsale property of a gaming item
export function toggleForsale(itemId: string): void {
	const item = getItem(itemId);
	if (item == null) {
		throw new Error("item not found");
	}
	if (item.owner != context.sender.toString()) {
		throw new Error("You don't have permission");
	}
  assert(item.canBeExchanged() == true, "You have to reject the current trading offer first");
	item.toggleForSale();
	itemsStorage.set(item.id, item);
}

// changing the forexchange property of the game item
export function toggleForexchange(itemId: string): void {
	const item = getItem(itemId);
	if (item == null) {
		throw new Error("item not found");
	}
	if (item.owner != context.sender.toString()) {
		throw new Error("You don't have permission");
	}
  assert(item.forSale == false, "Item needs to not be on sale");
  assert(item.canBeExchanged() == true, "You have to reject the current trading offer first");
	item.toggleForExchange();
	itemsStorage.set(item.id, item);
}

/**
 *
 * adding an item to the marketplace
 */
export function setItem(item: Item): void {
	let storedItem = itemsStorage.get(item.id);
	if (storedItem !== null) {
		throw new Error(`an item with id=${item.id} already exists`);
	}
	itemsStorage.set(item.id, Item.fromPayload(item));
	ownersStorage.set(context.sender, true);
}

export function getItem(id: string): Item | null {
	return itemsStorage.get(id);
}



/**
 *
 * A function that returns an array of itemsfor all accounts
 *
 */
export function getItems(): Array<Item> {
	return itemsStorage.values();
}
