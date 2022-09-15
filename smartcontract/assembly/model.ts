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
    requestExchangeId: string; // id of the item a user wants to trade the current item with
    approvedExchange: bool; // boolean to keep track of whether requestExchangeId has been accepted by the item owner
    approvedId: string; // agreed item's id to exchange with
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
        item.requestExchangeId ="";
        item.approvedExchange= false;
        item.approvedId ="";
        return item;
    }
    
    public buyItem(): void {
        this.forSale = false;
        this.forExchange = false;
        this.owner = context.sender;
    }

    public rejectExchange(): void {
        this.requestExchangeId = "";
        this.approvedExchange = false;
        this.approvedId = "";
    }
    
    public requestExchange(itemId: string): void {
        this.requestExchangeId = itemId;
        this.forExchange = false; // to prevent override of the first request for exchange
    }
    // locks an item for an exchange after request an exchanging offer
    public lockForExchange(itemId: string): void {
        this.forExchange = false;
        this.requestExchangeId = "";
        this.approvedExchange = true;
        this.approvedId = itemId;
    }
    
    /**
     * 
     * @returns bool whether item can have request for trades/toggle exchange status/ toggle sale status
     */
    public canBeExchanged(): bool {
        if(this.requestExchangeId != "" || this.approvedId != ""){
            return false;
        }else {
            return true;
        }
    }

    public exchange(owner: string): void {
        this.approvedExchange = false;
        this.approvedId = "";
        this.requestExchangeId ="";
        this.forSale = false;
        this.owner = owner;
    }

    public toggleForSale(): void {
        this.forSale = !this.forSale;
    }

    public toggleForExchange(): void {
        this.forExchange = !this.forExchange;
    }

}



export const itemsStorage = new PersistentUnorderedMap<string, Item>("LISTED_ITEMS");
