import { Item, itemsStorage, ownersStorage} from './model';
import { context, ContractPromiseBatch, u128 } from "near-sdk-as";


 // buying a game item from the marketplace
export function buyGameItem(itemId: string): void {
    const item = getItem(itemId);
    if (item == null) {
        throw new Error("game item not found");
    }
    if (item.price.toString() != context.attachedDeposit.toString()) {
        throw new Error("attached deposit should be greater than the item price");
    }
    if (item.forSale !== true){
        throw new Error("item is not for sale")
    }

    ContractPromiseBatch.create(item.owner).transfer(context.attachedDeposit);
    item.forSale = false;
    itemsStorage.set(item.id, item);
  
}

// exchanging a game item by passing in your own item id to be traded
export function exchangeGameItem(owneritemId: string, calleritemId: string): void {
  const owneritem = getItem(owneritemId);
  const calleritem = getItem(calleritemId);
  const caller = getOwnerExist(context.sender)
  if (owneritem == null) {
      throw new Error("game item not found");
  }

  if ( caller != true) {
    throw new Error("you don't have an item to exchange");
}

  if (calleritem == null) {
    throw new Error("game item not found");
}

if (calleritem.owner != context.sender.toString()) {
  throw new Error("You don't have permission to exchange this item");
}

  if (owneritem.forExchange != true){
    throw new Error("this item is not available for exchange");
}
if (calleritem.forExchange != true){
  throw new Error("this item is not available for exchange");
}
 
 
  owneritem.owner = calleritem.owner;
  calleritem.owner = owneritem.owner;

  itemsStorage.set(owneritem.id, owneritem);
  itemsStorage.set(calleritem.id, calleritem);
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
    item.forSale = !item.forSale; 
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
    item.forExchange = !item.forExchange; 
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


export function getItem(id: string): Item| null {
    return itemsStorage.get(id);
}


export function getOwnerExist(address: string): bool| null {
  return ownersStorage.get(address);
}

/**
 * 
 * A function that returns an array of itemsfor all accounts
 * 
 */
export function getItems(): Array<Item> {
    return itemsStorage.values();
}
