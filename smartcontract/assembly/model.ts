import { PersistentUnorderedMap, context, PersistentMap, u128 } from "near-sdk-as";


@nearBindgen
export class Item {
    id: string;
    gameTitle: string;
    itemCategory: string;
    description: string;
    image: string;
    price: u128;
    owner: string;
    forSale: bool;
    forExchange: bool;

    public static fromPayload(payload: Item): Item {
        const item = new Item();
        item.id = payload.id;
        item.gameTitle = payload.gameTitle;
        item.itemCategory = payload.itemCategory;
        item.description = payload.description;
        item.image = payload.image;
        item.price = payload.price;
        item.owner = context.sender;
        item.forSale = false;
        item.forExchange = false;
        return item;
    }
    

}



export const itemsStorage = new PersistentUnorderedMap<string, Item>("LISTED_ITEMS");
export const ownersStorage = new PersistentUnorderedMap<string, bool>("LISTED_OWNERS");